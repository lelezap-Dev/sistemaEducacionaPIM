# Figuras do documento — checklist

Todas as treze figuras estao capturadas e versionadas nesta pasta.

| # | Arquivo | Origem | Status |
|---|---------|--------|--------|
| 1 | fig01-login-web.png | Navegador, tela de login | [x] |
| 2 | fig02-painel-secretaria.png | Web, perfil Secretaria | [x] |
| 3 | fig03-chatbot-web.png | Web, assistente recusando pergunta fora do escopo | [x] |
| 4 | fig04-login-app.jpg | iPhone, tela de login | [x] |
| 5 | fig05-painel-app.jpg | iPhone, aba Inicio | [x] |
| 6 | fig06-materias-app.jpg | iPhone, materia expandida com conteudos lidos | [x] |
| 7 | fig07-atividade-app.jpg | iPhone, avaliacao em andamento | [x] |
| 8 | fig08-acessibilidade.jpg | iPhone, alto contraste e A++ | [x] |
| 9 | fig09-mer.png | Gerada por mermaid-cli de database/README.md | [x] |
| 10 | fig10-modelo-logico.png | Gerada por mermaid-cli de database/README.md | [x] |
| 11 | fig11-estrutura-fisica.png | database/01_schema.sql no editor | [x] |
| 12 | fig12-conteineres.png | docker compose ps -a e /health | [x] |
| 13 | fig13-kanban.png | Quadro Kanban no Trello | [x] |
| 14 | fig14-farol.png | Site em producao, Farol de Evasao da Secretaria | [x] |
| — | logo-unip.png | Recortado da capa do Manual do PIM IV, para a capa | [x] |

## Formatos

As figuras 4 a 8 estao em JPEG porque foram transferidas do aparelho por
aplicativo de mensagens, que converte e limita o lado maior a 1600 pixels.
A resolucao e suficiente para impressao. As demais estao em PNG sem perda.

## Como as figuras 9 e 10 foram geradas

Os diagramas nao sao capturas de tela: sao renderizados a partir do codigo
Mermaid que vive em `database/README.md`, o que impede que a imagem divirja
da fonte. Para regerar apos alterar o diagrama, extraia o bloco Mermaid para
um arquivo `.mmd` e execute:

```powershell
npx -y @mermaid-js/mermaid-cli -i diagrama.mmd -o figura.png -w 2400 -b white
```

## Defeitos encontrados durante a captura

Duas figuras revelaram defeitos que a revisao de codigo nao havia detectado:

- A figura 8 expos texto branco sobre fundo amarelo na paleta de alto
  contraste, com razao de 1,07:1 (minimo exigido: 4,5:1).
- A figura 10 expos o uso de `PK_FK`, sintaxe invalida no Mermaid, que
  deslocava as colunas das tabelas associativas.

Ambos foram corrigidos antes da captura definitiva.
