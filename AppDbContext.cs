using Microsoft.EntityFrameworkCore;
using SistemaEducacional.Models;

namespace SistemaEducacional.Data;

// ================================================================
//  AppDbContext — "janela" do C# para o SQL Server.
//  Cada DbSet<T> representa uma tabela.
//  O método OnModelCreating configura relacionamentos e constraints
//  que o EF não consegue inferir automaticamente.
// ================================================================

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // ── Tabelas ──────────────────────────────────────────────────
    public DbSet<Usuario>         Usuarios         { get; set; }
    public DbSet<Materia>         Materias         { get; set; }
    public DbSet<Conteudo>        Conteudos        { get; set; }
    public DbSet<Turma>           Turmas           { get; set; }
    public DbSet<TurmaAluno>      TurmaAlunos      { get; set; }
    public DbSet<Atividade>       Atividades       { get; set; }
    public DbSet<Pergunta>        Perguntas        { get; set; }
    public DbSet<Alternativa>     Alternativas     { get; set; }
    public DbSet<Resultado>       Resultados       { get; set; }
    public DbSet<LeituraConteudo> LeituraConteudos { get; set; }
    public DbSet<Sessao>          Sessoes          { get; set; }

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);

        // ── TurmaAluno: chave primária composta ──────────────────
        // O EF não sabe sozinho que a PK é (TurmaCodigo + AlunoCpf),
        // então informamos manualmente.
        mb.Entity<TurmaAluno>()
          .HasKey(ta => new { ta.TurmaCodigo, ta.AlunoCpf });

        // ── LeituraConteudo: chave primária composta ─────────────
        mb.Entity<LeituraConteudo>()
          .HasKey(lc => new { lc.AlunoCpf, lc.ConteudoId });

        // ── Resultado: um aluno só faz cada atividade 1 vez ──────
        mb.Entity<Resultado>()
          .HasIndex(r => new { r.AlunoCpf, r.AtividadeId })
          .IsUnique();

        // ── Usuario: email único ─────────────────────────────────
        mb.Entity<Usuario>()
          .HasIndex(u => u.Email)
          .IsUnique();

        // ── Perfil: só aceita os 3 valores válidos ───────────────
        mb.Entity<Usuario>()
          .Property(u => u.Perfil)
          .HasConversion<string>();

        // ── Atividade → Turma: sem cascade (turma pode ser null) ─
        mb.Entity<Atividade>()
          .HasOne(a => a.Turma)
          .WithMany(t => t.Atividades)
          .HasForeignKey(a => a.TurmaCodigo)
          .OnDelete(DeleteBehavior.SetNull);

        // ── Resultado → Atividade: sem cascade duplo ─────────────
        mb.Entity<Resultado>()
          .HasOne(r => r.Atividade)
          .WithMany(a => a.Resultados)
          .HasForeignKey(r => r.AtividadeId)
          .OnDelete(DeleteBehavior.NoAction);

        // ── Resultado → Materia: sem cascade duplo ───────────────
        mb.Entity<Resultado>()
          .HasOne(r => r.Materia)
          .WithMany()
          .HasForeignKey(r => r.MateriaId)
          .OnDelete(DeleteBehavior.NoAction);

        // ── Turma → Professor: sem cascade duplo ─────────────────
        mb.Entity<Turma>()
          .HasOne(t => t.Professor)
          .WithMany(u => u.Turmas)
          .HasForeignKey(t => t.ProfessorCpf)
          .OnDelete(DeleteBehavior.NoAction);

        // ── TurmaAluno → Aluno: sem cascade duplo ────────────────
        mb.Entity<TurmaAluno>()
          .HasOne(ta => ta.Aluno)
          .WithMany(u => u.TurmaAlunos)
          .HasForeignKey(ta => ta.AlunoCpf)
          .OnDelete(DeleteBehavior.NoAction);

        // ── Sessao.DuracaoMinutos: precisão explícita ─────────────
        mb.Entity<Sessao>()
          .Property(s => s.DuracaoMinutos)
          .HasColumnType("decimal(10,2)");
    }
}
