# ============================================================================
#  proteger-contas-demo.ps1 — tira do ar a senha publica das contas de demonstracao
#
#  As contas de demonstracao (secretaria, professores e alunos ficticios)
#  nasceram com senha e palavra-chave escritas nos scripts do repositorio,
#  que e publico. No site em producao, isso deixaria qualquer visitante
#  entrar como secretaria — ou redefinir a senha pela palavra-chave.
#
#  O script age em duas etapas, nesta ordem:
#    1. troca a senha de cada conta pela API do proprio site, usando a
#       palavra-chave publica (a API gera o hash com a biblioteca de sempre);
#    2. substitui a palavra-chave dessas contas por valor aleatorio, direto
#       no banco, fechando a recuperacao de senha.
#  Invertida, a etapa 1 falharia: ela depende da palavra-chave antiga.
#
#  Pede duas senhas, ambas sem eco: a nova senha das contas de demonstracao
#  e a do administrador do banco (lumina_admin). A conta de administrador
#  do sistema (CPF 00000000000) nao e alterada.
#
#  Uso:
#     powershell -ExecutionPolicy Bypass -File scripts\proteger-contas-demo.ps1
#
#  ATENCAO: reaplicar scripts\aplicar-banco-azure.ps1 recria as contas com a
#  senha antiga. Rode este script de novo depois disso.
# ============================================================================

param(
    [string]$Site     = 'https://lumina-sd21.onrender.com',
    [string]$Servidor = 'lumina-sql-leandro.database.windows.net',
    [string]$Banco    = 'SistemaEducacional',
    [string]$Usuario  = 'lumina_admin'
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Contas criadas pelos scripts 03 e 04
$contas = '11111111111', '22222222222', '33333333333', '44444444444', '55555555555',
          '66666666666', '77777777777', '88888888888', '99999999999', '12121212121',
          '13131313131'

function Ler-Segredo([string]$Rotulo) {
    $seguro = Read-Host $Rotulo -AsSecureString
    $ponteiro = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($seguro)
    try     { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ponteiro) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ponteiro) }
}

# ── Nova senha ───────────────────────────────────────────────────────────────
$nova = Ler-Segredo "Nova senha das contas de demonstracao (nao aparece ao digitar)"
$conf = Ler-Segredo "Repita a nova senha"
if ($nova -cne $conf) { Write-Host "As senhas nao conferem." -ForegroundColor Red; exit 1 }

# Mesma politica aplicada pela API (AuthService.ValidarSenha)
if ($nova.Length -lt 8 -or $nova -cnotmatch '[A-Z]' -or $nova -cnotmatch '[a-z]' -or
    $nova -notmatch '\d' -or $nova -notmatch '[!@#$%^&*()\-_+=]') {
    Write-Host "Senha fraca: minimo de 8 caracteres, com maiuscula, minuscula, numero" -ForegroundColor Red
    Write-Host "e ao menos um destes simbolos:  ! @ # $ % ^ & * ( ) - _ + =" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "--- Acordando o site (o plano gratuito pode levar ate 1 minuto) ---"
try { Invoke-WebRequest "$Site/health" -UseBasicParsing -TimeoutSec 120 | Out-Null }
catch { Write-Host "Site indisponivel: $($_.Exception.Message)" -ForegroundColor Red; exit 1 }

# ── Etapa 1: senha, pela API ─────────────────────────────────────────────────
Write-Host "--- Etapa 1: trocando as senhas ---"
$trocadas = @()
foreach ($cpf in $contas) {
    $corpo = @{ cpf = $cpf; palavraChave = 'lumina'; novaSenha = $nova } | ConvertTo-Json
    try {
        Invoke-RestMethod "$Site/api/auth/redefinir-senha" -Method Post -TimeoutSec 60 `
            -ContentType 'application/json; charset=utf-8' `
            -Body ([Text.Encoding]::UTF8.GetBytes($corpo)) | Out-Null
        Write-Host "  $cpf  senha trocada"
        $trocadas += $cpf
    } catch {
        $msg = $_.ErrorDetails.Message
        if (-not $msg) { $msg = $_.Exception.Message }
        # "Palavra-chave incorreta" indica conta ja protegida em execucao anterior
        Write-Host "  $cpf  nao alterada: $msg" -ForegroundColor Yellow
    }
}
$nova = $null; $conf = $null

if ($trocadas.Count -eq 0) {
    Write-Host ""
    Write-Host "Nenhuma senha foi trocada; a etapa 2 nao sera executada." -ForegroundColor Yellow
    exit 1
}

# ── Etapa 2: palavra-chave, no banco ─────────────────────────────────────────
Write-Host ""
Write-Host "--- Etapa 2: fechando a recuperacao de senha ---"
$senhaBanco = Ler-Segredo "Senha do $Usuario na Azure (nao aparece ao digitar)"

$b = New-Object System.Data.SqlClient.SqlConnectionStringBuilder
$b['Server']                 = "tcp:$Servidor,1433"
$b['Database']               = $Banco
$b['User ID']                = $Usuario
$b['Password']               = $senhaBanco
$b['Encrypt']                = $true
$b['TrustServerCertificate'] = $false
$b['Connect Timeout']        = 60
$senhaBanco = $null

$conexao = New-Object System.Data.SqlClient.SqlConnection $b.ConnectionString
try {
    $conexao.Open()
    $cmd = $conexao.CreateCommand()
    # Os CPFs vem da lista fixa deste script, nunca de entrada digitada
    $lista = ($trocadas | ForEach-Object { "'$_'" }) -join ','
    $cmd.CommandText = "UPDATE Usuarios SET PalavraChave = CONVERT(NVARCHAR(100), NEWID()) WHERE Cpf IN ($lista)"
    $n = $cmd.ExecuteNonQuery()
    Write-Host "  palavra-chave substituida em $n conta(s)" -ForegroundColor Green
} catch {
    Write-Host "  FALHA NO BANCO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  As senhas ja foram trocadas, mas a recuperacao continua aberta." -ForegroundColor Red
    Write-Host "  Confira a senha do banco e se o seu IP segue liberado no firewall, e rode de novo." -ForegroundColor Red
    exit 1
} finally {
    $conexao.Dispose()
}

Write-Host ""
Write-Host "Contas de demonstracao protegidas." -ForegroundColor Green
Write-Host "Guarde a nova senha e passe-a a equipe pessoalmente, nunca pelo repositorio."
