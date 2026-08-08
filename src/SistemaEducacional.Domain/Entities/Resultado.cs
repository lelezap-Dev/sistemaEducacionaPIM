using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Resultado — desempenho de um aluno em uma atividade.
//  A restrição de unicidade (AlunoCpf + AtividadeId) garante que
//  cada aluno realize a mesma atividade uma única vez.
// ────────────────────────────────────────────────────────────────
public class Resultado
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [StringLength(11)]
    public string AlunoCpf { get; set; } = "";

    public Guid AtividadeId { get; set; }
    public Guid MateriaId   { get; set; }

    public int Acertos        { get; set; } = 0;
    public int TotalPerguntas { get; set; } = 0;

    public DateTime RealizadoEm { get; set; } = DateTime.UtcNow;

    // Navegação
    [ForeignKey("AlunoCpf")]
    public Usuario?   Aluno     { get; set; }

    [ForeignKey("AtividadeId")]
    public Atividade? Atividade { get; set; }

    [ForeignKey("MateriaId")]
    public Materia?   Materia   { get; set; }
}
