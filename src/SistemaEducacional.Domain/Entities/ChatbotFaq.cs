using System.ComponentModel.DataAnnotations;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  ChatbotFaq — base de conhecimento do assistente virtual.
//
//  O atendimento é feito por correspondência de palavras-chave sobre
//  esta tabela, sem depender de serviço externo de IA. A escolha
//  mantém o sistema autocontido: sem custo por requisição, sem envio
//  de dados de alunos a terceiros (relevante para a LGPD) e com
//  funcionamento garantido mesmo sem acesso à internet.
// ────────────────────────────────────────────────────────────────
public class ChatbotFaq
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(300)]
    public string Pergunta { get; set; } = "";

    [Required]
    [StringLength(2000)]
    public string Resposta { get; set; } = "";

    /// <summary>
    /// Termos que disparam esta resposta, separados por vírgula.
    /// Ex.: "senha,esqueci,recuperar,redefinir"
    /// </summary>
    [Required]
    [StringLength(500)]
    public string PalavrasChave { get; set; } = "";

    [StringLength(50)]
    public string Categoria { get; set; } = "Geral";

    /// <summary>
    /// Perfil ao qual a pergunta se aplica: Aluno, Professor,
    /// Secretaria ou "Todos".
    /// </summary>
    [StringLength(20)]
    public string PerfilAlvo { get; set; } = "Todos";

    public int  Ordem { get; set; } = 0;
    public bool Ativo { get; set; } = true;
}
