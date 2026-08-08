using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Alternativa — opção de resposta de uma pergunta objetiva.
// ────────────────────────────────────────────────────────────────
public class Alternativa
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PerguntaId { get; set; }

    [Required]
    [StringLength(500)]
    public string Texto { get; set; } = "";

    public int Ordem { get; set; } = 0;

    // Navegação
    [ForeignKey("PerguntaId")]
    public Pergunta? Pergunta { get; set; }
}
