using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  TurmaAluno — tabela associativa que resolve o relacionamento
//  N:N entre Turma e Usuario (aluno). Representa a matrícula.
//  A chave primária composta é configurada no AppDbContext.
// ────────────────────────────────────────────────────────────────
public class TurmaAluno
{
    [StringLength(50)]
    public string TurmaCodigo { get; set; } = "";

    [StringLength(11)]
    public string AlunoCpf { get; set; } = "";

    public DateTime DataMatricula { get; set; } = DateTime.UtcNow;

    // Navegação
    [ForeignKey("TurmaCodigo")]
    public Turma?   Turma { get; set; }

    [ForeignKey("AlunoCpf")]
    public Usuario? Aluno { get; set; }
}
