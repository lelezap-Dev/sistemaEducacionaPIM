# ============================================================================
#  aplicar-banco-azure.ps1 — cria as tabelas e os dados no Azure SQL
#
#  Executa os scripts 01 a 04 da pasta database no banco da nuvem.
#  A senha é pedida no terminal, digitada sem eco, e repassada ao
#  sqlcmd pela variável SQLCMDPASSWORD — nunca aparece na tela, no
#  histórico do terminal nem na lista de processos do sistema.
#
#  O sqlcmd vem da imagem oficial do SQL Server, a mesma usada pelo
#  docker compose, para não exigir nenhuma instalação adicional.
#
#  Uso (na raiz do projeto, com o Docker Desktop aberto):
#     powershell -ExecutionPolicy Bypass -File scripts\aplicar-banco-azure.ps1
#
#  ATENÇÃO: o script 01 recria as tabelas do zero. Rodar de novo
#  apaga os dados que estiverem no banco da nuvem.
# ============================================================================

param(
    [string]$Servidor = 'lumina-sql-leandro.database.windows.net',
    [string]$Banco    = 'SistemaEducacional',
    [string]$Usuario  = 'lumina_admin'
)

$ErrorActionPreference = 'Stop'
$raiz    = Split-Path -Parent $PSScriptRoot
$imagem  = 'mcr.microsoft.com/mssql/server:2022-latest'
$scripts = '01_schema.sql', '02_procedures_triggers.sql', '03_carga_inicial.sql', '04_cenario_farol.sql'

Write-Host ""
Write-Host "Servidor: $Servidor"
Write-Host "Banco:    $Banco"
Write-Host "Usuário:  $Usuario"
Write-Host ""

$segura = Read-Host "Senha do administrador do banco (não aparece ao digitar)" -AsSecureString
$ponteiro = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($segura)
try {
    $env:SQLCMDPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ponteiro)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ponteiro)
}

function Invoke-Sqlcmd-Azure([string[]]$argumentos) {
    # -e SQLCMDPASSWORD sem valor: o Docker copia a variável do processo atual.
    # Out-Host manda a saída para a tela; sem ele, o texto impresso viraria
    # parte do valor de retorno e a checagem do código de saída falharia.
    docker run --rm -e SQLCMDPASSWORD -v "${raiz}\database:/scripts:ro" $imagem `
        /opt/mssql-tools18/bin/sqlcmd -S "tcp:$Servidor,1433" -d $Banco -U $Usuario `
        -N -l 60 -b -f 65001 @argumentos | Out-Host
    return $LASTEXITCODE
}

try {
    # Conexão de teste antes de mexer em qualquer coisa. O -l 60 dá tempo
    # ao banco caso ele esteja saindo de uma pausa.
    Write-Host "--- Testando a conexão ---"
    if ((Invoke-Sqlcmd-Azure @('-Q', 'SELECT 1')) -ne 0) {
        Write-Host ""
        Write-Host "Falha ao conectar. Confira a senha e se o seu IP está liberado no firewall do servidor." -ForegroundColor Red
        exit 1
    }

    foreach ($s in $scripts) {
        Write-Host "--- Aplicando $s ---"
        if ((Invoke-Sqlcmd-Azure @('-i', "/scripts/$s")) -ne 0) {
            Write-Host ""
            Write-Host "Falha em $s. Os scripts seguintes não foram executados." -ForegroundColor Red
            exit 1
        }
    }

    Write-Host "--- Conferência ---"
    $null = Invoke-Sqlcmd-Azure @('-W', '-Q', @"
SET NOCOUNT ON;
SELECT
  (SELECT COUNT(*) FROM sys.tables)                          AS Tabelas,
  (SELECT COUNT(*) FROM sys.procedures)                      AS Procedures,
  (SELECT COUNT(*) FROM sys.triggers)                        AS Triggers,
  (SELECT COUNT(*) FROM sys.views)                           AS Views,
  (SELECT COUNT(*) FROM Usuarios WHERE Perfil = 'Aluno')     AS Alunos,
  (SELECT COUNT(*) FROM Atividades)                          AS Atividades;
"@)

    Write-Host ""
    Write-Host "Banco da nuvem pronto." -ForegroundColor Green
}
finally {
    # A senha não sobrevive ao fim do script
    Remove-Item Env:SQLCMDPASSWORD -ErrorAction SilentlyContinue
}
