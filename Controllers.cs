using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaEducacional.DTOs;
using SistemaEducacional.Services;

namespace SistemaEducacional.Controllers;

// ================================================================
//  Helpers usados por todos os controllers
// ================================================================

[ApiController]
public abstract class BaseController : ControllerBase
{
    // Lê o CPF do usuário logado a partir do token JWT
    protected string CpfLogado =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    protected string PerfilLogado =>
        User.FindFirstValue(ClaimTypes.Role) ?? "";

    protected IActionResult Ok<T>(T data) =>
        base.Ok(new { sucesso = true, dados = data });

    protected IActionResult Erro(string msg, int status = 400) =>
        StatusCode(status, new { sucesso = false, mensagem = msg });
}

// ================================================================
//  AuthController — /api/auth
// ================================================================

[Route("api/auth")]
public class AuthController(AuthService auth, SessaoService sessao) : BaseController
{
    [HttpPost("cadastrar")]
    public async Task<IActionResult> Cadastrar([FromBody] CadastroRequest req)
    {
        var (sucesso, msg) = await auth.CadastrarAsync(req);
        return sucesso ? Ok(msg) : Erro(msg);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var (sucesso, msg, dados) = await auth.LoginAsync(req);
        if (!sucesso) return Erro(msg, 401);

        await sessao.RegistrarLoginAsync(dados!.Cpf);
        return Ok(dados);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await sessao.RegistrarLogoutAsync(CpfLogado);
        return Ok("Logout realizado.");
    }

    [HttpPost("redefinir-senha")]
    public async Task<IActionResult> RedefinirSenha([FromBody] RedefinirSenhaRequest req)
    {
        var (sucesso, msg) = await auth.RedefinirSenhaAsync(req);
        return sucesso ? Ok(msg) : Erro(msg);
    }
}

// ================================================================
//  UsuarioController — /api/usuarios  (Secretaria)
// ================================================================

[Route("api/usuarios")]
[Authorize(Roles = "Secretaria")]
public class UsuarioController(UsuarioService svc) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> Listar() =>
        Ok(await svc.ListarAsync());

    [HttpGet("{cpf}")]
    public async Task<IActionResult> Buscar(string cpf)
    {
        var u = await svc.BuscarAsync(cpf);
        return u != null ? Ok(u) : Erro("Usuário não encontrado.", 404);
    }

    [HttpPut("{cpf}")]
    public async Task<IActionResult> Editar(string cpf, [FromBody] EditarUsuarioRequest req)
    {
        var (s, m) = await svc.EditarAsync(cpf, req);
        return s ? Ok(m) : Erro(m);
    }

    [HttpDelete("{cpf}")]
    public async Task<IActionResult> Excluir(string cpf)
    {
        var (s, m) = await svc.ExcluirAsync(cpf);
        return s ? Ok(m) : Erro(m);
    }

    [HttpGet("pendentes")]
    public async Task<IActionResult> ListarPendentes() =>
        Ok(await svc.ListarPendentesAsync());

    [HttpPost("{cpf}/aprovar")]
    public async Task<IActionResult> Aprovar(string cpf)
    {
        var (s, m) = await svc.AprovarAsync(cpf);
        return s ? Ok(m) : Erro(m);
    }

    [HttpPost("{cpf}/rejeitar")]
    public async Task<IActionResult> Rejeitar(string cpf)
    {
        var (s, m) = await svc.RejeitarAsync(cpf);
        return s ? Ok(m) : Erro(m);
    }
}

// ================================================================
//  MateriaController — /api/materias
// ================================================================

[Route("api/materias")]
[Authorize]
public class MateriaController(MateriaService svc) : BaseController
{
    // Professores vêem só as suas; outros vêem todas
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var cpf = PerfilLogado == "Professor" ? CpfLogado : null;
        return Ok(await svc.ListarAsync(cpf));
    }

    [HttpPost]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Criar([FromBody] CriarMateriaRequest req)
    {
        var (s, m, id) = await svc.CriarAsync(CpfLogado, req);
        return s ? Ok(new { mensagem = m, id }) : Erro(m);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Editar(Guid id, [FromBody] EditarMateriaRequest req)
    {
        var (s, m) = await svc.EditarAsync(id, CpfLogado, req);
        return s ? Ok(m) : Erro(m);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Excluir(Guid id)
    {
        var (s, m) = await svc.ExcluirAsync(id, CpfLogado);
        return s ? Ok(m) : Erro(m);
    }

    // ── Conteúdos ─────────────────────────────────────────────────

    [HttpGet("{materiaId:guid}/conteudos")]
    public async Task<IActionResult> ListarConteudos(Guid materiaId)
    {
        var aluno = PerfilLogado == "Aluno" ? CpfLogado : null;
        return Ok(await svc.ListarConteudosAsync(materiaId, aluno));
    }

    [HttpPost("{materiaId:guid}/conteudos")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> AdicionarConteudo(
        Guid materiaId, [FromBody] CriarConteudoRequest req)
    {
        var (s, m) = await svc.AdicionarConteudoAsync(materiaId, CpfLogado, req);
        return s ? Ok(m) : Erro(m);
    }

    [HttpPut("conteudos/{conteudoId:guid}")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> EditarConteudo(
        Guid conteudoId, [FromBody] EditarConteudoRequest req)
    {
        var (s, m) = await svc.EditarConteudoAsync(conteudoId, CpfLogado, req);
        return s ? Ok(m) : Erro(m);
    }

    [HttpDelete("conteudos/{conteudoId:guid}")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> ExcluirConteudo(Guid conteudoId)
    {
        var (s, m) = await svc.ExcluirConteudoAsync(conteudoId, CpfLogado);
        return s ? Ok(m) : Erro(m);
    }

    [HttpPost("conteudos/{conteudoId:guid}/leitura")]
    [Authorize(Roles = "Aluno")]
    public async Task<IActionResult> RegistrarLeitura(Guid conteudoId)
    {
        await svc.RegistrarLeituraAsync(CpfLogado, conteudoId);
        return Ok("Leitura registrada.");
    }
}

// ================================================================
//  TurmaController — /api/turmas
// ================================================================

[Route("api/turmas")]
[Authorize]
public class TurmaController(TurmaService svc) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        if (PerfilLogado == "Aluno")
            return Ok(await svc.ListarPorAlunoAsync(CpfLogado));

        var cpf = PerfilLogado == "Professor" ? CpfLogado : null;
        return Ok(await svc.ListarAsync(cpf));
    }

    [HttpPost]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Criar([FromBody] CriarTurmaRequest req)
    {
        var (s, m) = await svc.CriarAsync(CpfLogado, req);
        return s ? Ok(m) : Erro(m);
    }

    [HttpPut("{codigo}")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Editar(string codigo, [FromBody] EditarTurmaRequest req)
    {
        var (s, m) = await svc.EditarAsync(codigo, CpfLogado, req);
        return s ? Ok(m) : Erro(m);
    }

    [HttpDelete("{codigo}")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Excluir(string codigo)
    {
        var (s, m) = await svc.ExcluirAsync(codigo, CpfLogado);
        return s ? Ok(m) : Erro(m);
    }

    [HttpPost("matricular")]
    [Authorize(Roles = "Professor,Secretaria")]
    public async Task<IActionResult> Matricular([FromBody] MatricularAlunoRequest req)
    {
        var (s, m) = await svc.MatricularAsync(req);
        return s ? Ok(m) : Erro(m);
    }

    [HttpDelete("{codigo}/alunos/{alunoCpf}")]
    [Authorize(Roles = "Professor,Secretaria")]
    public async Task<IActionResult> Desmatricular(string codigo, string alunoCpf)
    {
        var (s, m) = await svc.DesmatricularAsync(alunoCpf, codigo);
        return s ? Ok(m) : Erro(m);
    }

    [HttpGet("{codigo}/alunos")]
    public async Task<IActionResult> ListarAlunos(string codigo) =>
        Ok(await svc.ListarAlunosDaTurmaAsync(codigo));
}

// ================================================================
//  AtividadeController — /api/atividades
// ================================================================

[Route("api/atividades")]
[Authorize]
public class AtividadeController(AtividadeService svc) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> Listar([FromQuery] string? materiaId)
    {
        var aluno = PerfilLogado == "Aluno" ? CpfLogado : null;
        return Ok(await svc.ListarAsync(materiaId, aluno));
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Aluno,Professor")]
    public async Task<IActionResult> Detalhe(Guid id)
    {
        var detalhe = await svc.BuscarDetalheAsync(id);
        return detalhe != null ? Ok(detalhe) : Erro("Atividade não encontrada.", 404);
    }

    [HttpPost]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Criar([FromBody] CriarAtividadeRequest req)
    {
        var (s, m, id) = await svc.CriarAsync(CpfLogado, req);
        return s ? Ok(new { mensagem = m, id }) : Erro(m);
    }

    [HttpGet("{id:guid}/completo")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> DetalheCompleto(Guid id)
    {
        var detalhe = await svc.BuscarDetalheCompletoAsync(id, CpfLogado);
        return detalhe != null ? Ok(detalhe) : Erro("Atividade não encontrada.", 404);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Editar(Guid id, [FromBody] EditarAtividadeRequest req)
    {
        var (s, m) = await svc.EditarAsync(id, CpfLogado, req);
        return s ? Ok(m) : Erro(m);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Professor")]
    public async Task<IActionResult> Excluir(Guid id)
    {
        var (s, m) = await svc.ExcluirAsync(id, CpfLogado);
        return s ? Ok(m) : Erro(m);
    }

    [HttpPost("submeter")]
    [Authorize(Roles = "Aluno")]
    public async Task<IActionResult> Submeter([FromBody] SubmeterAtividadeRequest req)
    {
        var (s, m, resultado) = await svc.SubmeterAsync(CpfLogado, req);
        return s ? Ok(new { mensagem = m, resultado }) : Erro(m);
    }
}

// ================================================================
//  RelatorioController — /api/relatorios
// ================================================================

[Route("api/relatorios")]
[Authorize]
public class RelatorioController(RelatorioService svc, SessaoService sessaoSvc) : BaseController
{
    // Aluno vê seu próprio relatório; Secretaria vê de qualquer um
    [HttpGet("aluno/{cpf}")]
    public async Task<IActionResult> PorAluno(string cpf)
    {
        if (PerfilLogado == "Aluno" && CpfLogado != cpf)
            return Erro("Acesso negado.", 403);

        var rel = await svc.RelatorioPorAlunoAsync(cpf);
        return rel != null ? Ok(rel) : Erro("Aluno não encontrado.", 404);
    }

    [HttpGet("ranking")]
    [Authorize(Roles = "Secretaria,Professor")]
    public async Task<IActionResult> Ranking() =>
        Ok(await svc.RankingGeralAsync());

    [HttpGet("sessoes")]
    [Authorize(Roles = "Secretaria")]
    public async Task<IActionResult> Sessoes() =>
        Ok(await sessaoSvc.ListarTodasAsync());
}
