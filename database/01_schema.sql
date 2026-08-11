-- ============================================================================
--  Sistema Acadêmico Colaborativo — Lumina
--  Script 01: Modelo Físico (criação do banco e das tabelas)
--
--  PIM IV — Etapa 7 (Projeto do Banco de Dados)
--  Universidade Paulista — CST em Análise e Desenvolvimento de Sistemas
--
--  SGBD: Microsoft SQL Server 2019 ou superior
--
--  ATENÇÃO: este script APAGA e recria todas as tabelas.
--  Execute-o apenas na primeira carga ou quando quiser reiniciar a base.
--
--  Ordem de execução dos scripts:
--     01_schema.sql               (este arquivo)
--     02_procedures_triggers.sql  (procedures, triggers, view e auditoria)
--     03_carga_inicial.sql        (dados de demonstração)
-- ============================================================================

-- ── 1. Banco de dados ───────────────────────────────────────────────────────
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SistemaEducacional')
BEGIN
    CREATE DATABASE SistemaEducacional;
END
GO

USE SistemaEducacional;
GO

-- ── 2. Remoção na ordem inversa das dependências ────────────────────────────
-- As tabelas "filhas" saem primeiro para não violar as chaves estrangeiras.
DROP TABLE IF EXISTS AuditoriaUsuarios;
DROP TABLE IF EXISTS ChatbotFaqs;
DROP TABLE IF EXISTS Sessoes;
DROP TABLE IF EXISTS LeituraConteudos;
DROP TABLE IF EXISTS Resultados;
DROP TABLE IF EXISTS Alternativas;
DROP TABLE IF EXISTS Perguntas;
DROP TABLE IF EXISTS Atividades;
DROP TABLE IF EXISTS TurmaAlunos;
DROP TABLE IF EXISTS Turmas;
DROP TABLE IF EXISTS Conteudos;
DROP TABLE IF EXISTS Materias;
DROP TABLE IF EXISTS Usuarios;
GO

-- ============================================================================
--  ENTIDADE CENTRAL
-- ============================================================================

-- ── 3. Usuarios ─────────────────────────────────────────────────────────────
--  Raiz do controle de acesso. Um mesmo registro atende aos três perfis;
--  a coluna Perfil determina as permissões (modelo RBAC).
--  O CPF é a chave natural, pois já identifica a pessoa de forma única.
CREATE TABLE Usuarios (
    Cpf          CHAR(11)      NOT NULL,
    Nome         NVARCHAR(150) NOT NULL,
    Email        NVARCHAR(254) NOT NULL,
    SenhaHash    NVARCHAR(100) NOT NULL,   -- BCrypt; a senha nunca é gravada em claro
    Perfil       NVARCHAR(20)  NOT NULL
        CONSTRAINT CK_Usuarios_Perfil
        CHECK (Perfil IN ('Aluno', 'Professor', 'Secretaria')),
    PalavraChave NVARCHAR(100) NOT NULL DEFAULT '',
    Status       NVARCHAR(20)  NOT NULL DEFAULT 'Ativo'
        CONSTRAINT CK_Usuarios_Status
        CHECK (Status IN ('Ativo', 'Pendente', 'Rejeitado')),
    DataCadastro DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_Usuarios       PRIMARY KEY (Cpf),
    CONSTRAINT UQ_Usuarios_Email UNIQUE (Email)
);
GO

-- ============================================================================
--  ESTRUTURA ACADÊMICA
-- ============================================================================

-- ── 4. Materias ─────────────────────────────────────────────────────────────
CREATE TABLE Materias (
    Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    ProfessorCpf CHAR(11)         NOT NULL,
    Nome         NVARCHAR(200)    NOT NULL,
    Descricao    NVARCHAR(1000)   NOT NULL DEFAULT '',
    DataCriacao  DATETIME2        NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_Materias PRIMARY KEY (Id),
    CONSTRAINT FK_Materias_Professor
        FOREIGN KEY (ProfessorCpf) REFERENCES Usuarios(Cpf)
        ON DELETE CASCADE   -- ao excluir o professor, suas matérias saem junto
);
GO

-- ── 5. Conteudos ────────────────────────────────────────────────────────────
CREATE TABLE Conteudos (
    Id        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    MateriaId UNIQUEIDENTIFIER NOT NULL,
    Titulo    NVARCHAR(300)    NOT NULL,
    Texto     NVARCHAR(MAX)    NOT NULL DEFAULT '',
    Ordem     INT              NOT NULL DEFAULT 0,   -- sequência de estudo

    CONSTRAINT PK_Conteudos PRIMARY KEY (Id),
    CONSTRAINT FK_Conteudos_Materia
        FOREIGN KEY (MateriaId) REFERENCES Materias(Id)
        ON DELETE CASCADE
);
GO

-- ── 6. Turmas ───────────────────────────────────────────────────────────────
CREATE TABLE Turmas (
    Codigo       NVARCHAR(50)     NOT NULL,   -- ex.: ADS-2026-N2
    ProfessorCpf CHAR(11)         NOT NULL,
    MateriaId    UNIQUEIDENTIFIER NOT NULL,
    Horario      NVARCHAR(100)    NOT NULL DEFAULT '',
    DataCriacao  DATETIME2        NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_Turmas PRIMARY KEY (Codigo),
    -- NO ACTION evita que excluir um professor derrube turmas com alunos
    CONSTRAINT FK_Turmas_Professor
        FOREIGN KEY (ProfessorCpf) REFERENCES Usuarios(Cpf)
        ON DELETE NO ACTION,
    CONSTRAINT FK_Turmas_Materia
        FOREIGN KEY (MateriaId) REFERENCES Materias(Id)
        ON DELETE NO ACTION
);
GO

-- ── 7. TurmaAlunos ──────────────────────────────────────────────────────────
--  Tabela associativa que resolve o relacionamento N:N entre Turmas e
--  Usuarios (alunos). Representa a matrícula.
CREATE TABLE TurmaAlunos (
    TurmaCodigo   NVARCHAR(50) NOT NULL,
    AlunoCpf      CHAR(11)     NOT NULL,
    DataMatricula DATETIME2    NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_TurmaAlunos PRIMARY KEY (TurmaCodigo, AlunoCpf),
    CONSTRAINT FK_TurmaAlunos_Turma
        FOREIGN KEY (TurmaCodigo) REFERENCES Turmas(Codigo)
        ON DELETE CASCADE,
    CONSTRAINT FK_TurmaAlunos_Aluno
        FOREIGN KEY (AlunoCpf) REFERENCES Usuarios(Cpf)
        ON DELETE NO ACTION
);
GO

-- ============================================================================
--  AVALIAÇÃO
-- ============================================================================

-- ── 8. Atividades ───────────────────────────────────────────────────────────
CREATE TABLE Atividades (
    Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    MateriaId     UNIQUEIDENTIFIER NOT NULL,
    TurmaCodigo   NVARCHAR(50)     NULL,   -- NULL = vale para todas as turmas
    Titulo        NVARCHAR(300)    NOT NULL,
    CriadaPorCpf  CHAR(11)         NOT NULL,
    CriadaEm      DATETIME2        NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_Atividades PRIMARY KEY (Id),
    CONSTRAINT FK_Atividades_Materia
        FOREIGN KEY (MateriaId) REFERENCES Materias(Id)
        ON DELETE CASCADE,
    CONSTRAINT FK_Atividades_Turma
        FOREIGN KEY (TurmaCodigo) REFERENCES Turmas(Codigo)
        ON DELETE SET NULL,   -- turma removida: a atividade passa a ser geral
    CONSTRAINT FK_Atividades_Professor
        FOREIGN KEY (CriadaPorCpf) REFERENCES Usuarios(Cpf)
        ON DELETE NO ACTION
);
GO

-- ── 9. Perguntas ────────────────────────────────────────────────────────────
CREATE TABLE Perguntas (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    AtividadeId     UNIQUEIDENTIFIER NOT NULL,
    TextoPergunta   NVARCHAR(1000)   NOT NULL,
    -- A resposta correta fica somente no banco: a API nunca a envia ao
    -- aluno, o que impede que seja lida no navegador ou no aplicativo.
    RespostaCorreta NVARCHAR(500)    NOT NULL,
    Ordem           INT              NOT NULL DEFAULT 0,

    CONSTRAINT PK_Perguntas PRIMARY KEY (Id),
    CONSTRAINT FK_Perguntas_Atividade
        FOREIGN KEY (AtividadeId) REFERENCES Atividades(Id)
        ON DELETE CASCADE
);
GO

-- ── 10. Alternativas ────────────────────────────────────────────────────────
CREATE TABLE Alternativas (
    Id         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    PerguntaId UNIQUEIDENTIFIER NOT NULL,
    Texto      NVARCHAR(500)    NOT NULL,
    Ordem      INT              NOT NULL DEFAULT 0,

    CONSTRAINT PK_Alternativas PRIMARY KEY (Id),
    CONSTRAINT FK_Alternativas_Pergunta
        FOREIGN KEY (PerguntaId) REFERENCES Perguntas(Id)
        ON DELETE CASCADE
);
GO

-- ── 11. Resultados ──────────────────────────────────────────────────────────
CREATE TABLE Resultados (
    Id             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    AlunoCpf       CHAR(11)         NOT NULL,
    AtividadeId    UNIQUEIDENTIFIER NOT NULL,
    MateriaId      UNIQUEIDENTIFIER NOT NULL,
    Acertos        INT              NOT NULL DEFAULT 0,
    TotalPerguntas INT              NOT NULL DEFAULT 0,
    RealizadoEm    DATETIME2        NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_Resultados PRIMARY KEY (Id),
    -- Garante um único envio por aluno em cada atividade
    CONSTRAINT UQ_Resultado_AlunoAtividade UNIQUE (AlunoCpf, AtividadeId),
    CONSTRAINT CK_Resultados_Acertos
        CHECK (Acertos >= 0 AND TotalPerguntas >= 0 AND Acertos <= TotalPerguntas),
    CONSTRAINT FK_Resultados_Aluno
        FOREIGN KEY (AlunoCpf) REFERENCES Usuarios(Cpf)
        ON DELETE NO ACTION,
    CONSTRAINT FK_Resultados_Atividade
        FOREIGN KEY (AtividadeId) REFERENCES Atividades(Id)
        ON DELETE NO ACTION,
    CONSTRAINT FK_Resultados_Materia
        FOREIGN KEY (MateriaId) REFERENCES Materias(Id)
        ON DELETE NO ACTION
);
GO

-- ============================================================================
--  ENGAJAMENTO E AUDITORIA
-- ============================================================================

-- ── 12. LeituraConteudos ────────────────────────────────────────────────────
--  Registra que um aluno leu um conteúdo. Alimenta o indicador
--  "Conteúdos Lidos" e os relatórios de engajamento.
CREATE TABLE LeituraConteudos (
    AlunoCpf   CHAR(11)         NOT NULL,
    ConteudoId UNIQUEIDENTIFIER NOT NULL,
    LidoEm     DATETIME2        NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_LeituraConteudos PRIMARY KEY (AlunoCpf, ConteudoId),
    CONSTRAINT FK_Leitura_Aluno
        FOREIGN KEY (AlunoCpf) REFERENCES Usuarios(Cpf)
        ON DELETE CASCADE,
    CONSTRAINT FK_Leitura_Conteudo
        FOREIGN KEY (ConteudoId) REFERENCES Conteudos(Id)
        ON DELETE NO ACTION
);
GO

-- ── 13. Sessoes ─────────────────────────────────────────────────────────────
--  Trilha de auditoria de acessos. Fim nulo indica sessão ativa.
--  A duração é calculada automaticamente por trigger no logout.
CREATE TABLE Sessoes (
    Id             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    UsuarioCpf     CHAR(11)         NOT NULL,
    Inicio         DATETIME2        NOT NULL DEFAULT GETDATE(),
    Fim            DATETIME2        NULL,
    DuracaoMinutos DECIMAL(10,2)    NULL,

    CONSTRAINT PK_Sessoes PRIMARY KEY (Id),
    CONSTRAINT FK_Sessoes_Usuario
        FOREIGN KEY (UsuarioCpf) REFERENCES Usuarios(Cpf)
        ON DELETE CASCADE
);
GO

-- ── 14. ChatbotFaqs ─────────────────────────────────────────────────────────
--  Base de conhecimento do assistente virtual. O atendimento se dá por
--  correspondência de palavras-chave sobre esta tabela, sem depender de
--  serviço externo de IA.
CREATE TABLE ChatbotFaqs (
    Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    Pergunta      NVARCHAR(300)    NOT NULL,
    Resposta      NVARCHAR(2000)   NOT NULL,
    PalavrasChave NVARCHAR(500)    NOT NULL,   -- termos separados por vírgula
    Categoria     NVARCHAR(50)     NOT NULL DEFAULT 'Geral',
    PerfilAlvo    NVARCHAR(20)     NOT NULL DEFAULT 'Todos',
    Ordem         INT              NOT NULL DEFAULT 0,
    Ativo         BIT              NOT NULL DEFAULT 1,

    CONSTRAINT PK_ChatbotFaqs PRIMARY KEY (Id),
    CONSTRAINT CK_ChatbotFaqs_Perfil
        CHECK (PerfilAlvo IN ('Todos', 'Aluno', 'Professor', 'Secretaria'))
);
GO

-- ── 15. AuditoriaUsuarios ───────────────────────────────────────────────────
--  Histórico de alterações de perfil e status, preenchido por trigger.
--  Permite rastrear quem teve privilégios alterados e quando.
CREATE TABLE AuditoriaUsuarios (
    Id            INT IDENTITY(1,1) NOT NULL,
    UsuarioCpf    CHAR(11)          NOT NULL,
    CampoAlterado NVARCHAR(50)      NOT NULL,
    ValorAnterior NVARCHAR(100)     NULL,
    ValorNovo     NVARCHAR(100)     NULL,
    AlteradoEm    DATETIME2         NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_AuditoriaUsuarios PRIMARY KEY (Id)
);
GO

-- ============================================================================
--  ÍNDICES DE DESEMPENHO
--
--  Criados sobre as colunas usadas com maior frequência em filtros e
--  junções. Sem eles, o SQL Server percorreria a tabela inteira em
--  consultas como "matérias deste professor" ou "resultados deste aluno".
-- ============================================================================

CREATE INDEX IX_Materias_Professor    ON Materias(ProfessorCpf);
CREATE INDEX IX_Conteudos_Materia     ON Conteudos(MateriaId);
CREATE INDEX IX_Turmas_Professor      ON Turmas(ProfessorCpf);
CREATE INDEX IX_Turmas_Materia        ON Turmas(MateriaId);
CREATE INDEX IX_TurmaAlunos_Aluno     ON TurmaAlunos(AlunoCpf);
CREATE INDEX IX_Atividades_Materia    ON Atividades(MateriaId);
CREATE INDEX IX_Atividades_Turma      ON Atividades(TurmaCodigo);
CREATE INDEX IX_Perguntas_Atividade   ON Perguntas(AtividadeId);
CREATE INDEX IX_Alternativas_Pergunta ON Alternativas(PerguntaId);
CREATE INDEX IX_Resultados_Aluno      ON Resultados(AlunoCpf);
CREATE INDEX IX_Resultados_Materia    ON Resultados(MateriaId);
CREATE INDEX IX_Leitura_Aluno         ON LeituraConteudos(AlunoCpf);
CREATE INDEX IX_Sessoes_Usuario       ON Sessoes(UsuarioCpf);
CREATE INDEX IX_ChatbotFaqs_Perfil    ON ChatbotFaqs(PerfilAlvo, Ativo);
CREATE INDEX IX_Auditoria_Usuario     ON AuditoriaUsuarios(UsuarioCpf);
GO

PRINT '============================================================';
PRINT ' Script 01 aplicado com sucesso.';
PRINT '   13 tabelas e 15 indices criados.';
PRINT '   Proximo passo: executar 02_procedures_triggers.sql';
PRINT '============================================================';
GO
