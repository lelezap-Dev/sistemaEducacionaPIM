using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Conteudo — material didático de uma matéria.
//  A ordem define a sequência em que o aluno percorre o material.
// ────────────────────────────────────────────────────────────────
public class Conteudo
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MateriaId { get; set; }

    [Required]
    [StringLength(300)]
    public string Titulo { get; set; } = "";

    [Required]
    public string Texto { get; set; } = "";

    public int Ordem { get; set; } = 0;

    // Navegação
    [ForeignKey("MateriaId")]
    public Materia? Materia { get; set; }

    public ICollection<LeituraConteudo> Leituras { get; set; } = [];
}
