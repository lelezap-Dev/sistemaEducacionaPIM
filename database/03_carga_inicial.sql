-- ============================================================================
--  Sistema Acadêmico Colaborativo — Lumina
--  Script 03: Carga inicial (dados de demonstração)
--
--  PIM IV — Etapa 7 (Projeto do Banco de Dados)
--
--  Popula a base com um cenário mínimo para demonstração e testes:
--  usuários dos três perfis, uma matéria com conteúdos, uma turma com
--  alunos matriculados e uma atividade avaliativa completa.
--
--  Os hashes de senha foram gerados com BCrypt. A senha das contas de
--  demonstração não é publicada aqui: é combinada entre a equipe, e as
--  contas do ambiente em nuvem têm senha própria (scripts/proteger-contas-demo.ps1).
--
--  ATENÇÃO: as contas abaixo são fictícias e destinam-se apenas a
--  demonstração acadêmica. Em produção, cadastre usuários reais pela
--  aplicação e remova estes registros.
--
--  Este script é idempotente: verifica a existência antes de inserir.
-- ============================================================================

USE SistemaEducacional;
GO

SET NOCOUNT ON;

-- ── 1. Usuários ─────────────────────────────────────────────────────────────
-- Hash BCrypt (fator de custo 11) da senha de demonstração do ambiente local.
-- Gerado com a mesma biblioteca usada pela aplicação (BCrypt.Net-Next) e
-- conferido com Verify() antes de ser fixado aqui. O valor anterior era um
-- vetor de exemplo da documentação da biblioteca, que corresponde a outra
-- senha: as cinco contas de demonstração eram criadas, mas nenhuma
-- conseguia autenticar.
DECLARE @Senha NVARCHAR(100) = '$2a$11$g9eI7vZ/aGpArjZMy0QO9e/DCXizB/mc0opIMVOioxif0pftdyX.2';

IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Cpf = '11111111111')
INSERT INTO Usuarios (Cpf, Nome, Email, SenhaHash, Perfil, PalavraChave, Status) VALUES
    ('11111111111', 'Carla Menezes',    'carla@lumina.edu.br',   @Senha, 'Secretaria', 'lumina', 'Ativo');

IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Cpf = '22222222222')
INSERT INTO Usuarios (Cpf, Nome, Email, SenhaHash, Perfil, PalavraChave, Status) VALUES
    ('22222222222', 'Mariana Fontes',   'mariana@lumina.edu.br', @Senha, 'Professor',  'lumina', 'Ativo');

IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Cpf = '33333333333')
INSERT INTO Usuarios (Cpf, Nome, Email, SenhaHash, Perfil, PalavraChave, Status) VALUES
    ('33333333333', 'Lucas Andrade',    'lucas@lumina.edu.br',   @Senha, 'Aluno',      'lumina', 'Ativo');

IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Cpf = '44444444444')
INSERT INTO Usuarios (Cpf, Nome, Email, SenhaHash, Perfil, PalavraChave, Status) VALUES
    ('44444444444', 'Beatriz Rocha',    'beatriz@lumina.edu.br', @Senha, 'Aluno',      'lumina', 'Ativo');

IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Cpf = '55555555555')
INSERT INTO Usuarios (Cpf, Nome, Email, SenhaHash, Perfil, PalavraChave, Status) VALUES
    ('55555555555', 'Rafael Lima',      'rafael@lumina.edu.br',  @Senha, 'Professor',  'lumina', 'Pendente');
GO

-- ── 2. Matéria e conteúdos ──────────────────────────────────────────────────
DECLARE @MateriaId UNIQUEIDENTIFIER;

IF NOT EXISTS (SELECT 1 FROM Materias WHERE Nome = 'Programação Orientada a Objetos')
BEGIN
    SET @MateriaId = NEWID();
    INSERT INTO Materias (Id, ProfessorCpf, Nome, Descricao) VALUES
        (@MateriaId, '22222222222', 'Programação Orientada a Objetos',
         'Fundamentos de POO: classes, objetos, herança, encapsulamento e polimorfismo.');

    INSERT INTO Conteudos (MateriaId, Titulo, Texto, Ordem) VALUES
        (@MateriaId, 'Introdução à POO',
         'A Programação Orientada a Objetos organiza o software em torno de objetos, que reúnem dados e comportamentos. ' +
         'Diferente da programação estruturada, que separa dados de funções, a POO aproxima o código do modo como ' +
         'pensamos sobre o mundo real.', 1),
        (@MateriaId, 'Encapsulamento',
         'Encapsulamento é o princípio de esconder os detalhes internos de um objeto, expondo apenas o necessário. ' +
         'Isso reduz o acoplamento: mudanças na implementação interna não quebram quem usa a classe.', 2),
        (@MateriaId, 'Herança e Polimorfismo',
         'Herança permite que uma classe reaproveite comportamento de outra. Polimorfismo permite que objetos de tipos ' +
         'diferentes respondam à mesma mensagem de formas distintas.', 3);
END
ELSE
    SELECT @MateriaId = Id FROM Materias WHERE Nome = 'Programação Orientada a Objetos';
GO

-- ── 3. Turma e matrículas ───────────────────────────────────────────────────
DECLARE @MateriaId UNIQUEIDENTIFIER =
    (SELECT TOP 1 Id FROM Materias WHERE Nome = 'Programação Orientada a Objetos');

IF NOT EXISTS (SELECT 1 FROM Turmas WHERE Codigo = 'ADS-2026-N1')
BEGIN
    INSERT INTO Turmas (Codigo, ProfessorCpf, MateriaId, Horario) VALUES
        ('ADS-2026-N1', '22222222222', @MateriaId, 'Segunda e Quarta, 19h-21h');

    INSERT INTO TurmaAlunos (TurmaCodigo, AlunoCpf) VALUES
        ('ADS-2026-N1', '33333333333'),
        ('ADS-2026-N1', '44444444444');
END
GO

-- ── 4. Atividade avaliativa ─────────────────────────────────────────────────
DECLARE @MateriaId UNIQUEIDENTIFIER =
    (SELECT TOP 1 Id FROM Materias WHERE Nome = 'Programação Orientada a Objetos');
DECLARE @AtividadeId UNIQUEIDENTIFIER;
DECLARE @P1 UNIQUEIDENTIFIER, @P2 UNIQUEIDENTIFIER, @P3 UNIQUEIDENTIFIER;

IF NOT EXISTS (SELECT 1 FROM Atividades WHERE Titulo = 'Avaliação — Conceitos de POO')
BEGIN
    SET @AtividadeId = NEWID();
    SET @P1 = NEWID(); SET @P2 = NEWID(); SET @P3 = NEWID();

    INSERT INTO Atividades (Id, MateriaId, TurmaCodigo, Titulo, CriadaPorCpf) VALUES
        (@AtividadeId, @MateriaId, 'ADS-2026-N1', 'Avaliação — Conceitos de POO', '22222222222');

    INSERT INTO Perguntas (Id, AtividadeId, TextoPergunta, RespostaCorreta, Ordem) VALUES
        (@P1, @AtividadeId,
         'Qual princípio da POO consiste em ocultar os detalhes internos de um objeto?',
         'Encapsulamento', 1),
        (@P2, @AtividadeId,
         'O que permite que objetos de tipos diferentes respondam à mesma mensagem de formas distintas?',
         'Polimorfismo', 2),
        (@P3, @AtividadeId,
         'Qual mecanismo permite que uma classe reaproveite o comportamento de outra?',
         'Herança', 3);

    INSERT INTO Alternativas (PerguntaId, Texto, Ordem) VALUES
        (@P1, 'Encapsulamento', 1), (@P1, 'Herança', 2),
        (@P1, 'Polimorfismo', 3),   (@P1, 'Abstração', 4),

        (@P2, 'Encapsulamento', 1), (@P2, 'Polimorfismo', 2),
        (@P2, 'Composição', 3),     (@P2, 'Sobrecarga', 4),

        (@P3, 'Interface', 1),      (@P3, 'Herança', 2),
        (@P3, 'Encapsulamento', 3), (@P3, 'Delegação', 4);
END
GO

-- ── 5. Resultado e leitura de exemplo ───────────────────────────────────────
DECLARE @MateriaId   UNIQUEIDENTIFIER =
    (SELECT TOP 1 Id FROM Materias   WHERE Nome   = 'Programação Orientada a Objetos');
DECLARE @AtividadeId UNIQUEIDENTIFIER =
    (SELECT TOP 1 Id FROM Atividades WHERE Titulo = 'Avaliação — Conceitos de POO');

IF @AtividadeId IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM Resultados WHERE AlunoCpf = '33333333333' AND AtividadeId = @AtividadeId)
BEGIN
    INSERT INTO Resultados (AlunoCpf, AtividadeId, MateriaId, Acertos, TotalPerguntas) VALUES
        ('33333333333', @AtividadeId, @MateriaId, 3, 3),   -- Lucas: 100%
        ('44444444444', @AtividadeId, @MateriaId, 2, 3);   -- Beatriz: 67%
END

-- Marca alguns conteúdos como lidos, alimentando o indicador de engajamento
INSERT INTO LeituraConteudos (AlunoCpf, ConteudoId)
SELECT '33333333333', c.Id
FROM Conteudos c
WHERE c.MateriaId = @MateriaId
  AND NOT EXISTS (SELECT 1 FROM LeituraConteudos l
                  WHERE l.AlunoCpf = '33333333333' AND l.ConteudoId = c.Id);
GO

PRINT '============================================================';
PRINT ' Script 03 aplicado com sucesso.';
PRINT '   5 usuarios (1 secretaria, 2 professores, 2 alunos)';
PRINT '   1 materia com 3 conteudos';
PRINT '   1 turma com 2 alunos matriculados';
PRINT '   1 atividade com 3 perguntas e 12 alternativas';
PRINT '   2 resultados e 3 leituras registradas';
PRINT '';
PRINT ' Senha das contas de demonstracao: combinada com a equipe';
PRINT '============================================================';
GO
