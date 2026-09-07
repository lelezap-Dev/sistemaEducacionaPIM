# ============================================================================
#  montar-docx.ps1 - gera o documento do PIM IV formatado conforme a ABNT
#
#  Le docs/PIM_IV_documento.md e produz docs/PIM_IV_documento.docx aplicando:
#    - A4, margens 3/2/3/2 cm
#    - Times New Roman 12, espacamento 1,5, justificado, recuo 1,5 cm
#    - Numeracao no canto superior direito a partir da Introducao
#    - Sumario e Lista de Figuras automaticos
#    - As treze figuras inseridas com legenda e fonte
# ============================================================================

$ErrorActionPreference = 'Stop'

$raiz    = "c:\Users\Leand\OneDrive\Área de Trabalho\sistemaEducacionaPIM"
$entrada = Join-Path $raiz "docs\PIM_IV_documento.md"
$figuras = Join-Path $raiz "docs\figuras"
$saida   = Join-Path $raiz "docs\PIM_IV_documento.docx"

# Mapeia cada marcador do texto ao arquivo de imagem correspondente.
$MAPA_FIGURAS = [ordered]@{
  'Tela de login da aplicação web'            = 'fig01-login-web.png'
  'Painel da Secretaria'                      = 'fig02-painel-secretaria.png'
  'Assistente virtual em uso'                 = 'fig03-chatbot-web.png'
  'Tela de login do aplicativo'               = 'fig04-login-app.jpg'
  'Painel inicial do aplicativo'              = 'fig05-painel-app.jpg'
  'Matérias e conteúdos'                      = 'fig06-materias-app.jpg'
  'Execução de uma atividade'                 = 'fig07-atividade-app.jpg'
  'Recursos de acessibilidade no aplicativo'  = 'fig08-acessibilidade.jpg'
  'Diagrama Entidade-Relacionamento'          = 'fig09-mer.png'
  'Modelo lógico de dados'                    = 'fig10-modelo-logico.png'
  'Estrutura física das tabelas'              = 'fig11-estrutura-fisica.png'
  'Contêineres em execução'                   = 'fig12-conteineres.png'
  'Quadro Kanban no Trello'                   = 'fig13-kanban.png'
}

# --- Constantes do Word -----------------------------------------------------
$wdAlignLeft = 0; $wdAlignCenter = 1; $wdAlignRight = 2; $wdAlignJustify = 3
$wdLineSpace1pt5 = 1; $wdLineSpaceSingle = 0
$wdStyleNormal = -1; $wdStyleHeading1 = -2; $wdStyleHeading2 = -3; $wdStyleHeading3 = -4
$wdStyleCaption = -34
$wdSectionBreakNextPage = 2; $wdPageBreak = 7
$wdPaperA4 = 7
$wdHeaderFooterPrimary = 1
$wdFieldPage = 33
$wdStory = 6

# ============================================================================
#  Leitura e limpeza do markdown
# ============================================================================
$linhas = [System.IO.File]::ReadAllLines($entrada, [System.Text.Encoding]::UTF8)

# Descarta o bloco de instrucoes do topo, que nao faz parte do trabalho.
$inicio = 0
for ($i = 0; $i -lt $linhas.Count; $i++) {
  if ($linhas[$i] -match '^# UNIVERSIDADE PAULISTA') { $inicio = $i; break }
}
$linhas = $linhas[$inicio..($linhas.Count - 1)]

# ============================================================================
#  Abertura do Word
# ============================================================================
Write-Host "Abrindo o Word..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $word.Documents.Add()
$sel = $word.Selection

# --- Configuracao de pagina -------------------------------------------------
$ps = $doc.PageSetup
$ps.PaperSize    = $wdPaperA4
$ps.TopMargin    = $word.CentimetersToPoints(3)
$ps.LeftMargin   = $word.CentimetersToPoints(3)
$ps.BottomMargin = $word.CentimetersToPoints(2)
$ps.RightMargin  = $word.CentimetersToPoints(2)

# --- Estilo padrao ----------------------------------------------------------
$normal = $doc.Styles.Item($wdStyleNormal)
$normal.Font.Name = "Times New Roman"
$normal.Font.Size = 12
$normal.ParagraphFormat.LineSpacingRule = $wdLineSpace1pt5
$normal.ParagraphFormat.SpaceAfter  = 0
$normal.ParagraphFormat.SpaceBefore = 0
$normal.ParagraphFormat.Alignment   = $wdAlignJustify

foreach ($idEstilo in @($wdStyleHeading1, $wdStyleHeading2, $wdStyleHeading3)) {
  $h = $doc.Styles.Item($idEstilo)
  $h.Font.Name = "Times New Roman"
  $h.Font.Color = 0            # preto; a ABNT nao admite titulo colorido
  $h.Font.Bold = $true
  $h.ParagraphFormat.LineSpacingRule = $wdLineSpace1pt5
  $h.ParagraphFormat.Alignment = $wdAlignLeft
  $h.ParagraphFormat.FirstLineIndent = 0
  $h.ParagraphFormat.SpaceBefore = 6
  $h.ParagraphFormat.SpaceAfter  = 6
}
$doc.Styles.Item($wdStyleHeading1).Font.Size = 12
$doc.Styles.Item($wdStyleHeading2).Font.Size = 12
$doc.Styles.Item($wdStyleHeading3).Font.Size = 12
$doc.Styles.Item($wdStyleHeading3).Font.Bold = $false
$doc.Styles.Item($wdStyleHeading3).Font.Italic = $true

$cap = $doc.Styles.Item($wdStyleCaption)
$cap.Font.Name = "Times New Roman"
$cap.Font.Size = 10
$cap.Font.Bold = $false
$cap.Font.Italic = $false
$cap.Font.Color = 0
$cap.ParagraphFormat.Alignment = $wdAlignCenter
$cap.ParagraphFormat.LineSpacingRule = $wdLineSpaceSingle
$cap.ParagraphFormat.FirstLineIndent = 0

# ============================================================================
#  Funcoes auxiliares
# ============================================================================

function Reset-Paragrafo {
  param([int]$Alinhamento = 3, [double]$RecuoPrimeiraLinha = 1.5, [double]$RecuoEsquerdo = 0)
  $sel.Style = $doc.Styles.Item($wdStyleNormal)
  $sel.Font.Name = "Times New Roman"
  $sel.Font.Size = 12
  $sel.Font.Bold = $false
  $sel.Font.Italic = $false
  $pf = $sel.ParagraphFormat
  $pf.Alignment = $Alinhamento
  $pf.LineSpacingRule = $wdLineSpace1pt5
  $pf.FirstLineIndent = $word.CentimetersToPoints($RecuoPrimeiraLinha)
  $pf.LeftIndent = $word.CentimetersToPoints($RecuoEsquerdo)
  $pf.SpaceAfter = 0
  $pf.SpaceBefore = 0
}

# Escreve texto interpretando **negrito**, *italico* e `codigo`.
function Escrever-ComFormatacao {
  param([string]$Texto)
  $partes = [regex]::Split($Texto, '(\*\*[^*]+\*\*|`[^`]+`|(?<![\*\w])\*[^*]+\*(?![\*\w]))')
  foreach ($parte in $partes) {
    if ([string]::IsNullOrEmpty($parte)) { continue }
    if ($parte -match '^\*\*(.+)\*\*$') {
      $sel.Font.Bold = $true;  $sel.TypeText($Matches[1]); $sel.Font.Bold = $false
    }
    elseif ($parte -match '^`(.+)`$') {
      $nomeAnterior = $sel.Font.Name
      $sel.Font.Name = "Courier New"; $sel.Font.Size = 11
      $sel.TypeText($Matches[1])
      $sel.Font.Name = $nomeAnterior; $sel.Font.Size = 12
    }
    elseif ($parte -match '^\*(.+)\*$') {
      $sel.Font.Italic = $true; $sel.TypeText($Matches[1]); $sel.Font.Italic = $false
    }
    else {
      $sel.TypeText(($parte -replace '\\', ''))
    }
  }
}

function Limpar-Inline {
  param([string]$Texto)
  $t = $Texto -replace '\*\*', '' -replace '`', ''
  return $t.Trim()
}

$contadorFigura = 0

# Insere uma imagem no ponto atual, limitada as dimensoes informadas.
function Inserir-Imagem {
  param([string]$Caminho, [double]$LarguraCm, [double]$AlturaCm)

  $forma = $sel.InlineShapes.AddPicture($Caminho, $false, $true)
  $forma.LockAspectRatio = -1                      # msoTrue
  $larguraMax = [double]$word.CentimetersToPoints($LarguraCm)
  $alturaMax  = [double]$word.CentimetersToPoints($AlturaCm)
  $l = [double]$forma.Width
  $a = [double]$forma.Height
  $fator = 1.0
  if ($l -gt $larguraMax) { $fator = $larguraMax / $l }
  if (($a * $fator) -gt $alturaMax) { $fator = $alturaMax / $a }
  if ($fator -lt 1.0) { $forma.Width = [single]($l * $fator) }
}

function Escrever-Legenda {
  param([string]$Texto)
  $sel.Style = $doc.Styles.Item($wdStyleCaption)
  $sel.ParagraphFormat.Alignment = $wdAlignCenter
  $sel.ParagraphFormat.FirstLineIndent = 0
  $sel.ParagraphFormat.LeftIndent = 0
  $sel.TypeText($Texto)
  $sel.TypeParagraph()
}

# Recebe um ou mais titulos. Havendo mais de um, as imagens sao dispostas em
# grade de duas colunas sob uma unica legenda, o que reduz substancialmente o
# espaco ocupado por capturas de tela em orientacao retrato.
function Inserir-Figura {
  param([string[]]$Titulos)

  $caminhos = @()
  $rotulos  = @()
  foreach ($t in $Titulos) {
    $arquivo = $null
    foreach ($chave in $MAPA_FIGURAS.Keys) {
      if ($t -like "*$chave*") { $arquivo = $MAPA_FIGURAS[$chave]; break }
    }
    if (-not $arquivo) { Write-Host "  ! sem imagem para: $t"; continue }
    $c = Join-Path $figuras $arquivo
    if (-not (Test-Path $c)) { Write-Host "  ! arquivo ausente: $arquivo"; continue }
    $caminhos += $c
    $rotulos  += $t
  }
  if ($caminhos.Count -eq 0) { return }

  $script:contadorFigura++

  if ($caminhos.Count -eq 1) {
    Escrever-Legenda "Figura $script:contadorFigura - $($rotulos[0])"
    Reset-Paragrafo -Alinhamento $wdAlignCenter -RecuoPrimeiraLinha 0
    # Altura generosa: uma figura ilegivel nao cumpre funcao alguma. Os
    # diagramas em orientacao retrato precisam de altura para que o texto
    # interno permaneca legivel na impressao.
    Inserir-Imagem -Caminho $caminhos[0] -LarguraCm 15.0 -AlturaCm 15.0
    $sel.TypeParagraph()
  }
  else {
    Escrever-Legenda ("Figura $script:contadorFigura - " + ($rotulos -join "; "))

    $colunas = 2
    $linhasGrade = [math]::Ceiling($caminhos.Count / $colunas)
    Reset-Paragrafo -Alinhamento $wdAlignCenter -RecuoPrimeiraLinha 0
    $grade = $doc.Tables.Add($sel.Range, $linhasGrade, $colunas)
    $grade.Borders.InsideLineStyle  = 0
    $grade.Borders.OutsideLineStyle = 0
    $grade.Range.ParagraphFormat.Alignment = $wdAlignCenter
    $grade.Range.ParagraphFormat.FirstLineIndent = 0
    $grade.Range.ParagraphFormat.SpaceAfter = 0
    $grade.Range.ParagraphFormat.LineSpacingRule = $wdLineSpaceSingle

    for ($k = 0; $k -lt $caminhos.Count; $k++) {
      $linha  = [math]::Floor($k / $colunas) + 1
      $coluna = ($k % $colunas) + 1
      $celula = $grade.Cell($linha, $coluna)
      $celula.Range.Select() | Out-Null
      Inserir-Imagem -Caminho $caminhos[$k] -LarguraCm 6.5 -AlturaCm 11.0
    }

    $sel.EndKey($wdStory) | Out-Null
    $sel.TypeParagraph()
  }

  Escrever-Legenda "Fonte: Elaborado pelos Autores (2026)"
  Reset-Paragrafo
}

function Inserir-Tabela {
  param([array]$Linhas)

  $dados = @()
  foreach ($l in $Linhas) {
    if ($l -match '^\s*\|[\s\-:|]+\|\s*$') { continue }   # linha separadora
    $celulas = $l.Trim().Trim('|') -split '\|'
    $dados += ,@($celulas | ForEach-Object { Limpar-Inline $_ })
  }
  if ($dados.Count -eq 0) { return }

  $nLinhas = $dados.Count
  $nCols   = ($dados | ForEach-Object { $_.Count } | Measure-Object -Maximum).Maximum

  $tabela = $doc.Tables.Add($sel.Range, $nLinhas, $nCols)
  $tabela.Borders.InsideLineStyle  = 1
  $tabela.Borders.OutsideLineStyle = 1
  $tabela.Range.Font.Name = "Times New Roman"
  $tabela.Range.Font.Size = 9
  $tabela.Range.ParagraphFormat.LineSpacingRule = $wdLineSpaceSingle
  $tabela.Range.ParagraphFormat.FirstLineIndent = 0
  $tabela.Range.ParagraphFormat.Alignment = $wdAlignLeft
  $tabela.Range.ParagraphFormat.SpaceAfter = 0

  for ($r = 0; $r -lt $nLinhas; $r++) {
    for ($c = 0; $c -lt $nCols; $c++) {
      $valor = ""
      if ($c -lt $dados[$r].Count) { $valor = $dados[$r][$c] }
      $tabela.Cell($r + 1, $c + 1).Range.Text = $valor
    }
  }
  $tabela.Rows.Item(1).Range.Font.Bold = $true
  $tabela.Rows.Item(1).HeadingFormat = $true

  $sel.EndKey($wdStory) | Out-Null
  $sel.TypeParagraph()
  Reset-Paragrafo
}

# ============================================================================
#  Percurso do documento
# ============================================================================
# Titulos que nao entram no sumario: o manual determina que resumos, listas e
# apendices dele nao constem.
$semNumeracao = @('UNIVERSIDADE PAULISTA', 'FOLHA DE ROSTO', 'RESUMO',
                  'ABSTRACT', 'SUMÁRIO', 'APÊNDICE')
$posSumario = $null
$secaoAberta = $false
$i = 0

Write-Host "Montando o documento..."

while ($i -lt $linhas.Count) {
  $linha = $linhas[$i]
  $t = $linha.Trim()

  # --- linha em branco ---
  if ($t -eq '') { $i++; continue }

  # --- quebra de pagina antes de titulo de primeiro nivel ---
  if ($t -eq '---') {
    $j = $i + 1
    while ($j -lt $linhas.Count -and $linhas[$j].Trim() -eq '') { $j++ }
    if ($j -lt $linhas.Count -and $linhas[$j] -match '^# ') {
      $titulo = ($linhas[$j] -replace '^#\s*', '').Trim()
      $ehPreTextual = $false
      foreach ($p in $semNumeracao) { if ($titulo -like "$p*") { $ehPreTextual = $true } }

      if (-not $ehPreTextual -and -not $secaoAberta) {
        # Primeira secao textual: quebra de secao para iniciar a numeracao
        $sel.InsertBreak($wdSectionBreakNextPage)
        $secaoAberta = $true
      } else {
        $sel.InsertBreak($wdPageBreak)
      }
    }
    $i++; continue
  }

  # --- marcador de figura (agrupa marcadores consecutivos) ---
  if ($t -match '^`?\[INSERIR FIGURA\s*[—-]\s*(.+?)\]`?$') {
    $titulosGrupo = @($Matches[1].Trim())
    $j = $i + 1
    while ($j -lt $linhas.Count) {
      $prox = $linhas[$j].Trim()
      if ($prox -eq '') { $j++; continue }
      if ($prox -match '^`?\[INSERIR FIGURA\s*[—-]\s*(.+?)\]`?$') {
        $titulosGrupo += $Matches[1].Trim(); $j++; continue
      }
      break
    }
    Inserir-Figura -Titulos $titulosGrupo
    $i = $j; continue
  }

  # --- tabela ---
  if ($t.StartsWith('|')) {
    $bloco = @()
    while ($i -lt $linhas.Count -and $linhas[$i].Trim().StartsWith('|')) {
      $bloco += $linhas[$i]; $i++
    }
    Inserir-Tabela -Linhas $bloco
    continue
  }

  # --- bloco de codigo ---
  if ($t.StartsWith('```')) {
    $i++
    Reset-Paragrafo -Alinhamento $wdAlignLeft -RecuoPrimeiraLinha 0 -RecuoEsquerdo 1
    $sel.Font.Name = "Courier New"; $sel.Font.Size = 10
    $sel.ParagraphFormat.LineSpacingRule = $wdLineSpaceSingle
    while ($i -lt $linhas.Count -and -not $linhas[$i].Trim().StartsWith('```')) {
      $sel.TypeText($linhas[$i]); $sel.TypeParagraph(); $i++
    }
    $i++
    Reset-Paragrafo
    continue
  }

  # --- titulos (qualquer nivel; sem isto, um "###" travaria o percurso) ---
  if ($t -match '^#{1,6}\s') {
    $nivel  = ($t -replace '^(#+).*', '$1').Length
    $titulo = Limpar-Inline ($t -replace '^#+\s*', '')

    $ehPreTextual = $false
    foreach ($p in $semNumeracao) { if ($titulo -like "$p*") { $ehPreTextual = $true } }

    if ($ehPreTextual) {
      # Elementos pre-textuais nao entram no sumario: sem estilo de titulo
      Reset-Paragrafo -Alinhamento $wdAlignCenter -RecuoPrimeiraLinha 0
      $sel.Font.Bold = $true
      if ($titulo -eq 'SUMÁRIO') {
        $sel.TypeText("SUMÁRIO"); $sel.TypeParagraph()
        Reset-Paragrafo -Alinhamento $wdAlignLeft -RecuoPrimeiraLinha 0
        $posSumario = $sel.Range.Duplicate
        $sel.TypeParagraph()
        # O conteudo manual do sumario e descartado; o Word gera o proprio
        $i++
        while ($i -lt $linhas.Count -and $linhas[$i].Trim() -ne '---') { $i++ }
        continue
      }
      if ($titulo -eq 'FOLHA DE ROSTO') { $i++; continue }   # rotulo auxiliar
      $sel.TypeText($titulo); $sel.TypeParagraph()
      Reset-Paragrafo
      $i++; continue
    }

    if     ($nivel -eq 1) { $sel.Style = $doc.Styles.Item($wdStyleHeading1) }
    elseif ($nivel -eq 2) { $sel.Style = $doc.Styles.Item($wdStyleHeading2) }
    else                  { $sel.Style = $doc.Styles.Item($wdStyleHeading3) }
    $sel.ParagraphFormat.FirstLineIndent = 0
    $sel.ParagraphFormat.LeftIndent = 0
    $sel.TypeText($titulo)
    $sel.TypeParagraph()
    Reset-Paragrafo
    if ($nivel -eq 1) { Write-Host ("  [{0,5}/{1}] {2}" -f $i, $linhas.Count, $titulo) }
    $i++; continue
  }

  # --- citacao / natureza do trabalho ---
  if ($t.StartsWith('>')) {
    $texto = ($t -replace '^>\s?', '')
    if ($texto.Trim() -ne '') {
      Reset-Paragrafo -Alinhamento $wdAlignJustify -RecuoPrimeiraLinha 0 -RecuoEsquerdo 8
      $sel.Font.Size = 10
      Escrever-ComFormatacao -Texto $texto
      $sel.TypeParagraph()
      Reset-Paragrafo
    }
    $i++; continue
  }

  # --- listas ---
  if ($t -match '^[-*]\s+(.*)$') {
    Reset-Paragrafo -Alinhamento $wdAlignJustify -RecuoPrimeiraLinha 0 -RecuoEsquerdo 1.5
    Escrever-ComFormatacao -Texto ("• " + $Matches[1])
    $sel.TypeParagraph()
    Reset-Paragrafo
    $i++; continue
  }
  if ($t -match '^\d+\.\s+') {
    Reset-Paragrafo -Alinhamento $wdAlignJustify -RecuoPrimeiraLinha 0 -RecuoEsquerdo 1.5
    Escrever-ComFormatacao -Texto $t
    $sel.TypeParagraph()
    Reset-Paragrafo
    $i++; continue
  }

  # --- marcacoes soltas de layout ---
  if ($t -match '^(<br\s*/?>)+$') {
    Reset-Paragrafo -RecuoPrimeiraLinha 0
    $sel.TypeParagraph()
    $i++; continue
  }

  # --- paragrafo comum: junta as linhas ate a proxima quebra ---
  $buffer = @()
  while ($i -lt $linhas.Count) {
    $atual = $linhas[$i].Trim()
    if ($atual -eq '' -or $atual -eq '---' -or $atual.StartsWith('|') -or
        $atual.StartsWith('#') -or $atual.StartsWith('>') -or
        $atual.StartsWith('```') -or $atual -match '^[-*]\s' -or
        $atual -match '^\d+\.\s' -or $atual -match '^`?\[INSERIR FIGURA') { break }
    $buffer += $atual
    $i++
  }
  if ($buffer.Count -gt 0) {
    Reset-Paragrafo
    Escrever-ComFormatacao -Texto ($buffer -join ' ')
    $sel.TypeParagraph()
  }
  else {
    # Trava de seguranca: nenhuma linha consumida neste giro significa que
    # a linha atual nao foi reconhecida por nenhum ramo. Emite o texto como
    # paragrafo comum e avanca, em vez de repetir o giro indefinidamente.
    Write-Host "  ? linha nao reconhecida (linha $i): $t"
    Reset-Paragrafo
    Escrever-ComFormatacao -Texto $t
    $sel.TypeParagraph()
    $i++
  }
}

# ============================================================================
#  Numeracao de paginas a partir da Introducao
# ============================================================================
Write-Host "Configurando a numeracao..."
if ($doc.Sections.Count -ge 2) {
  $cab1 = $doc.Sections.Item(1).Headers.Item($wdHeaderFooterPrimary)
  $cab1.LinkToPrevious = $false

  for ($s = 2; $s -le $doc.Sections.Count; $s++) {
    $cab = $doc.Sections.Item($s).Headers.Item($wdHeaderFooterPrimary)
    $cab.LinkToPrevious = $false
    if ($s -eq 2) {
      $cab.Range.Text = ""
      $cab.Range.ParagraphFormat.Alignment = $wdAlignRight
      $cab.Range.Font.Name = "Times New Roman"
      $cab.Range.Font.Size = 10
      $doc.Fields.Add($cab.Range, $wdFieldPage) | Out-Null
    } else {
      $cab.LinkToPrevious = $true
    }
  }
  # A numeracao continua a contagem iniciada na folha de rosto; apenas
  # passa a ser exibida a partir da Introducao, como exige a ABNT.
  $doc.Sections.Item(2).Headers.Item($wdHeaderFooterPrimary).PageNumbers.RestartNumberingAtSection = $false
}

# ============================================================================
#  Sumario e Lista de Figuras automaticos
# ============================================================================
Write-Host "Gerando sumario..."
if ($posSumario -ne $null) {
  $toc = $doc.TablesOfContents.Add($posSumario, $true, 1, 2, $false, "", $true, $true)
  $toc.Range.Font.Name = "Times New Roman"
  $toc.Range.Font.Size = 12

  try {
    $depois = $toc.Range.Duplicate
    $depois.Collapse(0) | Out-Null
    $depois.InsertParagraphAfter()
    $depois.InsertParagraphAfter()
    $r = $doc.Range($depois.End - 1, $depois.End - 1)
    $r.Text = "LISTA DE FIGURAS"
    $r.ParagraphFormat.Alignment = $wdAlignCenter
    $r.Font.Bold = $true
    $r.Font.Size = 12
    $rf = $doc.Range($r.End, $r.End)
    $rf.InsertParagraphAfter()
    $tof = $doc.TablesOfFigures.Add($doc.Range($r.End + 1, $r.End + 1), "Figura", $true, $false)
    $tof.Range.Font.Name = "Times New Roman"
    $tof.Range.Font.Size = 12
    Write-Host "  lista de figuras gerada"
  } catch {
    Write-Host "  lista de figuras nao gerada: $($_.Exception.Message)"
  }
}

$doc.Fields.Update() | Out-Null
foreach ($t in $doc.TablesOfContents) { $t.Update() }
foreach ($t in $doc.TablesOfFigures) { $t.Update() }

# ============================================================================
#  Gravacao
# ============================================================================
if (Test-Path $saida) { Remove-Item $saida -Force }
$caminhoSaida = [string]$saida
try {
  $doc.SaveAs2($caminhoSaida, 16)          # 16 = wdFormatDocumentDefault (.docx)
} catch {
  $doc.SaveAs($caminhoSaida, 16)           # versoes anteriores do Word
}

$paginas = $doc.ComputeStatistics(2)   # wdStatisticPages
$palavras = $doc.ComputeStatistics(0)  # wdStatisticWords

Write-Host ""
Write-Host "==================================================="
Write-Host " Arquivo gerado: $saida"
Write-Host " Paginas totais : $paginas"
Write-Host " Palavras       : $palavras"
Write-Host " Figuras        : $contadorFigura"
Write-Host "==================================================="

$doc.Close([ref]$false)
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($sel) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
