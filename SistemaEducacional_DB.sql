-- ============================================================
--  SistemaEducacional_DB.sql  (versão corrigida)
--  Execute no SSMS conectado ao SQL Server 2022
-- ============================================================

-- ── 1. Cria o banco se não existir ───────────────────────────
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SistemaEducacional')
BEGIN
    CREATE DATABASE SistemaEducacional
    COLLATE Latin1_General_CI_AI;
END
GO

USE SistemaEducacional;
GO

-- ── 2. Remove tabelas (ordem inversa de FK) ───────────────────
DROP TABLE IF EXISTS LeituraConteudos;
DROP TABLE IF EXISTS Sessoes;
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

-- ── 3. Usuarios ───────────────────────────────────────────────
CREATE TABLE Usuarios (
    Cpf          CHAR(11)      NOT NULL,
    Nome         NVARCHAR(150) NOT NULL,
    Email        NVARCHAR(254) NOT NULL,
    SenhaHash    NVARCHAR(100) NOT NULL,
    Perfil       NVARCHAR(20)  NOT NULL
        CONSTRAINT CK_Usuarios_Perfil
        CHECK (Perfil IN ('Aluno', 'Professor', 'Secretaria')),
    PalavraChave NVARCHAR(100) NOT NULL DEFAULT '',
    DataCadastro DATETIME2     NOT NULL DEFAULT GETDATE(),   -- era CriadoEm

    CONSTRAINT PK_Usuarios     PRIMARY KEY (Cpf),
    CONSTRAINT UQ_Usuarios_Email UNIQUE (Email)
);
GO

-- ── 4. Materias ───────────────────────────────────────────────
CREATE TABLE Materias (
    Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),  -- era NVARCHAR(50)
    ProfessorCpf CHAR(11)         NOT NULL,
    Nome         NVARCHAR(200)    NOT NULL,
    Descricao    NVARCHAR(1000)   NOT NULL DEFAULT '',
    DataCriacao  DATETIME2        NOT NULL DEFAULT GETDATE(), -- era CriadaEm

    CONSTRAINT PK_Materias PRIMARY KEY (Id),
    CONSTRAINT FK_Materias_Professor
        FOREIGN KEY (ProfessorCpf) REFERENCES Usuarios(Cpf)
        ON DELETE CASCADE
);
GO

-- ── 5. Conteudos ──────────────────────────────────────────────
CREATE TABLE Conteudos (
    Id        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    MateriaId UNIQUEIDENTIFIER NOT NULL,
    Titulo    NVARCHAR(300)    NOT NULL,
    Texto     NVARCHAR(MAX)    NOT NULL DEFAULT '',
    Ordem     INT              NOT NULL DEFAULT 0,

    CONSTRAINT PK_Conteudos PRIMARY KEY (Id),
    CONSTRAINT FK_Conteudos_Materia
        FOREIGN KEY (MateriaId) REFERENCES Materias(Id)
        ON DELETE CASCADE
);
GO

-- ── 6. Turmas ─────────────────────────────────────────────────
CREATE TABLE Turmas (
    Codigo       NVARCHAR(50)     NOT NULL,
    ProfessorCpf CHAR(11)         NOT NULL,
    MateriaId    UNIQUEIDENTIFIER NOT NULL,
    Horario      NVARCHAR(100)    NOT NULL DEFAULT '',
    DataCriacao  DATETIME2        NOT NULL DEFAULT GETDATE(), -- era CriadaEm

    CONSTRAINT PK_Turmas PRIMARY KEY (Codigo),
    CONSTRAINT FK_Turmas_Professor
        FOREIGN KEY (ProfessorCpf) REFERENCES Usuarios(Cpf)
        ON DELETE NO ACTION,
    CONSTRAINT FK_Turmas_Materia
        FOREIGN KEY (MateriaId) REFERENCES Materias(Id)
        ON DELETE NO ACTION
);
GO

-- ── 7. TurmaAlunos ────────────────────────────────────────────
CREATE TABLE TurmaAlunos (
    TurmaCodigo   NVARCHAR(50) NOT NULL,
    AlunoCpf      CHAR(11)     NOT NULL,
    DataMatricula DATETIME2    NOT NULL DEFAULT GETDATE(),   -- era MatriculadoEm

    CONSTRAINT PK_TurmaAlunos PRIMARY KEY (TurmaCodigo, AlunoCpf),
    CONSTRAINT FK_TurmaAlunos_Turma
        FOREIGN KEY (TurmaCodigo) REFERENCES Turmas(Codigo)
        ON DELETE CASCADE,
    CONSTRAINT FK_TurmaAlunos_Aluno
        FOREIGN KEY (AlunoCpf) REFERENCES Usuarios(Cpf)
        ON DELETE NO ACTION
);
GO

-- ── 8. Atividades ─────────────────────────────────────────────
CREATE TABLE Atividades (
    Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    MateriaId    UNIQUEIDENTIFIER NOT NULL,
    TurmaCodigo  NVARCHAR(50)     NULL,
    Titulo       NVARCHAR(300)    NOT NULL,
    CriadaPorCpf CHAR(11)         NOT NULL,  -- era CriadaPor
    CriadaEm     DATETIME2        NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_Atividades PRIMARY KEY (Id),
    CONSTRAINT FK_Atividades_Materia
        FOREIGN KEY (MateriaId) REFERENCES Materias(Id)
        ON DELETE CASCADE,
    CONSTRAINT FK_Atividades_Turma
        FOREIGN KEY (TurmaCodigo) REFERENCES Turmas(Codigo)
        ON DELETE SET NULL,
    CONSTRAINT FK_Atividades_Professor
        FOREIGN KEY (CriadaPorCpf) REFERENCES Usuarios(Cpf)
        ON DELETE NO ACTION
);
GO

-- ── 9. Perguntas ──────────────────────────────────────────────
CREATE TABLE Perguntas (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    AtividadeId     UNIQUEIDENTIFIER NOT NULL,
    TextoPergunta   NVARCHAR(1000)   NOT NULL,
    RespostaCorreta NVARCHAR(500)    NOT NULL,
    Ordem           INT              NOT NULL DEFAULT 0,

    CONSTRAINT PK_Perguntas PRIMARY KEY (Id),
    CONSTRAINT FK_Perguntas_Atividade
        FOREIGN KEY (AtividadeId) REFERENCES Atividades(Id)
        ON DELETE CASCADE
);
GO

-- ── 10. Alternativas ──────────────────────────────────────────
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

-- ── 11. Resultados ────────────────────────────────────────────
CREATE TABLE Resultados (
    Id             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    AlunoCpf       CHAR(11)         NOT NULL,
    AtividadeId    UNIQUEIDENTIFIER NOT NULL,
    MateriaId      UNIQUEIDENTIFIER NOT NULL,
    Acertos        INT              NOT NULL DEFAULT 0,
    TotalPerguntas INT              NOT NULL DEFAULT 0,   -- era Total
    RealizadoEm    DATETIME2        NOT NULL DEFAULT GETDATE(), -- era RealizadaEm

    CONSTRAINT PK_Resultados PRIMARY KEY (Id),
    CONSTRAINT UQ_Resultado_AlunoAtividade UNIQUE (AlunoCpf, AtividadeId),
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

-- ── 12. LeituraConteudos ──────────────────────────────────────
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

-- ── 13. Sessoes ───────────────────────────────────────────────
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

-- ── 14. Índices de performance ────────────────────────────────
CREATE INDEX IX_Materias_Professor ON Materias(ProfessorCpf);
CREATE INDEX IX_Turmas_Professor   ON Turmas(ProfessorCpf);
CREATE INDEX IX_Turmas_Materia     ON Turmas(MateriaId);
CREATE INDEX IX_Atividades_Materia ON Atividades(MateriaId);
CREATE INDEX IX_Resultados_Aluno   ON Resultados(AlunoCpf);
CREATE INDEX IX_Sessoes_Usuario    ON Sessoes(UsuarioCpf);
GO

-- ── 15. Usuário Secretaria padrão ─────────────────────────────
--  Senha: Admin@123  (hash BCrypt cost 11)
INSERT INTO Usuarios (Cpf, Nome, Email, SenhaHash, Perfil, PalavraChave)
VALUES (
    '00000000000',
    'Administrador',
    'admin@escola.com',
    '$2a$11$TQZEjuIPCPUAMnbG5J3X7.YkIj.lJPWdF6IhWZkUJdKxOBr5dTBJy',
    'Secretaria',
    'sistema'
);
GO

PRINT '✅ Banco SistemaEducacional recriado com sucesso!';
PRINT 'Login: CPF 00000000000 | Senha: Admin@123';
GO
