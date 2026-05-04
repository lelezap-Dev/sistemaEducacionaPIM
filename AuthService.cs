using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SistemaEducacional.Data;
using SistemaEducacional.DTOs;
using SistemaEducacional.Models;

namespace SistemaEducacional.Services;

// ================================================================
//  AuthService — responsável por:
//    - Validar e criar usuários (Cadastrar)
//    - Autenticar login e gerar token JWT
//    - Redefinir senha via palavra-chave
// ================================================================

public class AuthService(AppDbContext db, IConfiguration config)
{
    // ── Validações (mesmas regras do seu projeto original) ────────

    private static bool ValidarEmail(string email) =>
        Regex.IsMatch(email, @"^[\w\.-]+@[\w\.-]+\.\w{2,4}$");

    private static bool ValidarSenha(string senha) =>
        senha.Length >= 8
        && senha.Any(char.IsUpper)
        && senha.Any(char.IsLower)
        && senha.Any(char.IsDigit)
        && senha.Any(c => "!@#$%^&*()-_+=".Contains(c));

    private static bool ValidarCpf(string cpf) =>
        cpf.All(char.IsDigit) && cpf.Length == 11;

    // ── Cadastrar ─────────────────────────────────────────────────

    public async Task<(bool sucesso, string mensagem)> CadastrarAsync(CadastroRequest req)
    {
        if (!ValidarCpf(req.Cpf))
            return (false, "CPF inválido. Use apenas números (11 dígitos).");

        if (!ValidarEmail(req.Email))
            return (false, "E-mail inválido.");

        if (!ValidarSenha(req.Senha))
            return (false, "Senha fraca. Use mínimo 8 caracteres com maiúscula, minúscula, número e símbolo (!@#$...).");

        if (req.Perfil is not ("Aluno" or "Professor" or "Secretaria"))
            return (false, "Perfil inválido. Use: Aluno, Professor ou Secretaria.");

        if (await db.Usuarios.AnyAsync(u => u.Cpf == req.Cpf))
            return (false, "CPF já cadastrado.");

        if (await db.Usuarios.AnyAsync(u => u.Email == req.Email))
            return (false, "E-mail já cadastrado.");

        var usuario = new Usuario
        {
            Cpf          = req.Cpf,
            Nome         = req.Nome.Trim(),
            Email        = req.Email.Trim().ToLower(),
            SenhaHash    = BCrypt.Net.BCrypt.HashPassword(req.Senha),
            Perfil       = req.Perfil,
            PalavraChave = req.PalavraChave.Trim(),
            Status       = req.Perfil == "Aluno" ? "Ativo" : "Pendente"
        };

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();

        return (true, "Usuário cadastrado com sucesso!");
    }

    // ── Login ─────────────────────────────────────────────────────

    public async Task<(bool sucesso, string mensagem, LoginResponse? dados)> LoginAsync(LoginRequest req)
    {
        var usuario = await db.Usuarios
            .FirstOrDefaultAsync(u => u.Cpf == req.Cpf);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(req.Senha, usuario.SenhaHash))
            return (false, "CPF ou senha inválidos.", null);

        if (usuario.Status == "Pendente")
            return (false, "Cadastro aguardando aprovação do Administrador.", null);

        if (usuario.Status == "Rejeitado")
            return (false, "Cadastro rejeitado. Entre em contato com a secretaria.", null);

        var token    = GerarToken(usuario);
        var expiracao = DateTime.UtcNow.AddHours(
            double.Parse(config["Jwt:ExpiresInHours"] ?? "8"));

        var response = new LoginResponse(
            Token:     token,
            Cpf:       usuario.Cpf,
            Nome:      usuario.Nome,
            Perfil:    usuario.Perfil,
            Expiracao: expiracao
        );

        return (true, "Login realizado com sucesso!", response);
    }

    // ── Redefinir senha ───────────────────────────────────────────

    public async Task<(bool sucesso, string mensagem)> RedefinirSenhaAsync(RedefinirSenhaRequest req)
    {
        var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Cpf == req.Cpf);

        if (usuario == null)
            return (false, "Usuário não encontrado.");

        if (usuario.PalavraChave != req.PalavraChave)
            return (false, "Palavra-chave incorreta.");

        if (!ValidarSenha(req.NovaSenha))
            return (false, "Senha fraca. Use mínimo 8 caracteres com maiúscula, minúscula, número e símbolo.");

        usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(req.NovaSenha);
        await db.SaveChangesAsync();

        return (true, "Senha atualizada com sucesso!");
    }

    // ── Gerar token JWT ───────────────────────────────────────────
    // O token carrega Claims: dados do usuário "embutidos" no token.
    // O front-end decodifica e sabe o perfil sem ir ao banco.

    private string GerarToken(Usuario usuario)
    {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Cpf),
            new Claim(ClaimTypes.Name,           usuario.Nome),
            new Claim(ClaimTypes.Role,           usuario.Perfil),
            new Claim("perfil",                  usuario.Perfil)
        };

        var token = new JwtSecurityToken(
            issuer:             config["Jwt:Issuer"],
            audience:           config["Jwt:Audience"],
            claims:             claims,
            expires:            DateTime.UtcNow.AddHours(
                                    double.Parse(config["Jwt:ExpiresInHours"] ?? "8")),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
