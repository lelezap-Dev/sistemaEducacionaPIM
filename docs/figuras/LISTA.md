# Figuras do documento — checklist

Salve cada print nesta pasta com o nome exato indicado.

| # | Arquivo | Onde tirar | Status |
|---|---------|------------|--------|
| 1 | fig01-login-web.png | Navegador do notebook, tela de login | [x] capturada |
| 2 | fig02-painel-secretaria.png | Web, logado como Secretaria | [x] capturada |
| 3 | fig03-chatbot-web.png | Web, chatbot recusando pergunta fora do escopo | [x] capturada |
| 4 | fig04-login-app.png | Celular, tela de login do app | [x] capturada |
| 5 | fig05-painel-app.png | Celular, aba Inicio | [x] capturada |
| 6 | fig06-materias-app.png | Celular, aba Materias expandida | [x] capturada |
| 7 | fig07-atividade-app.png | Celular, respondendo atividade | [x] capturada |
| 8 | fig08-acessibilidade.png | Celular, alto contraste ativado | [x] capturada |
| 9 | fig09-mer.png | Gerada por mermaid-cli a partir de database/README.md | [x] no repositorio |
| 10 | fig10-modelo-logico.png | Gerada por mermaid-cli a partir de database/README.md | [x] no repositorio |
| 11 | fig11-estrutura-fisica.png | database/01_schema.sql no editor | [ ] |
| 12 | fig12-conteineres.png | Terminal com docker compose ps | [ ] |
| 13 | fig13-kanban.png | Trello do grupo | [ ] |

## Como as figuras 9 e 10 foram geradas

Os diagramas nao foram capturados de tela: sao renderizados a partir do
codigo Mermaid que vive em `database/README.md`, o que garante que a
imagem nunca divirja da fonte. Para regerar apos alterar o diagrama:

```powershell
# extrai o bloco Mermaid desejado para um arquivo .mmd e entao:
npx -y @mermaid-js/mermaid-cli -i diagrama.mmd -o figura.png -w 2400 -b white
```

## Pendencia

As figuras 1 a 8 foram capturadas e conferidas, mas ainda precisam ser
salvas nesta pasta com os nomes acima.
