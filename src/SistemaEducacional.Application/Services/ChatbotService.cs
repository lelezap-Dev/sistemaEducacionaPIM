using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SistemaEducacional.Application.DTOs;
using SistemaEducacional.Domain.Entities;
using SistemaEducacional.Infrastructure.Data;

namespace SistemaEducacional.Application.Services;

// ================================================================
//  ChatbotService — assistente virtual de apoio ao usuário.
//
//  Funcionamento: a pergunta digitada é normalizada (sem acentos,
//  em minúsculas) e comparada com as palavras-chave de cada item da
//  base de conhecimento. Cada termo encontrado soma pontos; o item de
//  maior pontuação vira a resposta.
//
//  Optou-se por não usar serviço externo de IA para manter o sistema
//  autocontido, sem custo por requisição e sem trafegar dados de
//  alunos para terceiros.
// ================================================================

public class ChatbotService(AppDbContext db)
{
    /// <summary>Pontuação mínima para considerar que houve entendimento.</summary>
    private const int LimiarConfianca = 2;

    /// <summary>
    /// Remove acentos e coloca em minúsculas, para que "matrícula",
    /// "MATRICULA" e "matricula" sejam tratados como o mesmo termo.
    /// </summary>
    private static string Normalizar(string texto)
    {
        if (string.IsNullOrWhiteSpace(texto)) return "";

        var decomposto = texto.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(decomposto.Length);

        foreach (var c in decomposto)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        return sb.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
    }

    /// <summary>Divide o texto em palavras, descartando as muito curtas.</summary>
    private static string[] ExtrairTermos(string texto) =>
        Normalizar(texto)
            .Split([' ', ',', '.', '?', '!', ';', ':', '\n', '\r', '\t'],
                   StringSplitOptions.RemoveEmptyEntries)
            .Where(p => p.Length >= 3)   // ignora "de", "o", "a", "em"...
            .ToArray();

    /// <summary>
    /// Responde a uma pergunta livre do usuário.
    /// </summary>
    /// <param name="pergunta">Texto digitado.</param>
    /// <param name="perfil">Perfil do usuário logado; null para visitante.</param>
    public async Task<ChatbotRespostaDto> PerguntarAsync(string pergunta, string? perfil)
    {
        var termos = ExtrairTermos(pergunta);

        if (termos.Length == 0)
        {
            return new ChatbotRespostaDto(
                Resposta: "Pode escrever sua dúvida com um pouco mais de detalhe? Assim consigo ajudar melhor.",
                Entendeu: false,
                Categoria: null,
                Sugestoes: await SugestoesAsync(perfil));
        }

        // Só considera itens do perfil do usuário (ou gerais)
        var candidatos = await db.ChatbotFaqs
            .Where(f => f.Ativo && (f.PerfilAlvo == "Todos" || f.PerfilAlvo == perfil))
            .ToListAsync();

        ChatbotFaq? melhor = null;
        var melhorPontuacao = 0;

        foreach (var faq in candidatos)
        {
            var chaves = Normalizar(faq.PalavrasChave)
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            var pontos = 0;
            foreach (var chave in chaves)
            {
                foreach (var termo in termos)
                {
                    // Correspondência exata pesa mais que correspondência parcial
                    if (termo == chave)                                   pontos += 3;
                    else if (termo.Contains(chave) || chave.Contains(termo)) pontos += 1;
                }
            }

            if (pontos > melhorPontuacao)
            {
                melhorPontuacao = pontos;
                melhor = faq;
            }
        }

        if (melhor is null || melhorPontuacao < LimiarConfianca)
        {
            return new ChatbotRespostaDto(
                Resposta: "Ainda não sei responder isso. Você pode falar com a secretaria pelo menu " +
                          "\"Contate-nos\". Enquanto isso, veja se alguma das perguntas abaixo ajuda:",
                Entendeu: false,
                Categoria: null,
                Sugestoes: await SugestoesAsync(perfil));
        }

        return new ChatbotRespostaDto(
            Resposta: melhor.Resposta,
            Entendeu: true,
            Categoria: melhor.Categoria,
            Sugestoes: []);
    }

    /// <summary>Perguntas mais comuns, exibidas como atalho.</summary>
    public async Task<List<string>> SugestoesAsync(string? perfil) =>
        await db.ChatbotFaqs
            .Where(f => f.Ativo && (f.PerfilAlvo == "Todos" || f.PerfilAlvo == perfil))
            .OrderBy(f => f.Ordem)
            .Take(5)
            .Select(f => f.Pergunta)
            .ToListAsync();

    /// <summary>Lista completa da base, agrupada por categoria.</summary>
    public async Task<List<ChatbotFaqDto>> ListarAsync() =>
        await db.ChatbotFaqs
            .Where(f => f.Ativo)
            .OrderBy(f => f.Categoria).ThenBy(f => f.Ordem)
            .Select(f => new ChatbotFaqDto(f.Id, f.Pergunta, f.Resposta, f.Categoria, f.PerfilAlvo))
            .ToListAsync();
}
