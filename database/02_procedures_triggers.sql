-- ============================================================================
--  Sistema Acadêmico Colaborativo — Lumina
--  Script 02: Procedures, Triggers e Auditoria
--
--  PIM IV — Etapa 7 (Projeto do Banco de Dados)
--  Universidade Paulista — CST em Análise e Desenvolvimento de Sistemas
--
--  Pré-requisito: executar antes o script 01 (criação das tabelas).
--
--  Este script é IDEMPOTENTE: pode ser executado várias vezes sem erro,
--  pois todo objeto é removido antes de ser recriado.
-- ============================================================================

USE SistemaEducacional;
GO

-- ============================================================================
--  PARTE 1 — TABELA DE AUDITORIA
--  Registra alterações sensíveis de cadastro (perfil e status), atendendo à
--  rastreabilidade exigida pela regra de negócio RN02 do PIM III.
-- ============================================================================

IF OBJECT_ID('dbo.AuditoriaUsuarios', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuditoriaUsuarios (
        Id             INT IDENTITY(1,1) NOT NULL,
        UsuarioCpf     CHAR(11)          NOT NULL,
        CampoAlterado  NVARCHAR(50)      NOT NULL,
        ValorAnterior  NVARCHAR(100)     NULL,
        ValorNovo      NVARCHAR(100)     NULL,
        AlteradoEm     DATETIME2         NOT NULL DEFAULT GETDATE(),

        CONSTRAINT PK_AuditoriaUsuarios PRIMARY KEY (Id)
    );

    CREATE INDEX IX_AuditoriaUsuarios_Cpf  ON dbo.AuditoriaUsuarios(UsuarioCpf);
    CREATE INDEX IX_AuditoriaUsuarios_Data ON dbo.AuditoriaUsuarios(AlteradoEm DESC);
END
GO

-- ============================================================================
--  PARTE 2 — PROCEDURES
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
--  sp_RankingGeral
--  Classifica os alunos pelo aproveitamento médio nas atividades.
--  Alimenta o módulo "Ranking" dos perfis Professor e Secretaria.
--
--  @TopN       quantidade de posições a retornar (padrão 10)
--  @MateriaId  filtra por matéria; NULL considera todas
-- ────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('dbo.sp_RankingGeral', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_RankingGeral;
GO

CREATE PROCEDURE dbo.sp_RankingGeral
    @TopN      INT              = 10,
    @MateriaId UNIQUEIDENTIFIER = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP (@TopN)
        Posicao         = ROW_NUMBER() OVER (
                              ORDER BY CAST(SUM(r.Acertos) AS DECIMAL(10,2))
                                     / NULLIF(SUM(r.TotalPerguntas), 0) DESC,
                                       COUNT(*) DESC
                          ),
        AlunoCpf        = u.Cpf,
        AlunoNome       = u.Nome,
        TotalAtividades = COUNT(*),
        TotalAcertos    = SUM(r.Acertos),
        TotalPerguntas  = SUM(r.TotalPerguntas),
        -- Média ponderada: acertos totais sobre perguntas totais.
        -- Evita distorção quando as atividades têm tamanhos diferentes.
        MediaPercentual = CAST(
                              100.0 * SUM(r.Acertos)
                              / NULLIF(SUM(r.TotalPerguntas), 0)
                          AS DECIMAL(5,2))
    FROM dbo.Resultados r
    INNER JOIN dbo.Usuarios u ON u.Cpf = r.AlunoCpf
    WHERE u.Perfil = 'Aluno'
      AND (@MateriaId IS NULL OR r.MateriaId = @MateriaId)
    GROUP BY u.Cpf, u.Nome
    ORDER BY MediaPercentual DESC, TotalAtividades DESC;
END
GO

-- ────────────────────────────────────────────────────────────────────────────
--  sp_RelatorioAluno
--  Consolida o desempenho individual de um aluno.
--  Retorna três conjuntos: resumo, histórico de atividades e leituras.
-- ────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('dbo.sp_RelatorioAluno', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_RelatorioAluno;
GO

CREATE PROCEDURE dbo.sp_RelatorioAluno
    @AlunoCpf CHAR(11)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WHERE Cpf = @AlunoCpf)
    BEGIN
        RAISERROR('Aluno não encontrado: %s', 16, 1, @AlunoCpf);
        RETURN;
    END

    -- (1) Resumo
    SELECT
        AlunoCpf          = u.Cpf,
        AlunoNome         = u.Nome,
        Email             = u.Email,
        TotalTurmas       = (SELECT COUNT(*) FROM dbo.TurmaAlunos     ta WHERE ta.AlunoCpf = u.Cpf),
        TotalAtividades   = (SELECT COUNT(*) FROM dbo.Resultados       r WHERE r.AlunoCpf  = u.Cpf),
        TotalConteudosLidos = (SELECT COUNT(*) FROM dbo.LeituraConteudos l WHERE l.AlunoCpf = u.Cpf),
        MediaPercentual   = ISNULL((
                                SELECT CAST(100.0 * SUM(r.Acertos)
                                          / NULLIF(SUM(r.TotalPerguntas), 0) AS DECIMAL(5,2))
                                FROM dbo.Resultados r
                                WHERE r.AlunoCpf = u.Cpf
                            ), 0)
    FROM dbo.Usuarios u
    WHERE u.Cpf = @AlunoCpf;

    -- (2) Histórico de atividades
    SELECT
        AtividadeTitulo = a.Titulo,
        MateriaNome     = m.Nome,
        Acertos         = r.Acertos,
        TotalPerguntas  = r.TotalPerguntas,
        Percentual      = CAST(100.0 * r.Acertos
                             / NULLIF(r.TotalPerguntas, 0) AS DECIMAL(5,2)),
        RealizadoEm     = r.RealizadoEm
    FROM dbo.Resultados r
    INNER JOIN dbo.Atividades a ON a.Id = r.AtividadeId
    INNER JOIN dbo.Materias   m ON m.Id = r.MateriaId
    WHERE r.AlunoCpf = @AlunoCpf
    ORDER BY r.RealizadoEm DESC;

    -- (3) Conteúdos lidos
    SELECT
        ConteudoTitulo = c.Titulo,
        MateriaNome    = m.Nome,
        LidoEm         = l.LidoEm
    FROM dbo.LeituraConteudos l
    INNER JOIN dbo.Conteudos c ON c.Id = l.ConteudoId
    INNER JOIN dbo.Materias  m ON m.Id = c.MateriaId
    WHERE l.AlunoCpf = @AlunoCpf
    ORDER BY l.LidoEm DESC;
END
GO

-- ────────────────────────────────────────────────────────────────────────────
--  sp_MatricularAluno
--  Efetiva a matrícula validando as regras de negócio no próprio banco,
--  de modo que a restrição valha para qualquer cliente (web, mobile ou
--  acesso direto ao SGBD).
--
--  Regras aplicadas (RN01 do PIM III):
--    - o CPF informado deve pertencer a um usuário de perfil Aluno
--    - o aluno precisa estar com cadastro Ativo
--    - a turma deve existir
--    - a turma não pode exceder o limite de vagas
--    - matrícula duplicada é rejeitada
-- ────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('dbo.sp_MatricularAluno', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_MatricularAluno;
GO

CREATE PROCEDURE dbo.sp_MatricularAluno
    @AlunoCpf    CHAR(11),
    @TurmaCodigo NVARCHAR(50),
    @LimiteVagas INT = 40
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios
                       WHERE Cpf = @AlunoCpf AND Perfil = 'Aluno')
        BEGIN
            RAISERROR('CPF %s não corresponde a um aluno cadastrado.', 16, 1, @AlunoCpf);
            ROLLBACK TRANSACTION; RETURN;
        END

        IF EXISTS (SELECT 1 FROM dbo.Usuarios
                   WHERE Cpf = @AlunoCpf AND Status <> 'Ativo')
        BEGIN
            RAISERROR('O aluno %s não está com cadastro ativo.', 16, 1, @AlunoCpf);
            ROLLBACK TRANSACTION; RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM dbo.Turmas WHERE Codigo = @TurmaCodigo)
        BEGIN
            RAISERROR('Turma %s não encontrada.', 16, 1, @TurmaCodigo);
            ROLLBACK TRANSACTION; RETURN;
        END

        IF EXISTS (SELECT 1 FROM dbo.TurmaAlunos
                   WHERE AlunoCpf = @AlunoCpf AND TurmaCodigo = @TurmaCodigo)
        BEGIN
            RAISERROR('O aluno já está matriculado nesta turma.', 16, 1);
            ROLLBACK TRANSACTION; RETURN;
        END

        DECLARE @Ocupacao INT;
        -- UPDLOCK/HOLDLOCK evitam que duas matrículas simultâneas leiam a
        -- mesma contagem e ultrapassem o limite de vagas juntas.
        SELECT @Ocupacao = COUNT(*)
        FROM dbo.TurmaAlunos WITH (UPDLOCK, HOLDLOCK)
        WHERE TurmaCodigo = @TurmaCodigo;

        IF @Ocupacao >= @LimiteVagas
        BEGIN
            RAISERROR('Turma %s lotada (%d de %d vagas ocupadas).',
                      16, 1, @TurmaCodigo, @Ocupacao, @LimiteVagas);
            ROLLBACK TRANSACTION; RETURN;
        END

        INSERT INTO dbo.TurmaAlunos (TurmaCodigo, AlunoCpf, DataMatricula)
        VALUES (@TurmaCodigo, @AlunoCpf, GETDATE());

        COMMIT TRANSACTION;

        SELECT
            Sucesso        = CAST(1 AS BIT),
            Mensagem       = 'Matrícula efetivada com sucesso.',
            VagasOcupadas  = @Ocupacao + 1,
            VagasRestantes = @LimiteVagas - (@Ocupacao + 1);
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- ────────────────────────────────────────────────────────────────────────────
--  sp_DesempenhoTurma
--  Classifica os alunos de uma turma por faixa de rendimento.
--  Alimenta o módulo "Análise de Desempenho" do perfil Professor.
--
--  Faixas: Destaque (>= 80%), Em Progresso (60% a 79%), Em Risco (< 60%)
-- ────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('dbo.sp_DesempenhoTurma', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_DesempenhoTurma;
GO

CREATE PROCEDURE dbo.sp_DesempenhoTurma
    @TurmaCodigo NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Turmas WHERE Codigo = @TurmaCodigo)
    BEGIN
        RAISERROR('Turma %s não encontrada.', 16, 1, @TurmaCodigo);
        RETURN;
    END;

    -- CTE com a média de cada aluno matriculado na turma.
    -- O ponto e vírgula acima é exigido pelo T-SQL antes de um WITH.
    WITH MediasAlunos AS (
        SELECT
            u.Cpf,
            u.Nome,
            TotalAtividades = COUNT(r.Id),
            Media = ISNULL(CAST(100.0 * SUM(r.Acertos)
                              / NULLIF(SUM(r.TotalPerguntas), 0) AS DECIMAL(5,2)), 0)
        FROM dbo.TurmaAlunos ta
        INNER JOIN dbo.Usuarios   u ON u.Cpf = ta.AlunoCpf
        LEFT  JOIN dbo.Resultados r ON r.AlunoCpf = u.Cpf
        WHERE ta.TurmaCodigo = @TurmaCodigo
        GROUP BY u.Cpf, u.Nome
    )
    SELECT
        AlunoCpf        = Cpf,
        AlunoNome       = Nome,
        TotalAtividades,
        Media,
        Faixa = CASE
                    WHEN TotalAtividades = 0 THEN 'Sem atividades'
                    WHEN Media >= 80         THEN 'Destaque'
                    WHEN Media >= 60         THEN 'Em Progresso'
                    ELSE                          'Em Risco'
                END
    FROM MediasAlunos
    ORDER BY Media DESC, Nome;
END
GO

-- ============================================================================
--  PARTE 3 — TRIGGERS
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
--  tr_TurmaAlunos_LimiteVagas
--  Garante o limite de vagas mesmo em inserções feitas fora da procedure
--  (por exemplo, pelo Entity Framework ou por um INSERT manual).
--  É a última linha de defesa da regra RN01.
-- ────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('dbo.tr_TurmaAlunos_LimiteVagas', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_TurmaAlunos_LimiteVagas;
GO

CREATE TRIGGER dbo.tr_TurmaAlunos_LimiteVagas
ON dbo.TurmaAlunos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @LimiteVagas INT = 40;

    -- Verifica em conjunto: o INSERT pode trazer várias linhas de uma vez
    IF EXISTS (
        SELECT 1
        FROM dbo.TurmaAlunos ta
        WHERE ta.TurmaCodigo IN (SELECT DISTINCT TurmaCodigo FROM inserted)
        GROUP BY ta.TurmaCodigo
        HAVING COUNT(*) > @LimiteVagas
    )
    BEGIN
        RAISERROR('Limite de %d alunos por turma excedido. Matrícula cancelada.',
                  16, 1, @LimiteVagas);
        ROLLBACK TRANSACTION;
    END
END
GO

-- ────────────────────────────────────────────────────────────────────────────
--  tr_Resultados_Validar
--  Impede o registro de resultados incoerentes: número de acertos maior que
--  o total de perguntas, ou valores negativos.
-- ────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('dbo.tr_Resultados_Validar', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_Resultados_Validar;
GO

CREATE TRIGGER dbo.tr_Resultados_Validar
ON dbo.Resultados
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM inserted
               WHERE Acertos < 0
                  OR TotalPerguntas < 0
                  OR Acertos > TotalPerguntas)
    BEGIN
        RAISERROR('Resultado inválido: acertos não podem ser negativos nem exceder o total de perguntas.',
                  16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO

-- ────────────────────────────────────────────────────────────────────────────
--  tr_Sessoes_CalcularDuracao
--  Calcula automaticamente a duração da sessão quando o logout é registrado,
--  dispensando o cálculo na aplicação e mantendo o dado íntegro para a
--  auditoria da Secretaria.
-- ────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('dbo.tr_Sessoes_CalcularDuracao', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_Sessoes_CalcularDuracao;
GO

CREATE TRIGGER dbo.tr_Sessoes_CalcularDuracao
ON dbo.Sessoes
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Só age quando o campo Fim acabou de ser preenchido
    IF NOT UPDATE(Fim) RETURN;

    UPDATE s
    SET DuracaoMinutos = CAST(DATEDIFF(SECOND, s.Inicio, s.Fim) / 60.0 AS DECIMAL(10,2))
    FROM dbo.Sessoes s
    INNER JOIN inserted i ON i.Id = s.Id
    INNER JOIN deleted  d ON d.Id = s.Id
    WHERE i.Fim IS NOT NULL
      AND d.Fim IS NULL;   -- evita recalcular sessões já encerradas
END
GO

-- ────────────────────────────────────────────────────────────────────────────
--  tr_Usuarios_Auditoria
--  Registra alterações de Perfil e Status, permitindo rastrear quem teve
--  privilégios alterados e quando — exigência de segurança da Etapa 4.
-- ────────────────────────────────────────────────────────────────────────────
IF OBJECT_ID('dbo.tr_Usuarios_Auditoria', 'TR') IS NOT NULL
    DROP TRIGGER dbo.tr_Usuarios_Auditoria;
GO

CREATE TRIGGER dbo.tr_Usuarios_Auditoria
ON dbo.Usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Mudança de perfil (ex: Aluno promovido a Professor)
    INSERT INTO dbo.AuditoriaUsuarios (UsuarioCpf, CampoAlterado, ValorAnterior, ValorNovo)
    SELECT i.Cpf, 'Perfil', d.Perfil, i.Perfil
    FROM inserted i
    INNER JOIN deleted d ON d.Cpf = i.Cpf
    WHERE ISNULL(i.Perfil, '') <> ISNULL(d.Perfil, '');

    -- Mudança de status (ex: Pendente -> Ativo na aprovação de cadastro)
    INSERT INTO dbo.AuditoriaUsuarios (UsuarioCpf, CampoAlterado, ValorAnterior, ValorNovo)
    SELECT i.Cpf, 'Status', d.Status, i.Status
    FROM inserted i
    INNER JOIN deleted d ON d.Cpf = i.Cpf
    WHERE ISNULL(i.Status, '') <> ISNULL(d.Status, '');
END
GO

-- ============================================================================
--  PARTE 4 — VIEW DE APOIO
--  Consolida indicadores por matéria para os painéis gerenciais.
-- ============================================================================

IF OBJECT_ID('dbo.vw_IndicadoresMateria', 'V') IS NOT NULL
    DROP VIEW dbo.vw_IndicadoresMateria;
GO

CREATE VIEW dbo.vw_IndicadoresMateria
AS
SELECT
    MateriaId       = m.Id,
    MateriaNome     = m.Nome,
    ProfessorNome   = p.Nome,
    TotalConteudos  = (SELECT COUNT(*) FROM dbo.Conteudos  c WHERE c.MateriaId = m.Id),
    TotalAtividades = (SELECT COUNT(*) FROM dbo.Atividades a WHERE a.MateriaId = m.Id),
    TotalTurmas     = (SELECT COUNT(*) FROM dbo.Turmas     t WHERE t.MateriaId = m.Id),
    MediaGeral      = ISNULL((
                          SELECT CAST(100.0 * SUM(r.Acertos)
                                    / NULLIF(SUM(r.TotalPerguntas), 0) AS DECIMAL(5,2))
                          FROM dbo.Resultados r
                          WHERE r.MateriaId = m.Id
                      ), 0)
FROM dbo.Materias m
LEFT JOIN dbo.Usuarios p ON p.Cpf = m.ProfessorCpf;
GO

PRINT '============================================================';
PRINT ' Script 02 aplicado com sucesso.';
PRINT '   4 procedures  : sp_RankingGeral, sp_RelatorioAluno,';
PRINT '                   sp_MatricularAluno, sp_DesempenhoTurma';
PRINT '   4 triggers    : limite de vagas, validacao de resultados,';
PRINT '                   duracao de sessao, auditoria de usuarios';
PRINT '   1 view        : vw_IndicadoresMateria';
PRINT '   1 tabela      : AuditoriaUsuarios';
PRINT '============================================================';
GO
