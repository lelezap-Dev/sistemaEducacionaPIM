# ============================================================================
#  liberar-firewall-dev.ps1
#
#  Libera as portas usadas no desenvolvimento do PIM IV para que o
#  aparelho celular alcance a máquina de desenvolvimento na rede local.
#
#    5199 -> API ASP.NET Core (Sistema Lumina)
#    8081 -> Metro Bundler do Expo (entrega o JavaScript ao aplicativo)
#
#  As regras são restritas a "LocalSubnet": só computadores da MESMA rede
#  local conseguem conectar. Nada é exposto para a internet.
#
#  COMO EXECUTAR:
#    1. Menu Iniciar -> digite "PowerShell"
#    2. Clique com o botão direito -> "Executar como administrador"
#    3. Rode:
#         cd "$HOME\OneDrive\Área de Trabalho\sistemaEducacionaPIM"
#         powershell -ExecutionPolicy Bypass -File .\scripts\liberar-firewall-dev.ps1
#
#  PARA REMOVER AS REGRAS DEPOIS DA ENTREGA DO PIM:
#    Get-NetFirewallRule -DisplayName "Lumina PIM*" | Remove-NetFirewallRule
# ============================================================================

$ErrorActionPreference = 'Stop'

# Confere elevação antes de tentar qualquer coisa
$ehAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
           ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $ehAdmin) {
    Write-Host "ERRO: este script precisa ser executado como Administrador." -ForegroundColor Red
    Write-Host "Feche esta janela, abra o PowerShell com 'Executar como administrador' e tente de novo."
    exit 1
}

$portas = @(
    @{ Nome = 'Lumina PIM - API (5199)';  Porta = 5199 },
    @{ Nome = 'Lumina PIM - Expo (8081)'; Porta = 8081 }
)

foreach ($p in $portas) {
    $existente = Get-NetFirewallRule -DisplayName $p.Nome -ErrorAction SilentlyContinue
    if ($existente) {
        Write-Host "Regra ja existe, recriando: $($p.Nome)" -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName $p.Nome
    }

    New-NetFirewallRule `
        -DisplayName  $p.Nome `
        -Description  'Desenvolvimento do PIM IV - acesso restrito a rede local' `
        -Direction    Inbound `
        -Action       Allow `
        -Protocol     TCP `
        -LocalPort    $p.Porta `
        -RemoteAddress LocalSubnet `
        -Profile      Any | Out-Null

    Write-Host "OK  Liberada porta $($p.Porta) para a rede local" -ForegroundColor Green
}

Write-Host ""
Write-Host "Concluido. Regras criadas:" -ForegroundColor Cyan
Get-NetFirewallRule -DisplayName "Lumina PIM*" |
    Select-Object DisplayName, Enabled, Direction, Action |
    Format-Table -AutoSize

Write-Host ""
Write-Host "IP desta maquina na rede local:" -ForegroundColor Cyan
Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
    Select-Object IPAddress, InterfaceAlias |
    Format-Table -AutoSize

Write-Host "Conecte o iPhone na MESMA rede Wi-Fi que aparece acima." -ForegroundColor Yellow
