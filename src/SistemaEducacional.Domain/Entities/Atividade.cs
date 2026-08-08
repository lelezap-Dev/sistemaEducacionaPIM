using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Atividade — avaliação composta por perguntas objetivas.
//  Quando TurmaCodigo é nulo, a atividade vale para todas as
//  turmas da matéria.
// ────────────────────────────────────────────────────────────────
public class Atividade
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MateriaId { get; set; }

    [StringLength(50)]
    public string? TurmaCodigo { get; set; }   // null = todas as turmas

    [Required]
    [StringLength(300)]
    public string Titulo { get; set; } = "";

    [StringLength(11)]
    public string CriadaPorCpf { get; set; } = "";

    public DateTime CriadaEm { get; set; } = DateTime.UtcNow;

    // Navegação
    [ForeignKey("MateriaId")]
    public Materia?  Materia  { get; set; }

    [ForeignKey("TurmaCodigo")]
    public Turma?    Turma    { get; set; }

    [ForeignKey("CriadaPorCpf")]
    public Usuario?  CriadaPor { get; set; }

    public ICollection<Pergunta>   Perguntas  { get; set; } = [];
    public ICollection<Resultado>  Resultados { get; set; } = [];
}
