using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Models;

// ================================================================
//  Models — mapeiam exatamente as tabelas criadas no SQL Server.
//  Os atributos [Key], [Required], [MaxLength] etc. dizem ao
//  Entity Framework como gerar/validar os dados.
// ================================================================

// ────────────────────────────────────────────────────────────────
// Usuario
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

    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    // Navegação (EF usa isso para JOINs automáticos)
    public ICollection<Materia>          Materias      { get; set; } = [];
    public ICollection<Turma>            Turmas        { get; set; } = [];
    public ICollection<TurmaAluno>       TurmaAlunos   { get; set; } = [];
    public ICollection<Resultado>        Resultados    { get; set; } = [];
    public ICollection<LeituraConteudo>  Leituras      { get; set; } = [];
    public ICollection<Sessao>           Sessoes       { get; set; } = [];
}

// ────────────────────────────────────────────────────────────────
// Materia
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

// ────────────────────────────────────────────────────────────────
// Conteudo
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

// ────────────────────────────────────────────────────────────────
// Turma
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

// ────────────────────────────────────────────────────────────────
// TurmaAluno  (tabela de junção N:N)
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

// ────────────────────────────────────────────────────────────────
// Atividade
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

// ────────────────────────────────────────────────────────────────
// Pergunta
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

// ────────────────────────────────────────────────────────────────
// Alternativa
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

// ────────────────────────────────────────────────────────────────
// Resultado
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

// ────────────────────────────────────────────────────────────────
// LeituraConteudo
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

// ────────────────────────────────────────────────────────────────
// Sessao
// ────────────────────────────────────────────────────────────────
public class Sessao
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [StringLength(11)]
    public string UsuarioCpf { get; set; } = "";

    public DateTime  Inicio           { get; set; } = DateTime.UtcNow;
    public DateTime? Fim              { get; set; }
    public decimal?  DuracaoMinutos   { get; set; }

    // Navegação
    [ForeignKey("UsuarioCpf")]
    public Usuario? Usuario { get; set; }
}
