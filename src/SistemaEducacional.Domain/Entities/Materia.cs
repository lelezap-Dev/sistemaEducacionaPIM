using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Materia — disciplina criada e mantida por um professor.
//  Agrega os conteúdos didáticos e as atividades avaliativas.
// ────────────────────────────────────────────────────────────────
public class Materia
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(11)]
    public string ProfessorCpf { get; set; } = "";

    [Required]
    [StringLength(200)]
    public string Nome { get; set; } = "";

    [StringLength(1000)]
    public string Descricao { get; set; } = "";

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Navegação
    [ForeignKey("ProfessorCpf")]
    public Usuario? Professor { get; set; }

    public ICollection<Conteudo>    Conteudos  { get; set; } = [];
    public ICollection<Turma>       Turmas     { get; set; } = [];
    public ICollection<Atividade>   Atividades { get; set; } = [];
}
