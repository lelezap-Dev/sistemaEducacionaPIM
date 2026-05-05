using Microsoft.EntityFrameworkCore;
using SistemaEducacional.Data;
using SistemaEducacional.DTOs;
using SistemaEducacional.Models;

namespace SistemaEducacional.Services;

// ================================================================
//  UsuarioService — CRUD de usuários (usado pela Secretaria)
// ================================================================

public class UsuarioService(AppDbContext db)
{
    public async Task<List<UsuarioDto>> ListarAsync() =>
        await db.Usuarios
            .OrderBy(u => u.Nome)
            .Select(u => new UsuarioDto(u.Cpf, u.Nome, u.Email, u.Perfil, u.Status, u.DataCadastro))
            .ToListAsync();

    public async Task<UsuarioDto?> BuscarAsync(string cpf) =>
        await db.Usuarios
            .Where(u => u.Cpf == cpf)
            .Select(u => new UsuarioDto(u.Cpf, u.Nome, u.Email, u.Perfil, u.Status, u.DataCadastro))
            .FirstOrDefaultAsync();

    public async Task<List<UsuarioDto>> ListarPendentesAsync() =>
        await db.Usuarios
            .Where(u => u.Status == "Pendente")
            .OrderBy(u => u.DataCadastro)
            .Select(u => new UsuarioDto(u.Cpf, u.Nome, u.Email, u.Perfil, u.Status, u.DataCadastro))
            .ToListAsync();

    public async Task<(bool sucesso, string mensagem)> AprovarAsync(string cpf)
    {
        var u = await db.Usuarios.FindAsync(cpf);
        if (u == null) return (false, "Usuário não encontrado.");
        u.Status = "Ativo";
        await db.SaveChangesAsync();
        return (true, "Usuário aprovado com sucesso!");
    }

    public async Task<(bool sucesso, string mensagem)> RejeitarAsync(string cpf)
    {
        var u = await db.Usuarios.FindAsync(cpf);
        if (u == null) return (false, "Usuário não encontrado.");
        u.Status = "Rejeitado";
        await db.SaveChangesAsync();
        return (true, "Usuário rejeitado.");
    }

    public async Task<(bool sucesso, string mensagem)> EditarAsync(string cpf, EditarUsuarioRequest req)
    {
        var u = await db.Usuarios.FindAsync(cpf);
        if (u == null) return (false, "Usuário não encontrado.");

        if (!string.IsNullOrWhiteSpace(req.Nome))   u.Nome  = req.Nome.Trim();
        if (!string.IsNullOrWhiteSpace(req.Email))  u.Email = req.Email.Trim().ToLower();
        if (req.Perfil is "Aluno" or "Professor" or "Secretaria") u.Perfil = req.Perfil!;
        if (!string.IsNullOrWhiteSpace(req.NovaSenha))
            u.SenhaHash = BCrypt.Net.BCrypt.HashPassword(req.NovaSenha);

        await db.SaveChangesAsync();
        return (true, "Usuário atualizado!");
    }

    public async Task<(bool sucesso, string mensagem)> ExcluirAsync(string cpf)
    {
        var u = await db.Usuarios.FindAsync(cpf);
        if (u == null) return (false, "Usuário não encontrado.");
        db.Usuarios.Remove(u);
        await db.SaveChangesAsync();
        return (true, "Usuário excluído.");
    }
}

// ================================================================
//  MateriaService — CRUD de matérias e conteúdos
// ================================================================

public class MateriaService(AppDbContext db)
{
    // ── Matérias ──────────────────────────────────────────────────

    public async Task<List<MateriaDto>> ListarAsync(string? profCpf = null)
    {
        var q = db.Materias
            .Include(m => m.Professor)
            .Include(m => m.Conteudos)
            .AsQueryable();

        if (profCpf != null)
            q = q.Where(m => m.ProfessorCpf == profCpf);

        return await q.Select(m => new MateriaDto(
            m.Id, m.ProfessorCpf,
            m.Professor!.Nome,
            m.Nome, m.Descricao,
            m.Conteudos.Count,
            m.DataCriacao
        )).ToListAsync();
    }

    public async Task<(bool sucesso, string mensagem, Guid id)> CriarAsync(string profCpf, CriarMateriaRequest req)
    {
        var m = new Materia
        {
            ProfessorCpf = profCpf,
            Nome         = req.Nome.Trim(),
            Descricao    = req.Descricao.Trim()
        };
        db.Materias.Add(m);
        await db.SaveChangesAsync();
        return (true, "Matéria criada!", m.Id);
    }

    public async Task<(bool sucesso, string mensagem)> EditarAsync(Guid id, string profCpf, EditarMateriaRequest req)
    {
        var m = await db.Materias.FirstOrDefaultAsync(x => x.Id == id && x.ProfessorCpf == profCpf);
        if (m == null) return (false, "Matéria não encontrada.");

        if (!string.IsNullOrWhiteSpace(req.Nome))      m.Nome      = req.Nome.Trim();
        if (!string.IsNullOrWhiteSpace(req.Descricao)) m.Descricao = req.Descricao.Trim();

        await db.SaveChangesAsync();
        return (true, "Matéria atualizada.");
    }

    public async Task<(bool sucesso, string mensagem)> ExcluirAsync(Guid id, string profCpf)
    {
        var m = await db.Materias.FirstOrDefaultAsync(x => x.Id == id && x.ProfessorCpf == profCpf);
        if (m == null) return (false, "Matéria não encontrada.");

        if (await db.Turmas.AnyAsync(t => t.MateriaId == id))
            return (false, "Não é possível excluir: existem turmas vinculadas.");

        db.Materias.Remove(m);
        await db.SaveChangesAsync();
        return (true, "Matéria excluída.");
    }

    // ── Conteúdos ─────────────────────────────────────────────────

    public async Task<List<ConteudoDto>> ListarConteudosAsync(Guid materiaId, string? alunoCpf)
    {
        var lidos = alunoCpf == null ? new HashSet<Guid>() :
            (await db.LeituraConteudos
                .Where(l => l.AlunoCpf == alunoCpf)
                .Select(l => l.ConteudoId)
                .ToListAsync())
            .ToHashSet();

        return await db.Conteudos
            .Where(c => c.MateriaId == materiaId)
            .OrderBy(c => c.Ordem)
            .Select(c => new ConteudoDto(
                c.Id, c.MateriaId, c.Titulo, c.Texto, c.Ordem,
                lidos.Contains(c.Id)
            )).ToListAsync();
    }

    public async Task<(bool sucesso, string mensagem)> AdicionarConteudoAsync(
        Guid materiaId, string profCpf, CriarConteudoRequest req)
    {
        if (!await db.Materias.AnyAsync(m => m.Id == materiaId && m.ProfessorCpf == profCpf))
            return (false, "Matéria não encontrada.");

        db.Conteudos.Add(new Conteudo
        {
            MateriaId = materiaId,
            Titulo    = req.Titulo.Trim(),
            Texto     = req.Texto.Trim(),
            Ordem     = req.Ordem
        });
        await db.SaveChangesAsync();
        return (true, "Conteúdo adicionado.");
    }

    public async Task<(bool sucesso, string mensagem)> EditarConteudoAsync(
        Guid conteudoId, string profCpf, EditarConteudoRequest req)
    {
        var c = await db.Conteudos
            .Include(x => x.Materia)
            .FirstOrDefaultAsync(x => x.Id == conteudoId && x.Materia!.ProfessorCpf == profCpf);

        if (c == null) return (false, "Conteúdo não encontrado.");

        if (!string.IsNullOrWhiteSpace(req.Titulo)) c.Titulo = req.Titulo.Trim();
        if (!string.IsNullOrWhiteSpace(req.Texto))  c.Texto  = req.Texto.Trim();
        if (req.Ordem.HasValue) c.Ordem = req.Ordem.Value;

        await db.SaveChangesAsync();
        return (true, "Conteúdo atualizado.");
    }

    public async Task<(bool sucesso, string mensagem)> ExcluirConteudoAsync(Guid conteudoId, string profCpf)
    {
        var c = await db.Conteudos
            .Include(x => x.Materia)
            .FirstOrDefaultAsync(x => x.Id == conteudoId && x.Materia!.ProfessorCpf == profCpf);

        if (c == null) return (false, "Conteúdo não encontrado.");
        db.Conteudos.Remove(c);
        await db.SaveChangesAsync();
        return (true, "Conteúdo excluído.");
    }

    public async Task RegistrarLeituraAsync(string alunoCpf, Guid conteudoId)
    {
        if (!await db.LeituraConteudos.AnyAsync(l => l.AlunoCpf == alunoCpf && l.ConteudoId == conteudoId))
        {
            db.LeituraConteudos.Add(new LeituraConteudo
            {
                AlunoCpf   = alunoCpf,
                ConteudoId = conteudoId
            });
            await db.SaveChangesAsync();
        }
    }
}

// ================================================================
//  TurmaService — CRUD de turmas e matrículas
// ================================================================

public class TurmaService(AppDbContext db)
{
    public async Task<List<TurmaDto>> ListarAsync(string? profCpf = null)
    {
        var q = db.Turmas
            .Include(t => t.Professor)
            .Include(t => t.Materia)
            .Include(t => t.TurmaAlunos)
            .AsQueryable();

        if (profCpf != null) q = q.Where(t => t.ProfessorCpf == profCpf);

        return await q.Select(t => new TurmaDto(
            t.Codigo, t.ProfessorCpf, t.Professor!.Nome,
            t.Materia!.Nome, t.Horario,
            t.TurmaAlunos.Count, t.DataCriacao
        )).ToListAsync();
    }

    public async Task<List<TurmaDto>> ListarPorAlunoAsync(string alunoCpf) =>
        await db.TurmaAlunos
            .Where(ta => ta.AlunoCpf == alunoCpf)
            .Include(ta => ta.Turma!.Professor)
            .Include(ta => ta.Turma!.Materia)
            .Include(ta => ta.Turma!.TurmaAlunos)
            .Select(ta => new TurmaDto(
                ta.Turma!.Codigo, ta.Turma.ProfessorCpf,
                ta.Turma.Professor!.Nome, ta.Turma.Materia!.Nome,
                ta.Turma.Horario, ta.Turma.TurmaAlunos.Count,
                ta.Turma.DataCriacao
            )).ToListAsync();

    public async Task<(bool sucesso, string mensagem)> CriarAsync(string profCpf, CriarTurmaRequest req)
    {
        if (await db.Turmas.AnyAsync(t => t.Codigo == req.Codigo))
            return (false, "Código de turma já existe.");

        if (!await db.Materias.AnyAsync(m => m.Id == req.MateriaId && m.ProfessorCpf == profCpf))
            return (false, "Matéria não encontrada.");

        db.Turmas.Add(new Turma
        {
            Codigo       = req.Codigo.Trim(),
            ProfessorCpf = profCpf,
            MateriaId    = req.MateriaId,
            Horario      = req.Horario.Trim()
        });
        await db.SaveChangesAsync();
        return (true, "Turma criada!");
    }

    public async Task<(bool sucesso, string mensagem)> EditarAsync(
        string codigo, string profCpf, EditarTurmaRequest req)
    {
        var t = await db.Turmas.FirstOrDefaultAsync(
            x => x.Codigo == codigo && x.ProfessorCpf == profCpf);
        if (t == null) return (false, "Turma não encontrada.");

        if (!string.IsNullOrWhiteSpace(req.Horario)) t.Horario = req.Horario.Trim();

        await db.SaveChangesAsync();
        return (true, "Turma atualizada.");
    }

    public async Task<(bool sucesso, string mensagem)> ExcluirAsync(string codigo, string profCpf)
    {
        var t = await db.Turmas.FirstOrDefaultAsync(
            x => x.Codigo == codigo && x.ProfessorCpf == profCpf);
        if (t == null) return (false, "Turma não encontrada.");

        db.Turmas.Remove(t);
        await db.SaveChangesAsync();
        return (true, "Turma excluída.");
    }

    public async Task<(bool sucesso, string mensagem)> MatricularAsync(MatricularAlunoRequest req)
    {
        if (!await db.Usuarios.AnyAsync(u => u.Cpf == req.AlunoCpf && u.Perfil == "Aluno"))
            return (false, "Aluno não encontrado.");

        if (!await db.Turmas.AnyAsync(t => t.Codigo == req.TurmaCodigo))
            return (false, "Turma não encontrada.");

        if (await db.TurmaAlunos.AnyAsync(ta =>
                ta.AlunoCpf == req.AlunoCpf && ta.TurmaCodigo == req.TurmaCodigo))
            return (false, "Aluno já matriculado nesta turma.");

        db.TurmaAlunos.Add(new TurmaAluno
        {
            AlunoCpf    = req.AlunoCpf,
            TurmaCodigo = req.TurmaCodigo
        });
        await db.SaveChangesAsync();
        return (true, "Aluno matriculado com sucesso!");
    }

    public async Task<(bool sucesso, string mensagem)> DesmatricularAsync(
        string alunoCpf, string turmaCodigo)
    {
        var ta = await db.TurmaAlunos.FirstOrDefaultAsync(
            x => x.AlunoCpf == alunoCpf && x.TurmaCodigo == turmaCodigo);
        if (ta == null) return (false, "Matrícula não encontrada.");

        db.TurmaAlunos.Remove(ta);
        await db.SaveChangesAsync();
        return (true, "Aluno desmatriculado.");
    }

    public async Task<List<AlunoTurmaDto>> ListarAlunosDaTurmaAsync(string turmaCodigo) =>
        await db.TurmaAlunos
            .Where(ta => ta.TurmaCodigo == turmaCodigo)
            .Include(ta => ta.Aluno)
            .OrderBy(ta => ta.Aluno!.Nome)
            .Select(ta => new AlunoTurmaDto(ta.Aluno!.Cpf, ta.Aluno.Nome, ta.Aluno.Email))
            .ToListAsync();
}

// ================================================================
//  AtividadeService — CRUD de atividades, submissão e notas
// ================================================================

public class AtividadeService(AppDbContext db)
{
    public async Task<List<AtividadeDto>> ListarAsync(string? materiaId, string? alunoCpf)
    {
        var realizadas = alunoCpf == null ? new HashSet<Guid>() :
            (await db.Resultados
                .Where(r => r.AlunoCpf == alunoCpf)
                .Select(r => r.AtividadeId)
                .ToListAsync())
            .ToHashSet();

        var q = db.Atividades
            .Include(a => a.Materia)
            .Include(a => a.Perguntas)
            .AsQueryable();

        if (materiaId != null && Guid.TryParse(materiaId, out var mid))
            q = q.Where(a => a.MateriaId == mid);

        return await q.Select(a => new AtividadeDto(
            a.Id, a.MateriaId, a.Materia!.Nome,
            a.TurmaCodigo, a.Titulo, a.CriadaPorCpf,
            a.Perguntas.Count, a.CriadaEm,
            realizadas.Contains(a.Id)
        )).ToListAsync();
    }

    public async Task<AtividadeDetalheDto?> BuscarDetalheAsync(Guid id)
    {
        var a = await db.Atividades
            .Include(x => x.Materia)
            .Include(x => x.Perguntas)
                .ThenInclude(p => p.Alternativas)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (a == null) return null;

        return new AtividadeDetalheDto(
            a.Id, a.Titulo, a.Materia!.Nome,
            a.Perguntas.OrderBy(p => p.Ordem).Select(p => new PerguntaDto(
                p.Id, p.TextoPergunta, p.Ordem,
                p.Alternativas.OrderBy(alt => alt.Ordem).Select(alt => alt.Texto).ToList()
            )).ToList()
        );
    }

    public async Task<(bool sucesso, string mensagem, Guid id)> CriarAsync(
        string profCpf, CriarAtividadeRequest req)
    {
        if (!await db.Materias.AnyAsync(m => m.Id == req.MateriaId && m.ProfessorCpf == profCpf))
            return (false, "Matéria não encontrada.", Guid.Empty);

        var atividade = new Atividade
        {
            MateriaId    = req.MateriaId,
            TurmaCodigo  = req.TurmaCodigo,
            Titulo       = req.Titulo.Trim(),
            CriadaPorCpf = profCpf
        };

        foreach (var (pReq, i) in req.Perguntas.Select((p, i) => (p, i)))
        {
            var pergunta = new Pergunta
            {
                TextoPergunta   = pReq.TextoPergunta.Trim(),
                RespostaCorreta = pReq.RespostaCorreta.Trim(),
                Ordem           = pReq.Ordem == 0 ? i : pReq.Ordem
            };
            foreach (var (alt, j) in pReq.Alternativas.Select((a, j) => (a, j)))
                pergunta.Alternativas.Add(new Alternativa { Texto = alt.Trim(), Ordem = j });

            atividade.Perguntas.Add(pergunta);
        }

        db.Atividades.Add(atividade);
        await db.SaveChangesAsync();
        return (true, "Atividade criada!", atividade.Id);
    }

    public async Task<AtividadeDetalheCompletaDto?> BuscarDetalheCompletoAsync(Guid id, string profCpf)
    {
        var a = await db.Atividades
            .Include(x => x.Materia)
            .Include(x => x.Perguntas)
                .ThenInclude(p => p.Alternativas)
            .FirstOrDefaultAsync(x => x.Id == id && x.Materia!.ProfessorCpf == profCpf);

        if (a == null) return null;

        return new AtividadeDetalheCompletaDto(
            a.Id, a.Titulo, a.Materia!.Nome,
            a.Perguntas.OrderBy(p => p.Ordem).Select(p => new PerguntaComRespostaDto(
                p.Id, p.TextoPergunta, p.Ordem,
                p.Alternativas.OrderBy(alt => alt.Ordem).Select(alt => alt.Texto).ToList(),
                p.RespostaCorreta
            )).ToList()
        );
    }

    public async Task<(bool sucesso, string mensagem)> EditarAsync(
        Guid id, string profCpf, EditarAtividadeRequest req)
    {
        var a = await db.Atividades
            .Include(x => x.Materia)
            .Include(x => x.Perguntas)
                .ThenInclude(p => p.Alternativas)
            .FirstOrDefaultAsync(x => x.Id == id && x.Materia!.ProfessorCpf == profCpf);

        if (a == null) return (false, "Atividade não encontrada.");

        a.Titulo = req.Titulo.Trim();

        foreach (var p in a.Perguntas)
            db.Alternativas.RemoveRange(p.Alternativas);
        db.Perguntas.RemoveRange(a.Perguntas);

        foreach (var (pReq, i) in req.Perguntas.Select((p, i) => (p, i)))
        {
            var pergunta = new Pergunta
            {
                AtividadeId     = a.Id,
                TextoPergunta   = pReq.TextoPergunta.Trim(),
                RespostaCorreta = pReq.RespostaCorreta.Trim(),
                Ordem           = pReq.Ordem == 0 ? i : pReq.Ordem
            };
            foreach (var (alt, j) in pReq.Alternativas.Select((altText, j) => (altText, j)))
                pergunta.Alternativas.Add(new Alternativa { Texto = alt.Trim(), Ordem = j });
            db.Perguntas.Add(pergunta);
        }

        await db.SaveChangesAsync();
        return (true, "Atividade atualizada!");
    }

    public async Task<(bool sucesso, string mensagem)> ExcluirAsync(Guid id, string profCpf)
    {
        var a = await db.Atividades
            .Include(x => x.Materia)
            .FirstOrDefaultAsync(x => x.Id == id && x.Materia!.ProfessorCpf == profCpf);

        if (a == null) return (false, "Atividade não encontrada.");
        db.Atividades.Remove(a);
        await db.SaveChangesAsync();
        return (true, "Atividade excluída.");
    }

    public async Task<(bool sucesso, string mensagem, ResultadoDto? resultado)> SubmeterAsync(
        string alunoCpf, SubmeterAtividadeRequest req)
    {
        if (await db.Resultados.AnyAsync(r =>
                r.AlunoCpf == alunoCpf && r.AtividadeId == req.AtividadeId))
            return (false, "Você já realizou esta atividade.", null);

        var atividade = await db.Atividades
            .Include(a => a.Perguntas).ThenInclude(p => p.Alternativas)
            .Include(a => a.Materia)
            .FirstOrDefaultAsync(a => a.Id == req.AtividadeId);

        if (atividade == null) return (false, "Atividade não encontrada.", null);

        int acertos = 0;
        foreach (var resposta in req.Respostas)
        {
            var pergunta = atividade.Perguntas.FirstOrDefault(p => p.Id == resposta.PerguntaId);
            if (pergunta != null &&
                string.Equals(pergunta.RespostaCorreta, resposta.RespostaDada,
                    StringComparison.OrdinalIgnoreCase))
                acertos++;
        }

        var resultado = new Resultado
        {
            AlunoCpf       = alunoCpf,
            AtividadeId    = atividade.Id,
            MateriaId      = atividade.MateriaId,
            Acertos        = acertos,
            TotalPerguntas = atividade.Perguntas.Count
        };

        db.Resultados.Add(resultado);
        await db.SaveChangesAsync();

        var aluno = await db.Usuarios.FindAsync(alunoCpf);

        return (true, $"Atividade concluída! Acertos: {acertos}/{atividade.Perguntas.Count}",
            new ResultadoDto(
                resultado.Id, alunoCpf, aluno?.Nome ?? "",
                atividade.Id, atividade.Titulo, atividade.Materia!.Nome,
                acertos, atividade.Perguntas.Count,
                atividade.Perguntas.Count > 0
                    ? Math.Round((double)acertos / atividade.Perguntas.Count * 100, 1)
                    : 0,
                resultado.RealizadoEm
            ));
    }
}

// ================================================================
//  RelatorioService — relatórios e ranking
// ================================================================

public class RelatorioService(AppDbContext db)
{
    public async Task<RelatorioAlunoDto?> RelatorioPorAlunoAsync(string alunoCpf)
    {
        var aluno = await db.Usuarios.FindAsync(alunoCpf);
        if (aluno == null) return null;

        var resultados = await db.Resultados
            .Where(r => r.AlunoCpf == alunoCpf)
            .Include(r => r.Atividade).ThenInclude(a => a!.Materia)
            .ToListAsync();

        var leituras = await db.LeituraConteudos
            .CountAsync(l => l.AlunoCpf == alunoCpf);

        double media = resultados.Count > 0
            ? resultados.Average(r => r.TotalPerguntas > 0
                ? (double)r.Acertos / r.TotalPerguntas * 100 : 0)
            : 0;

        var dtos = resultados.Select(r => new ResultadoDto(
            r.Id, r.AlunoCpf, aluno.Nome,
            r.AtividadeId, r.Atividade?.Titulo ?? "",
            r.Atividade?.Materia?.Nome ?? "",
            r.Acertos, r.TotalPerguntas,
            r.TotalPerguntas > 0
                ? Math.Round((double)r.Acertos / r.TotalPerguntas * 100, 1) : 0,
            r.RealizadoEm
        )).ToList();

        return new RelatorioAlunoDto(
            alunoCpf, aluno.Nome,
            resultados.Count, Math.Round(media, 1),
            leituras, dtos);
    }

    public async Task<List<RankingItemDto>> RankingGeralAsync()
    {
        var resultados = await db.Resultados
            .Include(r => r.Aluno)
            .Where(r => r.TotalPerguntas > 0)
            .GroupBy(r => new { r.AlunoCpf, r.Aluno!.Nome })
            .Select(g => new
            {
                g.Key.AlunoCpf,
                g.Key.Nome,
                Media = g.Average(r => (double)r.Acertos / r.TotalPerguntas * 100),
                Total = g.Count()
            })
            .OrderByDescending(x => x.Media)
            .ThenByDescending(x => x.Total)
            .ToListAsync();

        return resultados.Select((r, i) => new RankingItemDto(
            i + 1, r.AlunoCpf, r.Nome,
            Math.Round(r.Media, 1), r.Total
        )).ToList();
    }
}

// ================================================================
//  SessaoService — controle de sessões (login/logout)
// ================================================================

public class SessaoService(AppDbContext db)
{
    public async Task RegistrarLoginAsync(string cpf)
    {
        db.Sessoes.Add(new Sessao { UsuarioCpf = cpf });
        await db.SaveChangesAsync();
    }

    public async Task RegistrarLogoutAsync(string cpf)
    {
        var sessao = await db.Sessoes
            .Where(s => s.UsuarioCpf == cpf && s.Fim == null)
            .OrderByDescending(s => s.Inicio)
            .FirstOrDefaultAsync();

        if (sessao != null)
        {
            sessao.Fim = DateTime.UtcNow;
            sessao.DuracaoMinutos = (decimal)(sessao.Fim.Value - sessao.Inicio).TotalMinutes;
            await db.SaveChangesAsync();
        }
    }

    public async Task<List<SessaoDto>> ListarTodasAsync() =>
        await db.Sessoes
            .Include(s => s.Usuario)
            .OrderByDescending(s => s.Inicio)
            .Select(s => new SessaoDto(
                s.Id, s.UsuarioCpf, s.Usuario!.Nome,
                s.Usuario.Perfil, s.Inicio, s.Fim, s.DuracaoMinutos
            )).ToListAsync();
}
