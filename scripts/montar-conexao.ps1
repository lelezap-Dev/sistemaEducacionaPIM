# ============================================================================
#  montar-conexao.ps1 — monta e testa a linha de conexão do Azure SQL
#
#  Pede apenas a senha do administrador do banco (sem eco), monta a
#  linha de conexão completa, testa uma conexão real e copia a linha
#  pronta para a área de transferência, para ser colada na variável
#  ConnectionStrings__DefaultConnection do Render.
#
#  A linha é montada pelo SqlConnectionStringBuilder, que coloca a
#  senha entre aspas automaticamente quando ela contém ; ou aspas —
#  o erro mais comum ao montar essa linha à mão.
#
#  Uso:
#     powershell -ExecutionPolicy Bypass -File scripts\montar-conexao.ps1
#
#  A conexão de teste só funciona de um IP liberado no firewall.
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
$linha = $b.ConnectionString

Write-Host ""
Write-Host "Conectando a $Servidor ..."
$conexao = New-Object System.Data.SqlClient.SqlConnection $linha
try {
    $conexao.Open()
    $cmd = $conexao.CreateCommand()
    $cmd.CommandText = "SELECT COUNT(*) FROM Usuarios"
    $total = $cmd.ExecuteScalar()
} catch {
    Write-Host "FALHA NA CONEXÃO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Nada foi copiado. Confira a senha e rode de novo." -ForegroundColor Red
    exit 1
} finally {
    $conexao.Dispose()
}

$linha | Set-Clipboard
Write-Host "CONEXÃO OK -> a tabela Usuarios tem $total registros." -ForegroundColor Green
Write-Host ""
Write-Host "A linha de conexão foi COPIADA. Agora, no Render:" -ForegroundColor Green
Write-Host "  1. Environment -> ConnectionStrings__DefaultConnection -> editar"
Write-Host "  2. Apague o valor antigo e cole (Ctrl+V)"
Write-Host "  3. Save, rebuild, and deploy"
