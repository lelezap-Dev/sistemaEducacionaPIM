using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Pergunta — questão de uma atividade.
//  RespostaCorreta nunca é exposta ao aluno pelos DTOs.
// ────────────────────────────────────────────────────────────────
public class Pergunta
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid AtividadeId { get; set; }

    [Required]
    [StringLength(1000)]
    public string TextoPergunta { get; set; } = "";

    [Required]
    [StringLength(500)]
    public string RespostaCorreta { get; set; } = "";

    public int Ordem { get; set; } = 0;

    // Navegação
    [ForeignKey("AtividadeId")]
    public Atividade? Atividade { get; set; }

    public ICollection<Alternativa> Alternativas { get; set; } = [];
}
