using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEducacional.Domain.Entities;

// ────────────────────────────────────────────────────────────────
//  Sessao — trilha de auditoria de acessos.
//  Fim nulo indica sessão ainda ativa (usuário online).
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
