using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Turma — agrupamento de alunos em torno de uma matéria,
//  sob responsabilidade de um professor.
// ────────────────────────────────────────────────────────────────
public class Turma
{
    [Key]
    [StringLength(50)]
    public string Codigo { get; set; } = "";

    [Required]
    [StringLength(11)]
    public string ProfessorCpf { get; set; } = "";

    public Guid MateriaId { get; set; }

    [StringLength(100)]
    public string Horario { get; set; } = "";

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Navegação
    [ForeignKey("ProfessorCpf")]
    public Usuario? Professor { get; set; }

    [ForeignKey("MateriaId")]
    public Materia? Materia { get; set; }

    public ICollection<TurmaAluno>  TurmaAlunos { get; set; } = [];
    public ICollection<Atividade>   Atividades  { get; set; } = [];
}
