-- ============================================================================
--  Sistema Acadêmico Colaborativo — Lumina
--  Script 04: Cenário de demonstração do Farol de Evasão
--
--  Acrescenta à turma ADS-2026-N1 seis alunos com trajetórias distintas,
--  para que o Farol de Evasão exiba os três níveis de risco:
--
--    Ana Paula Ribeiro   notas baixas, sumiu, atividades pendentes → Alto
--    Igor Nascimento     matriculado, nunca acessou               → Alto
--    Diego Martins       começou bem e o rendimento desabou        → Atenção
--    Gabriel Souza       boas notas, mas parou de entregar         → Atenção
--    Helena Costa        boa aluna, uma entrega atrasada           → Regular
--    Fernanda Alves      assídua e com bom desempenho              → Regular
--
--  Todas as datas são RELATIVAS ao momento da execução. Com datas fixas,
--  o cenário envelheceria: semanas depois, todos os alunos apareceriam
--  como inativos e o farol perderia o sentido.
--
--  Depende do script 03 (matéria, turma e professora de demonstração).
--  Idempotente: não faz nada se o cenário já tiver sido aplicado.
-- ============================================================================

USE SistemaEducacional;
GO

SET NOCOUNT ON;

IF EXISTS (SELECT 1 FROM Atividades WHERE Titulo = 'Exercício 1 — Classes e Objetos')
BEGIN
    PRINT 'Script 04: cenário do farol já aplicado. Nada a fazer.';
    RETURN;
END

DECLARE @Agora     DATETIME2        = SYSUTCDATETIME();
DECLARE @Senha     NVARCHAR(100)    = '$2a$11$g9eI7vZ/aGpArjZMy0QO9e/DCXizB/mc0opIMVOioxif0pftdyX.2';  -- Lumina@2026
DECLARE @Turma     NVARCHAR(50)     = 'ADS-2026-N1';
DECLARE @Professor NVARCHAR(11)     = '22222222222';
DECLARE @MateriaId UNIQUEIDENTIFIER =
    (SELECT TOP 1 Id FROM Materias WHERE Nome = 'Programação Orientada a Objetos');
DECLARE @AvaliacaoId UNIQUEIDENTIFIER =
    (SELECT TOP 1 Id FROM Atividades WHERE Titulo = 'Avaliação — Conceitos de POO');

IF @MateriaId IS NULL OR @AvaliacaoId IS NULL
BEGIN
    RAISERROR('Script 04 requer o script 03 aplicado antes.', 16, 1);
    RETURN;
END

BEGIN TRY
BEGIN TRANSACTION;

-- ── 1. Linha do tempo das atividades ────────────────────────────────────────
-- A avaliação do script 03 passa a ser a primeira atividade do semestre;
-- os quatro exercícios vêm em seguida, um por semana.
UPDATE Atividades
SET    CriadaEm = DATEADD(DAY, -45, @Agora)
WHERE  Id = @AvaliacaoId;

DECLARE @Ex TABLE (Num INT PRIMARY KEY, Id UNIQUEIDENTIFIER DEFAULT NEWID(),
                   Titulo NVARCHAR(300), DiasAtras INT);
INSERT INTO @Ex (Num, Titulo, DiasAtras) VALUES
    (0, NULL,                                      45),   -- avaliação existente
    (1, 'Exercício 1 — Classes e Objetos',         35),
    (2, 'Exercício 2 — Encapsulamento',            28),
    (3, 'Exercício 3 — Herança',                   21),
    (4, 'Exercício 4 — Polimorfismo',              14);
UPDATE @Ex SET Id = @AvaliacaoId WHERE Num = 0;

INSERT INTO Atividades (Id, MateriaId, TurmaCodigo, Titulo, CriadaPorCpf, CriadaEm)
SELECT Id, @MateriaId, @Turma, Titulo, @Professor, DATEADD(DAY, -DiasAtras, @Agora)
FROM   @Ex WHERE Num > 0;

-- ── 2. Perguntas e alternativas dos exercícios ──────────────────────────────
DECLARE @Q TABLE (Num INT, Ordem INT, Id UNIQUEIDENTIFIER DEFAULT NEWID(),
                  Texto NVARCHAR(500), Correta NVARCHAR(200),
                  A1 NVARCHAR(200), A2 NVARCHAR(200), A3 NVARCHAR(200), A4 NVARCHAR(200));
INSERT INTO @Q (Num, Ordem, Texto, Correta, A1, A2, A3, A4) VALUES
    (1, 1, 'O que é um objeto?', 'Uma instância de uma classe',
           'Uma instância de uma classe', 'Um tipo primitivo', 'Um método estático', 'Um pacote'),
    (1, 2, 'O que define os dados que um objeto guarda?', 'Atributos',
           'Métodos', 'Atributos', 'Construtores', 'Interfaces'),
    (1, 3, 'Qual membro é executado ao criar um objeto?', 'Construtor',
           'Destrutor', 'Getter', 'Construtor', 'Operador'),
    (2, 1, 'Qual modificador restringe o acesso à própria classe?', 'private',
           'public', 'private', 'protected', 'internal'),
    (2, 2, 'Para que servem getters e setters?', 'Controlar o acesso aos atributos',
           'Acelerar a execução', 'Controlar o acesso aos atributos', 'Criar objetos', 'Herdar classes'),
    (2, 3, 'Qual é o principal benefício do encapsulamento?', 'Reduzir o acoplamento',
           'Reduzir o acoplamento', 'Aumentar o uso de memória', 'Eliminar classes', 'Dispensar testes'),
    (3, 1, 'Como se chama a classe da qual outra herda?', 'Superclasse',
           'Subclasse', 'Superclasse', 'Interface', 'Instância'),
    (3, 2, 'Qual palavra-chave chama o construtor da classe-mãe em C#?', 'base',
           'this', 'super', 'base', 'parent'),
    (3, 3, 'Herança representa qual tipo de relação?', 'É um',
           'Tem um', 'Usa um', 'É um', 'Conhece um'),
    (4, 1, 'Sobrescrever um método na subclasse é um exemplo de:', 'Polimorfismo',
           'Encapsulamento', 'Polimorfismo', 'Composição', 'Abstração'),
    (4, 2, 'Em C#, que palavra-chave permite que um método seja sobrescrito?', 'virtual',
           'static', 'sealed', 'virtual', 'readonly'),
    (4, 3, 'Uma lista de Animal contendo Cão e Gato demonstra:', 'Polimorfismo',
           'Polimorfismo', 'Sobrecarga', 'Encapsulamento', 'Herança múltipla');

INSERT INTO Perguntas (Id, AtividadeId, TextoPergunta, RespostaCorreta, Ordem)
SELECT q.Id, e.Id, q.Texto, q.Correta, q.Ordem
FROM   @Q q JOIN @Ex e ON e.Num = q.Num;

INSERT INTO Alternativas (PerguntaId, Texto, Ordem)
SELECT q.Id, a.Texto, a.Ordem
FROM   @Q q
CROSS APPLY (VALUES (q.A1, 1), (q.A2, 2), (q.A3, 3), (q.A4, 4)) a(Texto, Ordem);

-- ── 3. Alunos e matrículas ──────────────────────────────────────────────────
DECLARE @Alunos TABLE (Cpf NVARCHAR(11), Nome NVARCHAR(150), Email NVARCHAR(254));
INSERT INTO @Alunos VALUES
    ('66666666666', 'Ana Paula Ribeiro', 'anapaula@lumina.edu.br'),
    ('77777777777', 'Diego Martins',     'diego@lumina.edu.br'),
    ('88888888888', 'Fernanda Alves',    'fernanda@lumina.edu.br'),
    ('99999999999', 'Gabriel Souza',     'gabriel@lumina.edu.br'),
    ('12121212121', 'Helena Costa',      'helena@lumina.edu.br'),
    ('13131313131', 'Igor Nascimento',   'igor@lumina.edu.br');

INSERT INTO Usuarios (Cpf, Nome, Email, SenhaHash, Perfil, PalavraChave, Status, DataCadastro)
SELECT a.Cpf, a.Nome, a.Email, @Senha, 'Aluno', 'lumina', 'Ativo', DATEADD(DAY, -50, @Agora)
FROM   @Alunos a
WHERE  NOT EXISTS (SELECT 1 FROM Usuarios u WHERE u.Cpf = a.Cpf);

INSERT INTO TurmaAlunos (TurmaCodigo, AlunoCpf, DataMatricula)
SELECT @Turma, a.Cpf, DATEADD(DAY, -50, @Agora)
FROM   @Alunos a
WHERE  NOT EXISTS (SELECT 1 FROM TurmaAlunos t WHERE t.TurmaCodigo = @Turma AND t.AlunoCpf = a.Cpf);

-- ── 4. Resultados (acertos em 3 perguntas; entregue 2 dias após a abertura) ──
DECLARE @R TABLE (Cpf NVARCHAR(11), Num INT, Acertos INT);
INSERT INTO @R VALUES
    -- Ana Paula: vai mal e abandona as entregas após o exercício 1
    ('66666666666', 0, 1), ('66666666666', 1, 0),
    -- Diego: começa com nota máxima e o rendimento desaba
    ('77777777777', 0, 3), ('77777777777', 1, 3), ('77777777777', 2, 1),
    ('77777777777', 3, 1), ('77777777777', 4, 0),
    -- Fernanda: constante e com bom desempenho
    ('88888888888', 0, 3), ('88888888888', 1, 3), ('88888888888', 2, 2),
    ('88888888888', 3, 3), ('88888888888', 4, 3),
    -- Gabriel: boas notas, mas para de entregar
    ('99999999999', 0, 2), ('99999999999', 1, 3),
    -- Helena: boa aluna, falta só o último exercício
    ('12121212121', 0, 3), ('12121212121', 1, 2), ('12121212121', 2, 3), ('12121212121', 3, 3),
    -- Lucas e Beatriz (script 03) completam os exercícios
    ('33333333333', 1, 3), ('33333333333', 2, 3), ('33333333333', 3, 3), ('33333333333', 4, 3),
    ('44444444444', 1, 2), ('44444444444', 2, 2), ('44444444444', 3, 2), ('44444444444', 4, 2);
    -- Igor: nenhuma entrega

INSERT INTO Resultados (AlunoCpf, AtividadeId, MateriaId, Acertos, TotalPerguntas, RealizadoEm)
SELECT r.Cpf, e.Id, @MateriaId, r.Acertos, 3, DATEADD(DAY, -(e.DiasAtras - 2), @Agora)
FROM   @R r JOIN @Ex e ON e.Num = r.Num
WHERE  NOT EXISTS (SELECT 1 FROM Resultados x WHERE x.AlunoCpf = r.Cpf AND x.AtividadeId = e.Id);

-- ── 5. Último acesso (sessões encerradas, 45 minutos cada) ──────────────────
DECLARE @S TABLE (Cpf NVARCHAR(11), DiasAtras INT);
INSERT INTO @S VALUES
    ('66666666666', 20),   -- Ana Paula: sumiu há quase três semanas
    ('77777777777',  2),
    ('88888888888',  1),
    ('99999999999',  9),   -- Gabriel: uma semana e pouco sem entrar
    ('12121212121',  0);
    -- Igor: nunca acessou

INSERT INTO Sessoes (UsuarioCpf, Inicio, Fim, DuracaoMinutos)
SELECT Cpf, DATEADD(DAY, -DiasAtras, @Agora),
       DATEADD(MINUTE, 45, DATEADD(DAY, -DiasAtras, @Agora)), 45
FROM   @S;

-- ── 6. Leitura de conteúdos ─────────────────────────────────────────────────
DECLARE @L TABLE (Cpf NVARCHAR(11), DiasAtras INT);
INSERT INTO @L VALUES
    ('77777777777',  3),
    ('88888888888',  1),
    ('99999999999', 10),
    ('12121212121',  4);
    -- Ana Paula e Igor: nenhuma leitura

INSERT INTO LeituraConteudos (AlunoCpf, ConteudoId, LidoEm)
SELECT l.Cpf, c.Id, DATEADD(DAY, -l.DiasAtras, @Agora)
FROM   @L l
CROSS JOIN Conteudos c
WHERE  c.MateriaId = @MateriaId
  AND  NOT EXISTS (SELECT 1 FROM LeituraConteudos x WHERE x.AlunoCpf = l.Cpf AND x.ConteudoId = c.Id);

COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO

PRINT '============================================================';
PRINT ' Script 04 aplicado com sucesso.';
PRINT '   6 alunos novos na turma ADS-2026-N1';
PRINT '   4 exercicios com 3 perguntas cada';
PRINT '   Farol esperado: 2 risco alto, 4 atencao, 2 regular';
PRINT '============================================================';
GO
