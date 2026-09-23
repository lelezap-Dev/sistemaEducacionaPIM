using System.Globalization;
using Microsoft.EntityFrameworkCore;
using SistemaEducacional.Infrastructure.Data;
using SistemaEducacional.Application.DTOs;

namespace SistemaEducacional.Application.Services;

// ================================================================
//  FarolService — Farol de Evasão
//
//  Sinaliza alunos em risco de abandono cruzando cinco sinais que o
//  Lumina já registra: notas (Resultados), acessos (Sessoes), leitura
//  de conteúdos (LeituraConteudos) e atividades não entregues.
//
//  A regra é deliberadamente transparente: cada sinal soma pontos
//  fixos e vem acompanhado de uma frase que explica o motivo. Assim
//  o professor sabe POR QUE o aluno foi sinalizado e pode agir,
//  em vez de receber um número sem explicação.
//
//  Escopo (minimização de dados, LGPD art. 6º, III):
//    Secretaria → todos os alunos matriculados
//    Professor  → apenas alunos das próprias turmas, e somente com
//                 dados das matérias dessas turmas
//  O aluno não tem acesso ao farol: é ferramenta de apoio, não rótulo.
// ================================================================

public class FarolService(AppDbContext db)
{
    // ── Parâmetros da regra (todos num só lugar) ──────────────────
    const double AproveitamentoCritico   = 40;   // % abaixo do qual o risco é grave
    const double AproveitamentoMinimo    = 60;   // % abaixo do qual há alerta
    const int    PontosDesempenhoCritico = 35;
    const int    PontosDesempenhoBaixo   = 25;

    const int    DiasInatividadeGrave   = 14;
    const int    DiasInatividadeLeve    = 7;
    const int    PontosInatividadeGrave = 25;
    const int    PontosInatividadeLeve  = 12;

    const int    DiasSemLeitura   = 14;
    const int    PontosSemLeitura = 15;

    const int    DiasToleranciaAtividade = 7;    // só cobra atividade disponível há 7+ dias
    const int    PontosMuitasPendentes   = 20;
    const int    PontosAlgumaPendente    = 10;

    const int    RecentesParaQueda  = 3;         // compara as 3 últimas com as anteriores
    const double QuedaSignificativa = 20;        // pontos percentuais
    const int    PontosQueda        = 15;

    const int    LimiarRiscoAlto = 60;
    const int    LimiarAtencao   = 30;

    // As frases vão direto para a tela: vírgula decimal em qualquer
    // servidor. Não usa CultureInfo("pt-BR") porque contêineres em modo
    // de globalização invariante lançam exceção ao carregar culturas.
    static readonly NumberFormatInfo Virgula = new() { NumberDecimalSeparator = "," };
    static string Pct(double valor) => valor.ToString("0.#", Virgula) + "%";

    static string Atividades(int n) => n == 1 ? "1 atividade" : $"{n} atividades";

    public async Task<FarolResumoDto> GerarAsync(string? professorCpf, DateTime? referencia = null)
    {
        var agora = referencia ?? DateTime.UtcNow;

        // ── 1. Matrículas no escopo ───────────────────────────────
        var matriculas = await db.TurmaAlunos
            .Where(ta => professorCpf == null || ta.Turma!.ProfessorCpf == professorCpf)
            .Where(ta => ta.Aluno!.Perfil == "Aluno" && ta.Aluno.Status == "Ativo")
            .Select(ta => new
            {
                ta.AlunoCpf,
                ta.Aluno!.Nome,
                ta.TurmaCodigo,
                ta.Turma!.MateriaId
            })
            .ToListAsync();

        var cpfs       = matriculas.Select(m => m.AlunoCpf).Distinct().ToList();
        var materiaIds = matriculas.Select(m => m.MateriaId).Distinct().ToList();

        // ── 2. Carga em lote (uma consulta por fonte, não por aluno) ──
        var resultados = await db.Resultados
            .Where(r => cpfs.Contains(r.AlunoCpf) && materiaIds.Contains(r.MateriaId))
            .Select(r => new { r.AlunoCpf, r.AtividadeId, r.Acertos, r.TotalPerguntas, r.RealizadoEm })
            .ToListAsync();

        var ultimosAcessos = await db.Sessoes
            .Where(s => cpfs.Contains(s.UsuarioCpf))
            .GroupBy(s => s.UsuarioCpf)
            .Select(g => new { Cpf = g.Key, Ultimo = g.Max(s => s.Inicio) })
            .ToDictionaryAsync(x => x.Cpf, x => x.Ultimo);

        var leituras = await db.LeituraConteudos
            .Where(l => cpfs.Contains(l.AlunoCpf) && materiaIds.Contains(l.Conteudo!.MateriaId))
            .Select(l => new { l.AlunoCpf, l.LidoEm })
            .ToListAsync();

        var materiasComConteudo = (await db.Conteudos
            .Where(c => materiaIds.Contains(c.MateriaId))
            .Select(c => c.MateriaId)
            .Distinct()
            .ToListAsync()).ToHashSet();

        var limiteAtividade = agora.AddDays(-DiasToleranciaAtividade);
        var atividades = await db.Atividades
            .Where(a => materiaIds.Contains(a.MateriaId) && a.CriadaEm <= limiteAtividade)
            .Select(a => new { a.Id, a.MateriaId, a.TurmaCodigo })
            .ToListAsync();

        // ── 3. Avaliação aluno a aluno, em memória ────────────────
        var alunos = new List<FarolAlunoDto>();

        foreach (var grupo in matriculas.GroupBy(m => new { m.AlunoCpf, m.Nome }))
        {
            var cpf           = grupo.Key.AlunoCpf;
            var turmasAluno   = grupo.Select(m => m.TurmaCodigo).ToHashSet();
            var materiasAluno = grupo.Select(m => m.MateriaId).ToHashSet();
            var sinais        = new List<SinalRiscoDto>();

            var meus = resultados
                .Where(r => r.AlunoCpf == cpf && r.TotalPerguntas > 0)
                .OrderBy(r => r.RealizadoEm)
                .Select(r => new { r.AtividadeId, Pct = (double)r.Acertos / r.TotalPerguntas * 100 })
                .ToList();

            // Sinal 1 — desempenho
            if (meus.Count > 0)
            {
                var media = meus.Average(r => r.Pct);
                if (media < AproveitamentoCritico)
                    sinais.Add(new("DESEMPENHO", $"Aproveitamento médio de {Pct(media)}, abaixo de {Pct(AproveitamentoCritico)}.", PontosDesempenhoCritico));
                else if (media < AproveitamentoMinimo)
                    sinais.Add(new("DESEMPENHO", $"Aproveitamento médio de {Pct(media)}, abaixo de {Pct(AproveitamentoMinimo)}.", PontosDesempenhoBaixo));
            }

            // Sinal 2 — inatividade
            if (!ultimosAcessos.TryGetValue(cpf, out var ultimo))
                sinais.Add(new("INATIVIDADE", "Nunca acessou o sistema.", PontosInatividadeGrave));
            else
            {
                var dias = (int)(agora - ultimo).TotalDays;
                if (dias >= DiasInatividadeGrave)
                    sinais.Add(new("INATIVIDADE", $"Sem acessar o sistema há {dias} dias.", PontosInatividadeGrave));
                else if (dias >= DiasInatividadeLeve)
                    sinais.Add(new("INATIVIDADE", $"Sem acessar o sistema há {dias} dias.", PontosInatividadeLeve));
            }

            // Sinal 3 — leitura parada (só faz sentido se há o que ler)
            if (materiasAluno.Overlaps(materiasComConteudo))
            {
                var limiteLeitura = agora.AddDays(-DiasSemLeitura);
                if (!leituras.Any(l => l.AlunoCpf == cpf && l.LidoEm >= limiteLeitura))
                    sinais.Add(new("LEITURA", $"Nenhum conteúdo lido nos últimos {DiasSemLeitura} dias.", PontosSemLeitura));
            }

            // Sinal 4 — atividades pendentes
            var disponiveis = atividades
                .Where(a => materiasAluno.Contains(a.MateriaId)
                         && (a.TurmaCodigo == null || turmasAluno.Contains(a.TurmaCodigo)))
                .Select(a => a.Id)
                .ToList();
            if (disponiveis.Count > 0)
            {
                var entregues = meus.Select(r => r.AtividadeId).ToHashSet();
                var pendentes = disponiveis.Count(id => !entregues.Contains(id));
                if (pendentes > 0)
                {
                    var muitas = pendentes * 2 >= disponiveis.Count;
                    sinais.Add(new("PENDENCIAS",
                        $"{pendentes} de {Atividades(disponiveis.Count)} sem entrega, abertas há mais de {DiasToleranciaAtividade} dias.",
                        muitas ? PontosMuitasPendentes : PontosAlgumaPendente));
                }
            }

            // Sinal 5 — queda de rendimento
            if (meus.Count > RecentesParaQueda)
            {
                var recentes   = meus.TakeLast(RecentesParaQueda).Average(r => r.Pct);
                var anteriores = meus.SkipLast(RecentesParaQueda).Average(r => r.Pct);
                if (anteriores - recentes >= QuedaSignificativa)
                    sinais.Add(new("QUEDA",
                        $"Rendimento caiu de {Pct(anteriores)} para {Pct(recentes)} nas últimas {RecentesParaQueda} atividades.",
                        PontosQueda));
            }

            var pontuacao = Math.Min(100, sinais.Sum(s => s.Pontos));
            var nivel = pontuacao >= LimiarRiscoAlto ? "Alto"
                      : pontuacao >= LimiarAtencao   ? "Atencao"
                      : "Regular";

            alunos.Add(new FarolAlunoDto(
                cpf, grupo.Key.Nome, pontuacao, nivel,
                turmasAluno.OrderBy(t => t).ToList(), sinais));
        }

        alunos = alunos
            .OrderByDescending(a => a.Pontuacao)
            .ThenBy(a => a.AlunoNome)
            .ToList();

        return new FarolResumoDto(
            alunos.Count,
            alunos.Count(a => a.Nivel == "Alto"),
            alunos.Count(a => a.Nivel == "Atencao"),
            alunos.Count(a => a.Nivel == "Regular"),
            agora,
            alunos);
    }
}
