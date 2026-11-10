# ============================================================================
#  contar-usuarios.ps1 — conta os usuários cadastrados no banco do Azure SQL
#
#  Somente leitura: pede a senha do administrador do banco (sem eco),
#  consulta a tabela Usuarios e mostra o total por perfil e por situação.
#  Nada é alterado no banco e nada é copiado para a área de transferência.
#
#  Uso:
#     powershell -ExecutionPolicy Bypass -File scripts\contar-usuarios.ps1
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

$conexao = New-Object System.Data.SqlClient.SqlConnection $b.ConnectionString
try {
    $conexao.Open()
    $cmd = $conexao.CreateCommand()
    $cmd.CommandText = @"
SELECT Perfil, Status, COUNT(*) AS Quantidade
FROM Usuarios
GROUP BY Perfil, Status
ORDER BY Perfil, Status;
"@
    $tabela = New-Object System.Data.DataTable
    $tabela.Load($cmd.ExecuteReader())
} catch {
    Write-Host "FALHA NA CONSULTA: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Confira a senha e se o seu IP está liberado no firewall do Azure." -ForegroundColor Red
    exit 1
} finally {
    $conexao.Dispose()
}

$total = ($tabela.Rows | Measure-Object -Property Quantidade -Sum).Sum
Write-Host ""
$tabela | Format-Table -AutoSize | Out-String | Write-Host
Write-Host "TOTAL DE USUÁRIOS: $total" -ForegroundColor Green
