# Roteiro de apresentação — PIM IV

Demonstração do Sistema Lumina rodando simultaneamente em **notebook** e
**celular**, com a aplicação web e o aplicativo móvel consumindo a mesma API.

---

## A decisão mais importante: qual rede usar

| Rede | Recomendação |
|---|---|
| **Hotspot do celular ("Lele")** | ✅ **Use esta** |
| UNIP-ALPHAVILLE-5G | ⚠️ Apenas se não houver alternativa |

### Por que não usar o Wi-Fi da faculdade

Redes institucionais quase sempre ativam **isolamento de clientes** (*AP
isolation*): cada dispositivo enxerga a internet, mas **não enxerga os outros
dispositivos da rede**. É uma medida de segurança correta e comum.

O problema: a demonstração depende exatamente disso — o celular precisa
alcançar a API que roda no notebook. Com isolamento ativo, o celular não
consegue, e **não há nada que você possa fazer no dia**, porque a configuração
é do roteador da instituição.

Some-se a isso a instabilidade que você já observou.

### Por que o hotspot resolve

Ao ligar o hotspot no celular e conectar o notebook nele:

- **Você controla a rede.** Sem isolamento, sem autenticação institucional
- **Só dois dispositivos**, ambos seus
- **Funciona em qualquer lugar** — sala de aula, corredor, outro prédio
- **Independe do Wi-Fi da faculdade estar de pé**

O celular é, ao mesmo tempo, o roteador e o cliente do aplicativo. Isso
funciona normalmente.

> **Sobre consumo de dados:** o tráfego entre celular e notebook é local e
> **não gasta seu plano**. Só haveria consumo se algo buscasse a internet, e o
> sistema roda inteiramente na sua máquina.

---

## Na véspera

**1. Confirme que o banco está no ar**

```powershell
Get-Service MSSQLSERVER
```

Se aparecer `Stopped`, inicie com `Start-Service MSSQLSERVER`.

**2. Ensaie o procedimento inteiro** usando o hotspot, exatamente como fará no
dia. Não deixe o primeiro teste para a hora da apresentação.

**3. Carregue notebook e celular.** O hotspot consome bateria rápido — leve os
carregadores.

**4. Tenha um plano de reserva:** grave um vídeo curto da tela do celular
usando o aplicativo. Se tudo falhar, você mostra o vídeo. Não é o ideal, mas é
melhor que uma tela de erro.

---

## No dia — passo a passo

### Passo 1 — Ligar o hotspot (celular)

Ajustes → Acesso Pessoal → **Permitir que outros conectem**

Confirme que o nome da rede é **Lele**.

### Passo 2 — Conectar o notebook no hotspot

Clique no ícone de Wi-Fi e conecte na rede **Lele**.

> Se o Windows perguntar se a rede é pública ou privada, **escolha privada** —
> facilita a comunicação entre os dispositivos.

### Passo 3 — Preparar o ambiente (notebook)

Abra o PowerShell e rode:

```powershell
cd "$HOME\OneDrive\Área de Trabalho\sistemaEducacionaPIM"
powershell -ExecutionPolicy Bypass -File .\scripts\apresentacao.ps1
```

O script detecta o novo IP — no hotspot costuma ser algo como `172.20.10.x` —,
**atualiza o aplicativo automaticamente**, confere o firewall e sobe a API.

**Anote o IP que ele exibir.** Aguarde a mensagem `Now listening on:`.

### Passo 4 — Subir o aplicativo (segundo terminal)

```powershell
cd "$HOME\OneDrive\Área de Trabalho\sistemaEducacionaPIM\mobile"
npx expo start --lan --clear
```

O `--clear` é obrigatório: o endereço da API mudou, e sem limpar o cache o
aplicativo tentaria o endereço antigo.

### Passo 5 — Abrir no celular

Aponte a **câmera do iPhone** para o QR Code no terminal e toque na
notificação que aparece.

### Passo 6 — Conferir antes de chamar o professor

- [ ] Navegador do notebook em `http://localhost:5199` abre a tela de login
- [ ] Navegador do celular em `http://SEU_IP:5199` abre a mesma tela
- [ ] Aplicativo abre no Expo Go e faz login

Só chame o professor depois dos três confirmados.

---

## Roteiro da demonstração (8 a 10 minutos)

### 1. Abertura — 1 min

> "O sistema tem três frentes: uma aplicação web, um aplicativo móvel e uma API
> que atende as duas. Vou mostrar as três funcionando ao mesmo tempo."

Deixe **notebook e celular lado a lado**, ambos na tela de login. Ver a mesma
identidade visual nas duas telas já comunica integração antes de qualquer
explicação.

### 2. Perfis e segurança — 2 min

No **notebook**, entre como **Secretaria** (`00000000000`).

Mostre o painel: indicadores, usuários, matrículas, sessões.

> "O controle de acesso é por perfil, e a verificação acontece no servidor. Se
> eu alterar a página no navegador para exibir opções administrativas, a API
> ainda recusa — a decisão não depende do que o navegador manda."

### 3. Integração entre plataformas — 2 min · **ponto alto**

No **celular**, entre como **Aluno** (`33333333333`).

Mostre as abas: Início, Matérias, Atividades, Resultados.

> "Os dois dispositivos consultam a mesma API e o mesmo banco. Não há
> sincronização entre eles — é a mesma fonte."

**Demonstração ao vivo:** no notebook, cadastre uma matéria nova. No celular,
puxe a tela para baixo para atualizar. **A matéria aparece.**

Esse é o momento que mais convence. Ensaie.

### 4. Regras garantidas pelo banco — 1 min

Ainda como Secretaria, tente matricular um aluno em turma cheia — ou explique:

> "A regra de 40 alunos por turma não está só no código: é um gatilho no banco.
> Testamos inserindo 45 alunos e ele bloqueou no 41º. Vale para qualquer
> caminho de escrita, inclusive acesso direto ao banco."

### 5. Acessibilidade — 1 min

No **celular**, toque no ícone ♿.

Ative o **alto contraste** e aumente o texto para **A++**. Mostre o **glossário
de Libras**.

> "Os mesmos recursos estão na web e no aplicativo. Não foi adicionado no final
> — foi projetado desde o começo."

### 6. Assistente virtual — 1 min

Toque no 💬 e pergunte: **"esqueci minha senha"**

Depois pergunte algo fora do escopo: **"qual a receita de bolo"**

> "Ele admite que não sabe e encaminha para a secretaria, em vez de inventar.
> Não usa IA externa: a base fica no nosso banco, então nenhum dado de aluno
> sai da instituição."

### 7. Fechamento — 1 min

> "Por trás disso: backend em C# dividido em quatro camadas, banco SQL Server
> normalizado com procedures e triggers, e o ambiente inteiro conteinerizado em
> Docker com pipeline de integração contínua."

Se houver tempo e interesse, mostre o Swagger em
`http://localhost:5199/swagger` — dá a dimensão da API.

---

## Se algo der errado

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Celular não abre o site | IP mudou | Rode o script de novo e reinicie o Expo com `--clear` |
| "Erro de conexão com o servidor" | API caiu | Confira o terminal da API; se fechou, rode o script de novo |
| API não sobe: *address already in use* | Sobrou processo | O script encerra sozinho; rode-o novamente |
| Expo Go: *incompatible version* | Cache antigo | `npx expo start --lan --clear` |
| QR Code não funciona | — | No Expo Go: "Enter URL manually" → `exp://SEU_IP:8081` |
| Nada funciona no celular | Rede | **Mostre a web no notebook** e explique que o app é o mesmo sistema |

### Regra de ouro

**Se o celular falhar, não trave.** Siga pela web no notebook e diga:

> "O aplicativo consome exatamente esta mesma API — posso mostrar o código e as
> telas."

O professor avalia o sistema, não a estabilidade da rede. Os prints no
documento cobrem exatamente essa situação.

---

## Perguntas prováveis do professor

**"Por que React Native e não .NET MAUI?"**

> Compilar para iOS exige macOS e Xcode, que ninguém do grupo tem. Com Expo, o
> aplicativo roda em iPhone real a partir do Windows. O alinhamento com .NET
> permanece no backend, que é todo C#.

**"O banco é SQL ou NoSQL?"**

> Relacional, SQL Server. Os dados acadêmicos são estruturados e muito
> relacionados; a integridade referencial garantida pelo banco é o que impede
> registrar nota para aluno inexistente.

**"Como as senhas são guardadas?"**

> Com BCrypt, que é hash lento e com salt. A senha em texto claro nunca chega
> ao banco.

**"O sistema aguenta quantos usuários?"**

> Não fizemos teste de carga — está registrado como limitação no documento. A
> arquitetura é stateless por causa do JWT, então escala horizontalmente sem
> sessão compartilhada.

**"Isso está publicado?"**

> Está conteinerizado em Docker e há um pipeline de integração contínua.
> Subimos o ambiente completo e validamos: o healthcheck responde 503 quando o
> banco cai e volta a 200 quando religa.

**"Vocês testaram?"**

> Sim, e encontramos defeitos reais. O healthcheck original só verificava o
> runtime e reportaria "saudável" com a API morta. A ordem de inicialização dos
> contêineres estava errada. O front-end apontava para localhost, o que quebrava
> no celular. Todos foram corrigidos e estão documentados.
