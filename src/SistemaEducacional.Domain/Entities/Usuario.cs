using System.ComponentModel.DataAnnotations;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Usuario — raiz do controle de acesso (RBAC).
//  Um mesmo registro atende os três perfis do sistema; o campo
//  Perfil determina o que cada um pode fazer.
// ────────────────────────────────────────────────────────────────
public class Usuario
{
    [Key]
    [StringLength(11)]
    public string Cpf { get; set; } = "";

    [Required]
    [StringLength(150)]
    public string Nome { get; set; } = "";

    [Required]
    [StringLength(254)]
    public string Email { get; set; } = "";

    [Required]
    [StringLength(100)]
    public string SenhaHash { get; set; } = "";

    [Required]
    [StringLength(20)]
    public string Perfil { get; set; } = "";   // Aluno | Professor | Secretaria

    [StringLength(100)]
    public string PalavraChave { get; set; } = "";

    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "Ativo"; // Ativo | Pendente | Rejeitado

    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    // Navegação (EF usa isso para JOINs automáticos)
    public ICollection<Materia>          Materias      { get; set; } = [];
    public ICollection<Turma>            Turmas        { get; set; } = [];
    public ICollection<TurmaAluno>       TurmaAlunos   { get; set; } = [];
    public ICollection<Resultado>        Resultados    { get; set; } = [];
    public ICollection<LeituraConteudo>  Leituras      { get; set; } = [];
    public ICollection<Sessao>           Sessoes       { get; set; } = [];
}
