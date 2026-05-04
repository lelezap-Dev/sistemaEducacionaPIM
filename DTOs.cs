namespace SistemaEducacional.DTOs;

// ================================================================
//  DTOs (Data Transfer Objects)
//  São os "envelopes" dos dados que entram e saem da API.
//  Nunca enviamos o Model completo para o front-end porque:
//    1. Evita vazar campos sensíveis (ex: SenhaHash)
//    2. Permite validar só o que é necessário em cada operação
//    3. Evita referências circulares na serialização JSON
// ================================================================

// ── Auth ─────────────────────────────────────────────────────────

public record LoginRequest(string Cpf, string Senha);

public record LoginResponse(
    string Token,
    string Cpf,
    string Nome,
    string Perfil,
    DateTime Expiracao
);

public record CadastroRequest(
    string Cpf,
    string Nome,
    string Email,
    string Senha,
    string PalavraChave,
    string Perfil
);

public record RedefinirSenhaRequest(
    string Cpf,
    string PalavraChave,
    string NovaSenha
);

// ── Usuario ───────────────────────────────────────────────────────

public record UsuarioDto(
    string Cpf,
    string Nome,
    string Email,
    string Perfil,
    string Status,
    DateTime DataCadastro
);

public record EditarUsuarioRequest(
    string? Nome,
    string? Email,
    string? Perfil,
    string? NovaSenha
);

// ── Materia ───────────────────────────────────────────────────────

public record CriarMateriaRequest(string Nome, string Descricao);

public record EditarMateriaRequest(string? Nome, string? Descricao);

public record MateriaDto(
    Guid   Id,
    string ProfessorCpf,
    string ProfessorNome,
    string Nome,
    string Descricao,
    int    TotalConteudos,
    DateTime DataCriacao
);

// ── Conteudo ──────────────────────────────────────────────────────

public record CriarConteudoRequest(string Titulo, string Texto, int Ordem = 0);

public record EditarConteudoRequest(string? Titulo, string? Texto, int? Ordem);

public record ConteudoDto(
    Guid   Id,
    Guid   MateriaId,
    string Titulo,
    string Texto,
    int    Ordem,
    bool   JaLido   // true se o aluno logado já leu este conteúdo
);

// ── Turma ─────────────────────────────────────────────────────────

public record CriarTurmaRequest(string Codigo, Guid MateriaId, string Horario);

public record EditarTurmaRequest(string? Horario);

public record TurmaDto(
    string Codigo,
    string ProfessorCpf,
    string ProfessorNome,
    string MateriaNome,
    string Horario,
    int    TotalAlunos,
    DateTime DataCriacao
);

public record MatricularAlunoRequest(string AlunoCpf, string TurmaCodigo);

public record AlunoTurmaDto(string Cpf, string Nome, string Email);

// ── Atividade ─────────────────────────────────────────────────────

public record CriarAtividadeRequest(
    Guid   MateriaId,
    string? TurmaCodigo,
    string Titulo,
    List<CriarPerguntaRequest> Perguntas
);

public record CriarPerguntaRequest(
    string TextoPergunta,
    string RespostaCorreta,
    List<string> Alternativas,
    int Ordem = 0
);

public record AtividadeDto(
    Guid     Id,
    Guid     MateriaId,
    string   MateriaNome,
    string?  TurmaCodigo,
    string   Titulo,
    string   CriadaPorCpf,
    int      TotalPerguntas,
    DateTime CriadaEm,
    bool     JaRealizada  // true se o aluno logado já fez essa atividade
);

public record AtividadeDetalheDto(
    Guid     Id,
    string   Titulo,
    string   MateriaNome,
    List<PerguntaDto> Perguntas
);

public record PerguntaDto(
    Guid         Id,
    string       TextoPergunta,
    int          Ordem,
    List<string> Alternativas
    // RespostaCorreta NÃO é enviada para o aluno!
);

// ── Resultado ─────────────────────────────────────────────────────

public record SubmeterAtividadeRequest(
    Guid AtividadeId,
    List<RespostaRequest> Respostas
);

public record RespostaRequest(Guid PerguntaId, string RespostaDada);

public record ResultadoDto(
    Guid     Id,
    string   AlunoCpf,
    string   AlunoNome,
    Guid     AtividadeId,
    string   AtividadeTitulo,
    string   MateriaNome,
    int      Acertos,
    int      TotalPerguntas,
    double   Porcentagem,
    DateTime RealizadoEm
);

// ── Sessao ────────────────────────────────────────────────────────

public record SessaoDto(
    Guid      Id,
    string    UsuarioCpf,
    string    UsuarioNome,
    string    Perfil,
    DateTime  Inicio,
    DateTime? Fim,
    decimal?  DuracaoMinutos
);

// ── Relatórios ────────────────────────────────────────────────────

public record RelatorioAlunoDto(
    string AlunoCpf,
    string AlunoNome,
    int    TotalAtividades,
    double MediaAcertos,
    int    TotalConteudosLidos,
    List<ResultadoDto> Resultados
);

public record RankingItemDto(
    int    Posicao,
    string AlunoCpf,
    string AlunoNome,
    double Media,
    int    TotalAtividades
);
