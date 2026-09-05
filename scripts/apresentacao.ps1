# ============================================================================
#  apresentacao.ps1 - Prepara o ambiente para demonstracao do PIM IV
#
#  O endereco IP da maquina muda a cada rede (hotspot do celular, Wi-Fi da
#  faculdade, casa). Este script detecta o endereco atual, atualiza a
#  configuracao do aplicativo e sobe a API, evitando ajustes manuais.
#
#  Como usar:
#      powershell -ExecutionPolicy Bypass -File .\scripts\apresentacao.ps1
#
#  Para apenas conferir a rede, sem subir nada:
#      powershell -ExecutionPolicy Bypass -File .\scripts\apresentacao.ps1 -Verificar
# ============================================================================

param(
    [switch]$Verificar,        # so diagnostica, nao inicia servicos
    [int]$Porta = 5199
)

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot

function Titulo($texto) {
    Write-Host ""
    Write-Host ("=" * 62) -ForegroundColor DarkCyan
    Write-Host "  $texto" -ForegroundColor Cyan
    Write-Host ("=" * 62) -ForegroundColor DarkCyan
}

# ---------------------------------------------------------------------------
#  1. Identifica a rede e o endereco IP
# ---------------------------------------------------------------------------
Titulo "1. Rede"

$ssid = "(nao identificada)"
try {
    $saida = netsh wlan show interfaces 2>$null
    $linha = $saida | Select-String -Pattern '^\s*SSID\s*:' | Select-Object -First 1
    if ($linha) { $ssid = ($linha.Line -split ':', 2)[1].Trim() }
} catch { }

# Prefere a interface Wi-Fi; cai para qualquer outra se nao houver
$enderecos = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notlike '127.*' -and
        $_.IPAddress -notlike '169.254.*' -and
        $_.PrefixOrigin -ne 'WellKnown'
    }

$wifi = $enderecos | Where-Object { $_.InterfaceAlias -match 'Wi-Fi|Wireless' } | Select-Object -First 1
$escolhido = if ($wifi) { $wifi } else { $enderecos | Select-Object -First 1 }

if (-not $escolhido) {
    Write-Host "ERRO: nenhum endereco de rede encontrado." -ForegroundColor Red
    Write-Host "Conecte-se a uma rede Wi-Fi e rode o script novamente."
    exit 1
}

$ip = $escolhido.IPAddress

Write-Host "  Rede Wi-Fi ...: $ssid"
Write-Host "  Interface ....: $($escolhido.InterfaceAlias)"
Write-Host "  Endereco IP ..: $ip" -ForegroundColor Green

# Hotspot de iPhone costuma usar a faixa 172.20.10.x
if ($ip -like '172.20.10.*') {
    Write-Host "  (padrao de hotspot de iPhone detectado)" -ForegroundColor DarkGray
}

# ---------------------------------------------------------------------------
#  2. Perfil de rede e firewall
# ---------------------------------------------------------------------------
Titulo "2. Firewall"

$perfil = Get-NetConnectionProfile |
    Where-Object { $_.InterfaceAlias -eq $escolhido.InterfaceAlias } |
    Select-Object -First 1

if ($perfil) { Write-Host "  Perfil da rede: $($perfil.NetworkCategory)" }

$regras = Get-NetFirewallRule -DisplayName "Lumina PIM*" -ErrorAction SilentlyContinue |
    Where-Object { $_.Enabled -eq 'True' }

if ($regras -and $regras.Count -ge 2) {
    Write-Host "  Regras liberadas: OK ($($regras.Count) ativas)" -ForegroundColor Green
} else {
    Write-Host "  ATENCAO: regras de firewall ausentes." -ForegroundColor Yellow
    Write-Host "  Rode como administrador:" -ForegroundColor Yellow
    Write-Host "     .\scripts\liberar-firewall-dev.ps1" -ForegroundColor Yellow
}

# ---------------------------------------------------------------------------
#  3. Atualiza o endereco no aplicativo
# ---------------------------------------------------------------------------
Titulo "3. Configuracao do aplicativo"

$configPath = Join-Path $raiz "mobile\src\config.js"

if (Test-Path $configPath) {
    $texto = [System.IO.File]::ReadAllText($configPath, [System.Text.Encoding]::UTF8)
    $atual = if ($texto -match "const IP_LOCAL = '([\d\.]+)'") { $Matches[1] } else { "?" }

    if ($atual -eq $ip) {
        Write-Host "  config.js ja aponta para $ip" -ForegroundColor Green
    } else {
        $novo = $texto -replace "const IP_LOCAL = '[\d\.]+'", "const IP_LOCAL = '$ip'"
        $utf8 = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($configPath, $novo, $utf8)
        Write-Host "  config.js atualizado: $atual -> $ip" -ForegroundColor Yellow
        Write-Host "  (reinicie o Expo com --clear para o app pegar o novo endereco)" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  config.js nao encontrado" -ForegroundColor Red
}

# ---------------------------------------------------------------------------
#  4. Porta livre?
# ---------------------------------------------------------------------------
Titulo "4. Porta $Porta"

$ocupada = Get-NetTCPConnection -LocalPort $Porta -State Listen -ErrorAction SilentlyContinue
if ($ocupada) {
    $pid_ = $ocupada[0].OwningProcess
    $proc = Get-Process -Id $pid_ -ErrorAction SilentlyContinue
    Write-Host "  Em uso pelo processo $pid_ ($($proc.ProcessName))" -ForegroundColor Yellow
    if (-not $Verificar) {
        Write-Host "  Encerrando para liberar..." -ForegroundColor Yellow
        Stop-Process -Id $pid_ -Force
        Start-Sleep -Milliseconds 1500
        Write-Host "  Porta liberada." -ForegroundColor Green
    }
} else {
    Write-Host "  Livre" -ForegroundColor Green
}

# ---------------------------------------------------------------------------
#  5. Enderecos da demonstracao
# ---------------------------------------------------------------------------
Titulo "5. Enderecos para a demonstracao"

Write-Host ""
Write-Host "  NO NOTEBOOK (navegador):" -ForegroundColor White
Write-Host "     http://localhost:$Porta" -ForegroundColor Green
Write-Host ""
Write-Host "  NO CELULAR (navegador ou Expo Go):" -ForegroundColor White
Write-Host "     http://${ip}:$Porta" -ForegroundColor Green
Write-Host "     exp://${ip}:8081" -ForegroundColor Green
Write-Host ""
Write-Host "  CREDENCIAIS:" -ForegroundColor White
Write-Host "     Secretaria .. CPF 00000000000  senha Lumina@2026!Pim"
Write-Host "     Professor ... CPF 22222222222  senha Lumina@2026"
Write-Host "     Aluno ....... CPF 33333333333  senha Lumina@2026"
Write-Host ""

if ($Verificar) {
    Write-Host "Modo verificacao: nada foi iniciado." -ForegroundColor DarkGray
    Write-Host ""
    exit 0
}

# ---------------------------------------------------------------------------
#  6. Sobe a API
# ---------------------------------------------------------------------------
Titulo "6. Iniciando a API"

Write-Host "  Aguarde a mensagem 'Now listening on'." -ForegroundColor DarkGray
Write-Host "  Em OUTRO terminal, rode o aplicativo:" -ForegroundColor DarkGray
Write-Host "     cd mobile" -ForegroundColor DarkGray
Write-Host "     npx expo start --lan --clear" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Para encerrar: Ctrl+C" -ForegroundColor DarkGray
Write-Host ""

$env:ASPNETCORE_ENVIRONMENT = "Development"
Set-Location $raiz
dotnet run --project src\SistemaEducacional.API\SistemaEducacional.API.csproj --urls "http://0.0.0.0:$Porta"
