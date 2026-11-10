# ============================================================================
#  atualizar-datas-farol.ps1 — traz o cenário do Farol de Evasão para hoje
#
#  Os scripts 03 e 04 gravam datas relativas ao momento em que foram
#  aplicados. Semanas depois, todos os alunos de demonstração aparecem como
#  inativos e o farol deixa de mostrar os três níveis.
#
#  Este script descobre há quantos dias o cenário foi carregado (pela data
#  do "Exercício 4", criado 14 dias antes da carga) e adianta, nesse mesmo
#  número de dias, as datas das linhas criadas na carga:
#    atividades do cenário, resultados, sessões e leituras dos 8 alunos
#    de demonstração da turma ADS-2026-N1.
#  Linhas posteriores à carga (uso real do site) não são alteradas.
#
#  Pode ser rodado de novo antes da apresentação: cada execução realinha
#  o cenário com a data do dia. Tudo ocorre numa única transação.
#
#  Uso:
#     powershell -ExecutionPolicy Bypass -File scripts\atualizar-datas-farol.ps1
#
#  A consulta só funciona de um IP liberado no firewall do Azure.
# ============================================================================

param(
    [string]$Servidor = 'lumina-sql-leandro.database.windows.net',
    [string]$Banco    = 'SistemaEducacional',
    [string]$Usuario  = 'lumina_admin'
)

$segura = Read-Host "Senha do $Usuario na Azure (não aparece ao digitar)" -AsSecureString
$ponteiro = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($segura)
try {
    $senha = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ponteiro)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ponteiro)
}

$b = New-Object System.Data.SqlClient.SqlConnectionStringBuilder
$b['Server']                 = "tcp:$Servidor,1433"
$b['Database']               = $Banco
$b['User ID']                = $Usuario
$b['Password']               = $senha
$b['Encrypt']                = $true
$b['TrustServerCertificate'] = $false
$b['Connect Timeout']        = 30

$sql = @"
SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @Ex4 DATETIME2 = (SELECT CriadaEm FROM Atividades WHERE Titulo = N'Exercício 4 — Polimorfismo');
IF @Ex4 IS NULL
BEGIN
    RAISERROR('Cenário do farol (script 04) não encontrado.', 16, 1);
    RETURN;
END

DECLARE @Carga  DATETIME2 = DATEADD(DAY, 14, @Ex4);          -- momento da carga
DECLARE @Limite DATETIME2 = DATEADD(DAY, 1, @Carga);         -- o que veio depois é uso real
DECLARE @Dias   INT       = DATEDIFF(DAY, @Carga, SYSUTCDATETIME());

DECLARE @Alunos TABLE (Cpf CHAR(11) PRIMARY KEY);
INSERT INTO @Alunos VALUES ('33333333333'), ('44444444444'), ('66666666666'), ('77777777777'),
                           ('88888888888'), ('99999999999'), ('12121212121'), ('13131313131');

DECLARE @Ativ TABLE (Id UNIQUEIDENTIFIER PRIMARY KEY);
INSERT INTO @Ativ
SELECT Id FROM Atividades
WHERE  Titulo IN (N'Avaliação — Conceitos de POO', N'Exercício 1 — Classes e Objetos',
                  N'Exercício 2 — Encapsulamento', N'Exercício 3 — Herança',
                  N'Exercício 4 — Polimorfismo');

DECLARE @nAtiv INT = 0, @nRes INT = 0, @nSes INT = 0, @nLei INT = 0;

IF @Dias > 0
BEGIN
    BEGIN TRANSACTION;

    UPDATE Atividades SET CriadaEm = DATEADD(DAY, @Dias, CriadaEm)
    WHERE  Id IN (SELECT Id FROM @Ativ) AND CriadaEm <= @Limite;
    SET @nAtiv = @@ROWCOUNT;

    UPDATE Resultados SET RealizadoEm = DATEADD(DAY, @Dias, RealizadoEm)
    WHERE  AlunoCpf IN (SELECT Cpf FROM @Alunos)
      AND  AtividadeId IN (SELECT Id FROM @Ativ) AND RealizadoEm <= @Limite;
    SET @nRes = @@ROWCOUNT;

    UPDATE Sessoes SET Inicio = DATEADD(DAY, @Dias, Inicio),
                       Fim    = CASE WHEN Fim IS NULL THEN NULL ELSE DATEADD(DAY, @Dias, Fim) END
    WHERE  UsuarioCpf IN (SELECT Cpf FROM @Alunos) AND Inicio <= @Limite;
    SET @nSes = @@ROWCOUNT;

    UPDATE LeituraConteudos SET LidoEm = DATEADD(DAY, @Dias, LidoEm)
    WHERE  AlunoCpf IN (SELECT Cpf FROM @Alunos) AND LidoEm <= @Limite;
    SET @nLei = @@ROWCOUNT;

    COMMIT TRANSACTION;
END

SELECT CargaOriginal = @Carga, DiasAdiantados = CASE WHEN @Dias > 0 THEN @Dias ELSE 0 END,
       Atividades = @nAtiv, Resultados = @nRes, Sessoes = @nSes, Leituras = @nLei;
"@

$conexao = New-Object System.Data.SqlClient.SqlConnection $b.ConnectionString
try {
    $conexao.Open()
    $cmd = $conexao.CreateCommand()
    $cmd.CommandText = $sql
    $tabela = New-Object System.Data.DataTable
    $tabela.Load($cmd.ExecuteReader())
} catch {
    Write-Host "FALHA: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Confira a senha e se o seu IP está liberado no firewall do Azure." -ForegroundColor Red
    exit 1
} finally {
    $conexao.Dispose()
}

$r = $tabela.Rows[0]
Write-Host ""
if ([int]$r.DiasAdiantados -eq 0) {
    Write-Host "O cenário já está com a data de hoje. Nada foi alterado." -ForegroundColor Green
} else {
    Write-Host ("Cenário adiantado em {0} dias (carga original: {1:dd/MM/yyyy})." -f $r.DiasAdiantados, $r.CargaOriginal) -ForegroundColor Green
    Write-Host ("Linhas atualizadas: {0} atividades, {1} resultados, {2} sessões, {3} leituras." -f $r.Atividades, $r.Resultados, $r.Sessoes, $r.Leituras)
}
Write-Host "Esperado no Farol: 2 em risco alto, 3 em atenção e 3 regulares."
