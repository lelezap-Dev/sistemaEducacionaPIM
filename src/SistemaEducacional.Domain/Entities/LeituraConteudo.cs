using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  LeituraConteudo — registro de que um aluno leu um conteúdo.
//  Alimenta os indicadores de engajamento acadêmico.
//  Chave primária composta configurada no AppDbContext.
// ────────────────────────────────────────────────────────────────
public class LeituraConteudo
{
    [StringLength(11)]
    public string AlunoCpf   { get; set; } = "";

    public Guid   ConteudoId { get; set; }

    public DateTime LidoEm { get; set; } = DateTime.UtcNow;

    // Navegação
    [ForeignKey("AlunoCpf")]
    public Usuario?  Aluno    { get; set; }

    [ForeignKey("ConteudoId")]
    public Conteudo? Conteudo { get; set; }
}
