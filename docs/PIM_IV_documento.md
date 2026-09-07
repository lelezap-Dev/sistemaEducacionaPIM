# PIM IV — Documento para entrega

> **Como usar este arquivo**
>
> O conteúdo abaixo segue a estrutura exigida pelo Manual do PIM IV. Para
> montar o arquivo final, copie cada seção para o Word ou Google Docs
> aplicando a formatação ABNT:
>
> - Papel A4, margens superior e esquerda 3 cm, inferior e direita 2 cm
> - Fonte Arial ou Times New Roman, tamanho 12; citações longas e notas em 10
> - Espaçamento entrelinhas 1,5; recuo de 1,5 cm na primeira linha
> - Alinhamento justificado
> - Numeração de páginas em algarismos arábicos no canto superior direito,
>   começando na Introdução
>
> Os trechos marcados como `[INSERIR FIGURA]` indicam onde entram as capturas
> de tela. Cada figura precisa de legenda acima ("Figura N - Título") e fonte
> abaixo ("Fonte: Elaborado pelos Autores (2026)").

---

# UNIVERSIDADE PAULISTA

**JARBAS MOISES CAMPOS CAMARGO DO PRADO — T235FD4**
**LEANDRO DA SILVA CARVALHO JUNIOR — R4614B0**
**MARIA EDUARDA NAVA — R1932G1**
**RAFAELA AMBROSIO DE OLIVEIRA — R6620H5**
**SAFIRA ALVES BARROS — F360FE8**
**VITORIA DOS SANTOS AMORIM — H66150**

<br><br>

**PROJETO INTEGRADO MULTIDISCIPLINAR IV:**
**SOLUÇÃO TECNOLÓGICA CORPORATIVA INTEGRADA PARA A TRANSFORMAÇÃO DIGITAL DA INSTITUIÇÃO LUMINA**

<br><br><br>

Santana de Parnaíba
2026

---

# FOLHA DE ROSTO

**JARBAS MOISES CAMPOS CAMARGO DO PRADO**
**LEANDRO DA SILVA CARVALHO JUNIOR**
**MARIA EDUARDA NAVA**
**RAFAELA AMBROSIO DE OLIVEIRA**
**SAFIRA ALVES BARROS**
**VITORIA DOS SANTOS AMORIM**

<br><br>

**PROJETO INTEGRADO MULTIDISCIPLINAR IV:**
**SOLUÇÃO TECNOLÓGICA CORPORATIVA INTEGRADA PARA A TRANSFORMAÇÃO DIGITAL DA INSTITUIÇÃO LUMINA**

<br>

> Projeto Integrado Multidisciplinar para obtenção do título de tecnólogo em
> Análise e Desenvolvimento de Sistemas, apresentado à Universidade Paulista
> — UNIP.
>
> Orientador: Tarcisio de Souza Peres

<br><br>

Santana de Parnaíba
2026

---

# RESUMO

O presente trabalho apresenta o desenvolvimento e a implantação de uma solução
tecnológica corporativa integrada para a instituição de ensino Lumina,
organização simulada estudada no Projeto Integrado Multidisciplinar anterior.
Dando continuidade ao levantamento então realizado, o projeto avançou da fase
de análise para a construção efetiva do sistema, contemplando aplicação web,
aplicativo móvel, banco de dados corporativo, arquitetura de software em
camadas e plano de infraestrutura em nuvem. A aplicação web foi desenvolvida em
C# sobre a plataforma .NET, expondo uma interface de programação de aplicações
no padrão REST protegida por autenticação baseada em JSON Web Token e controle
de acesso por perfis. O aplicativo móvel foi construído em React Native com o
ecossistema Expo, consumindo a mesma interface de programação e compartilhando
a base de usuários, o que assegura consistência entre as plataformas. A
arquitetura foi reorganizada em quatro camadas — Domínio, Infraestrutura,
Aplicação e Apresentação — com dependências explícitas entre os projetos,
atendendo aos princípios de orientação a objetos e modularização. O banco de
dados relacional, implementado em Microsoft SQL Server, foi normalizado até a
terceira forma normal e teve as regras de negócio transpostas para
procedimentos armazenados e gatilhos, de modo que as restrições passassem a
valer independentemente do cliente que acessa os dados. Para a infraestrutura,
elaborou-se um plano baseado em conteinerização com Docker e integração
contínua por meio de GitHub Actions. O gerenciamento seguiu a metodologia ágil
Scrum, com quadro Kanban na plataforma Trello e ciclos quinzenais. Em
atendimento aos princípios de responsabilidade social, o sistema incorpora
recursos de acessibilidade nas duas plataformas, incluindo alto contraste,
escalas de texto e glossário em Língua Brasileira de Sinais, além de um
assistente virtual que reduz barreiras de uso. Os resultados demonstram que a
integração entre aplicações web e móveis, apoiada por arquitetura modular e
banco de dados consistente, constitui caminho viável para a modernização
tecnológica de instituições de ensino, promovendo eficiência operacional,
inclusão e sustentabilidade pela redução do uso de papel.

**Palavras-chave:** Transformação Digital. Desenvolvimento Web. Desenvolvimento
Mobile. Arquitetura de Software. Banco de Dados. Acessibilidade.

---

# ABSTRACT

This paper presents the development and deployment of an integrated corporate
technological solution for Lumina, a simulated educational institution studied
in the previous Multidisciplinary Integrated Project. Building upon the
analysis carried out at that stage, the project moved from assessment to the
effective construction of the system, comprising a web application, a mobile
application, a corporate database, a layered software architecture and a cloud
infrastructure plan. The web application was developed in C# on the .NET
platform, exposing a REST application programming interface protected by JSON
Web Token authentication and role-based access control. The mobile application
was built with React Native and the Expo ecosystem, consuming the same
interface and sharing the user base, which ensures consistency across
platforms. The architecture was reorganised into four layers — Domain,
Infrastructure, Application and Presentation — with explicit dependencies
between projects, meeting object-oriented and modularisation principles. The
relational database, implemented in Microsoft SQL Server, was normalised to the
third normal form and had its business rules transposed into stored procedures
and triggers, so that constraints apply regardless of the client accessing the
data. For infrastructure, a plan based on Docker containerisation and
continuous integration through GitHub Actions was designed. Project management
followed the Scrum agile methodology, using a Kanban board on the Trello
platform with fortnightly cycles. In accordance with social responsibility
principles, the system incorporates accessibility resources on both platforms,
including high contrast, text scaling and a Brazilian Sign Language glossary,
as well as a virtual assistant that lowers usage barriers. The results show
that integrating web and mobile applications, supported by a modular
architecture and a consistent database, is a viable path for the technological
modernisation of educational institutions, promoting operational efficiency,
inclusion and sustainability through reduced paper consumption.

**Keywords:** Digital Transformation. Web Development. Mobile Development.
Software Architecture. Database. Accessibility.

---

# SUMÁRIO

| Seção | Página |
|---|---|
| 1 INTRODUÇÃO | x |
| 2 CARACTERIZAÇÃO DA ORGANIZAÇÃO | x |
| 2.1 Segmento de atuação | x |
| 2.2 Produtos e serviços | x |
| 2.3 Estrutura organizacional | x |
| 2.4 Principais processos | x |
| 2.5 Problemas identificados | x |
| 2.6 Oportunidades de melhoria por meio da tecnologia | x |
| 3 PLANEJAMENTO DA SOLUÇÃO TECNOLÓGICA | x |
| 3.1 Problema a ser resolvido | x |
| 3.2 Objetivos da solução | x |
| 3.3 Público-alvo | x |
| 3.4 Proposta de valor | x |
| 3.5 Benefícios esperados | x |
| 3.6 Diferenciais competitivos | x |
| 4 RESPONSABILIDADE SOCIAL E DIVERSIDADE | x |
| 4.1 Combate à discriminação | x |
| 4.2 Valorização da diversidade | x |
| 4.3 Recursos tecnológicos inclusivos | x |
| 4.4 Ações voltadas à acessibilidade | x |
| 4.5 Tecnologia para a promoção da cidadania | x |
| 5 DESENVOLVIMENTO DA SOLUÇÃO WEB | x |
| 6 DESENVOLVIMENTO DA SOLUÇÃO MOBILE | x |
| 7 ARQUITETURA DE SOFTWARE | x |
| 8 PROJETO DO BANCO DE DADOS | x |
| 9 INFRAESTRUTURA EM NUVEM E DEVOPS | x |
| 10 GERENCIAMENTO ÁGIL DO PROJETO | x |
| 11 CONCLUSÃO | x |
| REFERÊNCIAS | x |

---

# 1 INTRODUÇÃO

A transformação digital deixou de ser diferencial competitivo para tornar-se
condição de permanência das organizações. No setor educacional, essa mudança
assume contornos particulares: além de ganhos administrativos, a tecnologia
altera a forma como estudantes acessam conteúdo, como docentes acompanham
turmas e como instituições comprovam resultados pedagógicos. Nesse cenário,
soluções que integrem processos administrativos e acadêmicos em um único
ambiente digital tornam-se instrumentos de gestão e, simultaneamente, de
inclusão.

O presente Projeto Integrado Multidisciplinar dá continuidade ao trabalho
desenvolvido no PIM III, no qual foi realizado o levantamento de requisitos, a
modelagem e a prototipação do Sistema Acadêmico Colaborativo para a instituição
simulada Lumina. Enquanto aquela etapa concentrou-se na análise e no
planejamento, esta avança para a construção efetiva da solução, contemplando o
desenvolvimento das aplicações web e móvel, a reestruturação da arquitetura de
software, a implementação completa do banco de dados corporativo e a definição
da infraestrutura de implantação.

O objetivo geral deste trabalho é desenvolver e implantar uma solução
tecnológica corporativa integrada capaz de apoiar a transformação digital da
instituição Lumina, considerando aspectos de inovação, inclusão, desempenho,
escalabilidade, segurança e qualidade. Como objetivos específicos, o projeto
propõe-se a: construir uma aplicação web com interface de programação no padrão
REST e autenticação segura; desenvolver um aplicativo móvel integrado a essa
mesma interface; reorganizar a arquitetura em camadas com responsabilidades bem
delimitadas; projetar e implementar um banco de dados relacional otimizado, com
regras de negócio garantidas pelo próprio gerenciador; elaborar um plano de
infraestrutura em nuvem apoiado em conteinerização e automação de implantação;
e conduzir o desenvolvimento por meio de metodologia ágil.

Quanto à metodologia, o trabalho caracteriza-se como pesquisa aplicada de
natureza exploratória, conduzida na forma de desenvolvimento experimental. A
fundamentação teórica apoiou-se em obras de referência das áreas de engenharia
de software, arquitetura de sistemas e bancos de dados, com destaque para
Sommerville (2019), Pressman e Maxim (2016), Martin (2019) e Elmasri e Navathe
(2018). A condução seguiu o framework Scrum, com ciclos quinzenais, quadro
Kanban para acompanhamento das tarefas e reuniões periódicas de alinhamento.
Cada funcionalidade implementada foi submetida a verificação prática antes de
ser considerada concluída, procedimento cujos resultados são apresentados ao
longo dos capítulos.

A instituição objeto do estudo, Lumina, é uma organização de ensino simulada
criada para o desenvolvimento acadêmico deste projeto. Trata-se de uma escola
de porte médio que enfrenta desafios recorrentes no setor: dispersão de
informações entre planilhas e documentos físicos, comunicação fragmentada entre
os públicos internos e ausência de indicadores consolidados para apoiar
decisões pedagógicas. Tais características, embora reproduzidas em ambiente
controlado, refletem dificuldades concretas observadas em instituições reais,
o que confere pertinência à solução proposta.

O documento está organizado em onze seções. Após esta introdução, a segunda
seção caracteriza a organização estudada. A terceira apresenta o planejamento
da solução sob a perspectiva do empreendedorismo em tecnologia da informação.
A quarta discute responsabilidade social, diversidade e acessibilidade. Da
quinta à nona seção são detalhados, respectivamente, o desenvolvimento web, o
desenvolvimento móvel, a arquitetura de software, o projeto do banco de dados e
a infraestrutura em nuvem. A décima seção descreve o gerenciamento ágil
adotado, e a décima primeira apresenta as conclusões do trabalho.

---

# 2 CARACTERIZAÇÃO DA ORGANIZAÇÃO

## 2.1 Segmento de atuação

A Lumina é uma instituição de ensino privada de porte médio, situada no
município de Santana de Parnaíba, no estado de São Paulo. Atua no segmento de
educação básica, com oferta de Ensino Fundamental II e Ensino Médio, atendendo
aproximadamente 800 estudantes distribuídos em dois períodos. O quadro
funcional é composto por cerca de 45 docentes e 12 colaboradores
técnico-administrativos.

O segmento educacional privado brasileiro caracteriza-se por elevada
competitividade e por margens operacionais sensíveis à eficiência
administrativa. Instituições desse porte encontram-se em posição peculiar: são
grandes o bastante para que processos manuais se tornem gargalo, mas não
dispõem de orçamento comparável ao de grandes redes para aquisição de sistemas
corporativos proprietários, cujo licenciamento costuma ser cobrado por aluno
matriculado.

## 2.2 Produtos e serviços

A instituição oferece os seguintes serviços:

- **Ensino regular** — aulas presenciais do Ensino Fundamental II e do Ensino
  Médio, organizadas em turmas de até 40 estudantes;
- **Acompanhamento pedagógico** — avaliações periódicas, registro de
  frequência e comunicação de desempenho às famílias;
- **Material didático digital** — disponibilização de conteúdos complementares
  produzidos pelo próprio corpo docente;
- **Atendimento administrativo** — matrículas, rematrículas, emissão de
  documentos escolares e atendimento às famílias.

## 2.3 Estrutura organizacional

A estrutura da Lumina organiza-se em três níveis:

**Direção** — responde pelas decisões estratégicas, pelo orçamento e pelas
relações institucionais.

**Coordenação pedagógica** — acompanha o cumprimento do plano de ensino,
orienta o corpo docente e monitora os indicadores de aprendizagem.

**Secretaria acadêmica** — executa os processos administrativos: cadastro de
estudantes, matrícula em turmas, controle de documentos e atendimento de
primeiro nível aos usuários dos sistemas internos.

Sob a coordenação pedagógica atua o **corpo docente**, responsável pelo
planejamento das aulas, produção de material, aplicação de avaliações e
lançamento de notas. O **corpo discente** constitui o público final dos
serviços prestados.

Essa estrutura relaciona-se diretamente com o modelo de controle de acesso
adotado no sistema, apresentado na seção 5, no qual os privilégios foram
segmentados nos perfis Secretaria, Professor e Aluno.

## 2.4 Principais processos

Foram mapeados quatro processos centrais para o funcionamento da instituição:

**Matrícula e alocação.** A secretaria cadastra o estudante, verifica a
documentação e o vincula a uma turma, respeitando o limite de vagas. O processo
era conduzido em planilhas eletrônicas, sem validação automática de capacidade.

**Gestão de conteúdo pedagógico.** Docentes preparam materiais e os distribuem
às turmas. Antes da solução proposta, a distribuição ocorria por meios
heterogêneos — mensageiros instantâneos, correio eletrônico e cópias impressas
—, sem repositório central nem histórico organizado.

**Avaliação e registro de desempenho.** Provas e exercícios eram aplicados em
papel, corrigidos manualmente e os resultados transcritos para planilhas. O
intervalo entre a aplicação e a divulgação chegava a duas semanas.

**Acompanhamento gerencial.** A coordenação solicitava periodicamente
levantamentos de rendimento por turma, produzidos de forma manual a partir das
planilhas dos docentes.

## 2.5 Problemas identificados

A análise conduzida no PIM III identificou os seguintes problemas, aqui
retomados por constituírem a justificativa da solução desenvolvida:

**Dispersão da informação.** Dados acadêmicos distribuídos entre planilhas
individuais, documentos impressos e mensagens pessoais, sem fonte única de
consulta. A consequência direta é a divergência entre registros e a
dificuldade de auditoria.

**Comunicação fragmentada.** Ausência de canal institucional único entre
docentes, estudantes e secretaria, o que gera perda de prazos e retrabalho no
esclarecimento de dúvidas recorrentes.

**Ausência de indicadores.** Inexistência de painéis consolidados que
permitissem à coordenação identificar tempestivamente estudantes com baixo
rendimento, o que restringe a atuação pedagógica ao caráter corretivo.

**Sobrecarga administrativa.** Concentração de tarefas repetitivas na
secretaria, com destaque para atendimentos de recuperação de senha e
esclarecimento de dúvidas operacionais, atividades que consomem tempo
qualificado sem agregar valor ao processo.

**Consumo de papel.** Impressão recorrente de avaliações, listas de presença e
comunicados, com impacto ambiental e financeiro.

**Barreiras de acessibilidade.** Ausência de recursos que assegurassem o uso
autônomo dos sistemas por pessoas com deficiência visual ou auditiva.

## 2.6 Oportunidades de melhoria por meio da tecnologia

Do diagnóstico apresentado decorrem as seguintes oportunidades, que orientaram
as decisões técnicas descritas nos capítulos seguintes:

| Problema identificado | Oportunidade tecnológica | Seção correspondente |
|---|---|---|
| Dispersão da informação | Banco de dados relacional único, normalizado e íntegro | 8 |
| Comunicação fragmentada | Plataforma web e móvel com base de dados compartilhada | 5 e 6 |
| Ausência de indicadores | Painéis com indicadores e classificação automática de desempenho | 5 |
| Sobrecarga administrativa | Assistente virtual para dúvidas recorrentes e autoatendimento | 5 |
| Consumo de papel | Digitalização de avaliações e materiais didáticos | 5 |
| Barreiras de acessibilidade | Recursos de acessibilidade nas duas plataformas | 4 |

Cabe registrar que a solução proposta não pretende substituir a atuação
humana, mas eliminar o trabalho repetitivo que hoje a consome, liberando
docentes e equipe administrativa para atividades de maior valor pedagógico.

---

# 3 PLANEJAMENTO DA SOLUÇÃO TECNOLÓGICA

*(Disciplina: Empreendedorismo em Tecnologia da Informação)*

## 3.1 Problema a ser resolvido

O problema central pode ser assim enunciado: **a instituição Lumina não dispõe
de um ambiente digital unificado que integre os processos acadêmicos e
administrativos, o que provoca dispersão de informações, retrabalho e ausência
de indicadores para a tomada de decisão pedagógica.**

Trata-se de problema de integração, e não de falta de ferramentas. A
instituição utiliza diversos recursos digitais — planilhas, mensageiros,
correio eletrônico —, porém desconectados entre si. Cada um resolve
adequadamente uma tarefa isolada, mas o conjunto não constitui um sistema: os
dados não circulam, exigindo transcrição manual a cada etapa, procedimento que
introduz erros e consome tempo.

## 3.2 Objetivos da solução

**Objetivo geral:** disponibilizar uma plataforma acadêmica integrada,
acessível por navegador e por dispositivo móvel, que centralize o cadastro de
usuários, a gestão de turmas e conteúdos, a aplicação de avaliações e a
apuração de indicadores de desempenho.

**Objetivos específicos:**

1. Centralizar em base única os dados de estudantes, docentes, turmas,
   disciplinas e avaliações;
2. Reduzir o tempo entre a aplicação de uma avaliação e a divulgação do
   resultado, por meio de correção automática;
3. Disponibilizar indicadores consolidados que permitam identificar
   antecipadamente estudantes em situação de risco acadêmico;
4. Diminuir a demanda de atendimentos operacionais sobre a secretaria mediante
   recursos de autoatendimento;
5. Assegurar o uso autônomo da plataforma por pessoas com deficiência;
6. Reduzir o consumo de papel pela digitalização de avaliações e materiais.

## 3.3 Público-alvo

A solução destina-se a três públicos internos, cujos perfis foram definidos no
PIM III a partir da técnica de personas e aqui retomados por terem orientado as
decisões de projeto:

**Estudantes** (cerca de 800 usuários). Representados pela persona Lucas, 16
anos, cursando o segundo ano do Ensino Médio, com alta familiaridade
tecnológica e acesso predominante por telefone celular. Necessita consultar
materiais, acompanhar prazos e verificar seu desempenho.

**Docentes** (cerca de 45 usuários). Representados pela persona Mariana, 34
anos, professora de Matemática, com rotina dividida entre planejamento,
correção e aulas presenciais. Necessita publicar materiais e avaliações com
agilidade e identificar rapidamente estudantes com dificuldade.

**Equipe administrativa** (cerca de 12 usuários). Representada pela persona
Carla, 45 anos, profissional da secretaria. Necessita cadastrar usuários,
efetivar matrículas, emitir relatórios e resolver problemas de acesso.

A predominância do acesso móvel entre estudantes justificou o desenvolvimento
do aplicativo descrito na seção 6, bem como a revisão da responsividade da
aplicação web.

## 3.4 Proposta de valor

A proposta de valor da solução articula-se em quatro elementos:

**Unificação.** Uma única base de dados alimenta a aplicação web e o
aplicativo móvel. A informação registrada em uma plataforma torna-se
imediatamente disponível na outra, eliminando a transcrição manual.

**Imediatismo.** A correção automática das avaliações converte um processo que
demandava até duas semanas em resultado instantâneo, permitindo que a
intervenção pedagógica ocorra enquanto o conteúdo ainda está sendo trabalhado.

**Visibilidade.** Indicadores consolidados e classificação automática por faixa
de rendimento transformam dados operacionais em informação gerencial,
deslocando a atuação da coordenação do caráter corretivo para o preventivo.

**Inclusão.** Recursos de acessibilidade disponíveis em ambas as plataformas
asseguram que a modernização alcance também os usuários habitualmente
preteridos por soluções convencionais.

## 3.5 Benefícios esperados

| Dimensão | Benefício | Indicador de verificação |
|---|---|---|
| Operacional | Redução do tempo de divulgação de resultados | De até 14 dias para divulgação imediata |
| Operacional | Diminuição de atendimentos de suporte | Volume de chamados de recuperação de senha |
| Pedagógica | Identificação precoce de risco acadêmico | Percentual de estudantes classificados como "Em Risco" |
| Pedagógica | Ampliação do acesso a materiais | Registros de leitura de conteúdo |
| Ambiental | Redução do consumo de papel | Volume de impressões de avaliações |
| Social | Uso autônomo por pessoas com deficiência | Recursos de acessibilidade implementados |

Cabe ressalva metodológica: por tratar-se de instituição simulada, os
indicadores acima constituem parâmetros propostos para aferição em implantação
real, não resultados mensurados. Os dados apresentados neste documento provêm
de ambiente de demonstração.

## 3.6 Diferenciais competitivos

Comparada às alternativas disponíveis no mercado, a solução apresenta os
seguintes diferenciais:

**Ausência de licenciamento por usuário.** Sistemas acadêmicos comerciais
costumam cobrar mensalidade proporcional ao número de estudantes matriculados.
A solução desenvolvida utiliza exclusivamente tecnologias sem custo de
licenciamento, tornando o custo de operação independente do porte da
instituição.

**Autonomia em relação a serviços externos.** O assistente virtual descrito na
seção 5 opera sobre base de conhecimento própria, sem recorrer a serviços
externos de inteligência artificial. A decisão elimina custo por requisição,
dispensa conexão com provedores terceiros e — aspecto relevante diante da Lei
Geral de Proteção de Dados — evita que dados de estudantes trafeguem para fora
da instituição.

**Acessibilidade nativa.** Os recursos de acessibilidade foram incorporados ao
projeto desde a concepção, e não adicionados posteriormente, estando presentes
igualmente na aplicação web e no aplicativo móvel.

**Portabilidade de implantação.** A conteinerização descrita na seção 9 permite
que a solução seja implantada em servidor próprio ou em provedor de nuvem, sem
dependência de fornecedor específico.

---

# 4 RESPONSABILIDADE SOCIAL E DIVERSIDADE

*(Disciplina EAD: Relações Étnico-Raciais e Afrodescendência)*

## 4.1 Combate à discriminação

O combate à discriminação foi tratado no projeto não como declaração de
princípios, mas como conjunto de decisões técnicas verificáveis.

**Identificação por dado objetivo.** A autenticação utiliza o Cadastro de
Pessoa Física como identificador, e o sistema não coleta informações de raça,
religião, orientação sexual ou origem. Ao não registrar tais dados, elimina-se
a possibilidade de que sejam empregados, ainda que involuntariamente, como
critério de diferenciação em consultas ou relatórios.

**Critérios de avaliação uniformes.** A correção das atividades é integralmente
automatizada, comparando a resposta assinalada com o gabarito armazenado. O
procedimento é idêntico para todos os estudantes e independe de julgamento
humano, o que afasta a interferência de vieses inconscientes na atribuição de
notas.

**Segregação de privilégios.** O controle de acesso baseado em perfis assegura
que o escopo de visualização decorra exclusivamente da função exercida. Um
docente acessa apenas as turmas sob sua responsabilidade; um estudante, apenas
seu próprio desempenho. A regra é aplicada no servidor, de modo que não pode
ser contornada pela manipulação da interface.

**Rastreabilidade das alterações.** O gatilho de auditoria descrito na seção 8
registra toda modificação de perfil ou de situação cadastral, indicando valor
anterior, valor novo e momento da alteração. Eventual tratamento diferenciado
torna-se, portanto, auditável.

## 4.2 Valorização da diversidade

A valorização da diversidade manifesta-se no reconhecimento de que os usuários
acessam o sistema em condições materiais desiguais.

**Diversidade de dispositivos.** A persona Lucas, definida no PIM III, acessa a
internet predominantemente por telefone celular. Essa constatação — que reflete
a realidade de parcela expressiva dos estudantes brasileiros, para quem o
aparelho móvel é o principal meio de acesso — motivou tanto o desenvolvimento
do aplicativo quanto a correção da responsividade da aplicação web, descrita na
seção 5.

**Diversidade de condições de conexão.** O aplicativo móvel mantém cópia local
dos dados consultados. Estudantes sem conexão permanente podem consultar
matérias, conteúdos e resultados já carregados, recebendo aviso explícito de
que os dados podem estar desatualizados. A funcionalidade reconhece que o
acesso contínuo à internet não é condição universal.

**Diversidade de repertório tecnológico.** O assistente virtual responde em
linguagem corrente e admite variações de escrita — a busca desconsidera acentos
e diferenças entre maiúsculas e minúsculas. A decisão beneficia usuários com
menor familiaridade tecnológica, como parte do corpo docente e das famílias.

## 4.3 Recursos tecnológicos inclusivos

Foram implementados os seguintes recursos, disponíveis nas duas plataformas:

**Modo de alto contraste.** Substitui a paleta cromática por combinação de
maior razão de contraste, atendendo a usuários com baixa visão ou daltonismo.
A preferência é persistida entre sessões.

**Escalas tipográficas.** Três níveis progressivos de ampliação de texto,
aplicados dinamicamente sem quebra do alinhamento dos elementos.

**Glossário em Língua Brasileira de Sinais.** Relação de termos acadêmicos
recorrentes acompanhados da descrição do respectivo sinal, oferecendo apoio a
usuários surdos. O glossário foi ampliado dos três termos do PIM III para doze
na versão atual.

**Rotulação para leitores de tela.** Todos os elementos interativos do
aplicativo receberam rótulos de acessibilidade e a indicação de seu papel
semântico, permitindo navegação por tecnologia assistiva.

**Dimensionamento de alvos de toque.** Os elementos acionáveis do aplicativo
observam a dimensão mínima de 48 pontos, conforme recomendação das diretrizes
de acessibilidade, beneficiando usuários com limitação de coordenação motora.

## 4.4 Ações voltadas à acessibilidade

As ações adotadas orientaram-se pelas Diretrizes de Acessibilidade para
Conteúdo Web (WCAG) e pela Lei Brasileira de Inclusão da Pessoa com Deficiência
(Lei nº 13.146/2015), cujo artigo 63 estabelece a obrigatoriedade de
acessibilidade em sítios eletrônicos.

O quadro a seguir relaciona cada ação ao princípio correspondente:

| Princípio WCAG | Ação implementada |
|---|---|
| Perceptível | Alto contraste; escalas de texto; rótulos textuais em ícones |
| Operável | Alvos de toque ampliados; encerramento de diálogos pela tecla Escape |
| Compreensível | Linguagem corrente; mensagens de erro explicativas; glossário em Libras |
| Robusto | Papéis semânticos declarados, compatíveis com leitores de tela |

Registra-se, por honestidade metodológica, que não foram realizados testes com
usuários com deficiência, procedimento que constituiria etapa necessária em
implantação real e que se recomenda como desdobramento futuro do trabalho.

## 4.5 Tecnologia para a promoção da cidadania

A dimensão cidadã do projeto expressa-se em três frentes:

**Transparência do desempenho.** O estudante acessa diretamente seu histórico
de avaliações, com o número de acertos e o percentual obtido em cada uma. A
informação deixa de ser mediada exclusivamente pela instituição, o que
constitui condição para que o estudante acompanhe e questione sua própria
trajetória.

**Autonomia no acesso.** Os mecanismos de autoatendimento — recuperação de
senha por palavra-chave e assistente virtual — reduzem a dependência de
intermediação administrativa para tarefas rotineiras, particularmente
relevante para famílias com menor disponibilidade de deslocamento à
instituição.

**Sustentabilidade ambiental.** A digitalização de avaliações e materiais
didáticos reduz o consumo de papel. Considerando o porte da instituição
simulada — 800 estudantes submetidos a avaliações periódicas —, a economia
projetada é da ordem de milhares de folhas por período letivo, com impacto
correspondente sobre custos e sobre a pegada ambiental da operação.

---

# 5 DESENVOLVIMENTO DA SOLUÇÃO WEB

*(Disciplina: Desenvolvimento Web com .NET)*

## 5.1 Arquitetura da aplicação

A aplicação web foi construída sobre a plataforma **ASP.NET Core 10**, com a
linguagem C#. A escolha decorreu de três fatores: a continuidade em relação ao
PIM III, no qual o sistema já havia sido iniciado nessa tecnologia; a
disponibilidade de um mapeador objeto-relacional maduro, o Entity Framework
Core, que reduz o código repetitivo de acesso a dados; e o alinhamento com a
disciplina de Programação Aplicada em .NET, cursada no mesmo semestre.

O modelo adotado é o de **aplicação monolítica com interface de programação
REST**, no qual um único processo atende tanto as requisições da interface
quanto as do aplicativo móvel. A opção por um monólito, em detrimento de
microsserviços, foi deliberada. Newman (2019) adverte que a decomposição
prematura em serviços introduz complexidade de rede, de implantação e de
observabilidade que raramente se justifica em sistemas de domínio único e
equipe pequena. Para o porte da instituição estudada — cerca de 800 usuários e
uma equipe de seis desenvolvedores —, o monólito bem estruturado em camadas
oferece a simplicidade operacional necessária sem comprometer a organização
interna do código, tema tratado na seção 7.

O servidor web embutido, Kestrel, atende as requisições e serve simultaneamente
os arquivos estáticos da interface. Essa decisão de servir o front-end pela
mesma aplicação eliminou uma classe inteira de problemas: como a página e a
interface de programação compartilham origem, as chamadas podem usar caminho
relativo, e a aplicação funciona sem alteração em qualquer endereço —
localhost, endereço de rede local ou provedor de nuvem.

`[INSERIR FIGURA — Tela de login da aplicação web]`

## 5.2 Interface de programação REST

A interface expõe **48 endpoints** distribuídos em oito controladores, cada um
responsável por um agregado do domínio. A tabela a seguir sintetiza a
organização:

| Controlador | Rota base | Responsabilidade | Perfil exigido |
|---|---|---|---|
| `AuthController` | `/api/auth` | Cadastro, autenticação, logout e redefinição de senha | Público |
| `UsuarioController` | `/api/usuarios` | Gestão de contas e aprovações | Secretaria |
| `MateriaController` | `/api/materias` | Disciplinas e conteúdos didáticos | Professor / Aluno |
| `TurmaController` | `/api/turmas` | Turmas e matrículas | Professor / Secretaria |
| `AtividadeController` | `/api/atividades` | Avaliações e submissão de respostas | Professor / Aluno |
| `RelatorioController` | `/api/relatorios` | Relatórios, ranking e sessões | Conforme o dado |
| `ChatbotController` | `/api/chatbot` | Assistente virtual | Público |
| — | `/health` | Verificação de disponibilidade | Público |

Todas as respostas seguem um envelope uniforme, o que simplifica o tratamento
no cliente:

```json
// Sucesso
{ "sucesso": true, "dados": { } }

// Erro
{ "sucesso": false, "mensagem": "CPF ou senha inválidos." }
```

A padronização permitiu que tanto o front-end web quanto o aplicativo móvel
implementassem um único ponto de tratamento de erros, em vez de verificar cada
chamada individualmente.

## 5.3 Autenticação

A autenticação emprega **JSON Web Token (JWT)**, padrão definido pela RFC 7519.
O fluxo é o seguinte: o usuário envia CPF e senha; o servidor verifica a senha
contra o hash armazenado; em caso de sucesso, emite um token assinado contendo
as reivindicações de identidade, nome e perfil, com validade de oito horas.

A opção pelo token, em lugar de sessão em memória do servidor, atende a dois
requisitos do projeto. Primeiro, a **ausência de estado no servidor** permite
que a aplicação seja replicada horizontalmente sem necessidade de
compartilhamento de sessão, o que sustenta o requisito de escalabilidade
discutido na seção 9. Segundo, o mesmo mecanismo atende navegador e aplicativo
móvel sem adaptação, já que o token trafega em cabeçalho HTTP e não depende de
cookies.

As senhas são armazenadas com **BCrypt**, algoritmo de hash deliberadamente
lento e com sal embutido. Diferentemente de funções como SHA-256, projetadas
para velocidade, o BCrypt impõe custo computacional a cada verificação, o que
torna inviável o teste massivo de combinações em ataques de força bruta. A
senha em texto claro nunca é gravada nem registrada em log.

## 5.4 Segurança

Além da autenticação, foram implementados os seguintes controles:

**Controle de acesso por perfis.** A autorização é aplicada por atributos nos
controladores e verificada no servidor a cada requisição. Um estudante que
alterasse a interface no navegador para exibir opções administrativas ainda
receberia resposta 403 ao tentar utilizá-las, pois a decisão não depende do
cliente.

**Verificação de propriedade do dado.** Além do perfil, endpoints sensíveis
verificam a titularidade. No relatório individual, por exemplo, um estudante
autenticado só obtém o próprio desempenho; a tentativa de consultar o relatório
de outro resulta em 403. A regra impede que o simples conhecimento do CPF alheio
permita o acesso.

**Segregação de segredos.** Durante o desenvolvimento identificou-se que a
chave de assinatura dos tokens e a senha administrativa estavam gravadas no
arquivo de configuração versionado, em repositório público. A correção
consistiu em transferir esses valores para o mecanismo de segredos do usuário
em desenvolvimento e para variáveis de ambiente em produção, além de **rotacionar
a chave comprometida**. Foi ainda acrescentada validação na inicialização: a
aplicação recusa-se a subir se algum segredo estiver ausente ou se a chave de
assinatura tiver menos de 32 bytes, exigência do algoritmo HMAC-SHA256. O
episódio é relatado por constituir aprendizado relevante — a exposição de
segredos em repositório é uma das falhas mais comuns e mais facilmente
exploráveis em projetos acadêmicos e profissionais.

**Proteção do gabarito.** As respostas corretas das avaliações permanecem
exclusivamente no banco de dados. O objeto de transferência enviado ao
estudante não inclui esse campo, e a correção ocorre integralmente no servidor.
A medida impede que o gabarito seja obtido por inspeção do tráfego de rede ou
da memória do aplicativo.

**Auditoria.** Alterações de perfil e de situação cadastral são registradas
automaticamente por gatilho no banco de dados, conforme detalhado na seção 8.

**Atualização de dependência vulnerável.** A análise das dependências
identificou que o pacote `Microsoft.OpenApi` na versão 2.0.0, incluído por
padrão pelo modelo de projeto, apresentava vulnerabilidade de severidade alta
catalogada sob o identificador GHSA-v5pm-xwqc-g5wc. O pacote foi removido e
substituído. A verificação de pacotes vulneráveis foi posteriormente
incorporada ao pipeline de integração contínua descrito na seção 9, de modo que
a checagem passe a ser automática.

## 5.5 Estrutura administrativa

O perfil Secretaria dispõe de painel com as seguintes funcionalidades:

- **Indicadores consolidados** — quantitativos de estudantes, docentes,
  disciplinas e turmas;
- **Gestão de identidades** — cadastro, edição, aprovação e revogação de contas;
- **Matrículas** — vinculação de estudantes a turmas, com validação automática
  de vagas;
- **Auditoria de sessões** — histórico de acessos com data, hora e duração;
- **Relatórios** — desempenho individual e ranking geral.

`[INSERIR FIGURA — Painel da Secretaria]`

## 5.6 Assistente virtual

Uma funcionalidade prevista no PIM III e não implementada naquela etapa foi o
assistente virtual de apoio ao usuário, incorporado nesta fase.

O assistente opera sobre uma **base de conhecimento armazenada no próprio banco
de dados**, composta atualmente por quinze perguntas categorizadas. O
atendimento se dá por correspondência de palavras-chave: a pergunta do usuário
é normalizada — convertida para minúsculas e despida de acentuação — e
comparada com os termos cadastrados; correspondência exata soma três pontos e
correspondência parcial soma um. A resposta de maior pontuação é devolvida,
desde que ultrapasse um limiar mínimo de confiança.

A decisão de **não recorrer a serviços externos de inteligência artificial**
merece registro, por contrariar a tendência atual. Três razões a sustentam:

1. **Proteção de dados.** Perguntas de estudantes podem conter informações
   pessoais. Encaminhá-las a um provedor externo implicaria transferência
   internacional de dados, hipótese que a Lei Geral de Proteção de Dados
   submete a requisitos específicos e que seria desproporcional ao benefício.
2. **Previsibilidade.** Modelos generativos podem produzir respostas
   plausíveis porém incorretas. Em contexto educacional, uma orientação errada
   sobre prazo ou procedimento de matrícula gera prejuízo concreto. A base
   curada garante que toda resposta tenha sido previamente revisada.
3. **Custo e autonomia.** Serviços externos cobram por requisição e dependem de
   disponibilidade de terceiros, comprometendo o requisito de operação
   autônoma da instituição.

Quando não há correspondência confiável, o assistente **declara que não sabe**
e oferece perguntas alternativas, encaminhando o usuário ao canal de contato da
secretaria. O comportamento foi verificado com a pergunta "qual a receita de
bolo de chocolate", diante da qual o sistema corretamente admitiu
desconhecimento em vez de forçar uma resposta.

`[INSERIR FIGURA — Assistente virtual em uso]`

## 5.7 Integração entre módulos

A integração entre a aplicação web, o aplicativo móvel e o banco de dados
ocorre exclusivamente pela interface REST. Não há acesso direto do cliente ao
banco, o que concentra a validação das regras de negócio em um único ponto.

Um efeito prático dessa arquitetura foi observado durante os testes: uma
matéria cadastrada pela interface web tornou-se imediatamente visível no
aplicativo móvel, sem qualquer sincronização adicional — ambos consultam a
mesma fonte.

## 5.8 Correções decorrentes de teste em dispositivo real

O teste da aplicação em telefone celular revelou dois defeitos que não se
manifestavam no ambiente de desenvolvimento:

**Endereço de interface fixo.** O código do front-end apontava para
`http://localhost:5000/api`. O problema é sutil: em um telefone celular,
`localhost` refere-se ao próprio aparelho, e não ao servidor. A porta,
adicionalmente, estava incorreta. A correção substituiu o endereço absoluto por
caminho relativo (`/api`), fazendo com que as requisições sigam para a mesma
origem de onde a página foi servida. Com isso, a aplicação passou a funcionar
sem alteração em qualquer ambiente.

**Sobreposição de elementos na barra superior.** A marca institucional estava
posicionada com `position: absolute` e deslocamento central, o que provocava
sobreposição aos atalhos de navegação em telas estreitas. A correção introduziu
uma consulta de mídia que, abaixo de 640 pixels, devolve o elemento ao fluxo
normal e empilha a barra verticalmente.

Ambos os defeitos correspondem precisamente ao risco antecipado no PIM III, em
que se registrou o "risco de quebra de componentes em telas de smartphones"
para a persona Lucas. O episódio confirma a importância do teste em dispositivo
real: nenhum dos dois problemas apareceria em navegador de computador.

---

# 6 DESENVOLVIMENTO DA SOLUÇÃO MOBILE

*(Disciplina: Desenvolvimento Mobile)*

## 6.1 Tecnologia adotada e justificativa

O aplicativo foi desenvolvido em **React Native**, com o ecossistema **Expo
(SDK 57)**. A decisão exigiu análise, uma vez que a alternativa natural seria
.NET MAUI, mantendo a uniformidade linguística com o restante do projeto.

O fator determinante foi de ordem prática: **compilar aplicações para iOS exige
macOS e Xcode**. Nenhum integrante da equipe dispunha de computador Apple, e o
dispositivo disponível para teste era um iPhone. Nessas condições, o MAUI
permitiria apenas a compilação para Android, restringindo a validação a
emulador. O React Native com Expo contorna a limitação por meio do aplicativo
Expo Go, distribuído pela App Store, que interpreta o código JavaScript
entregue pelo ambiente de desenvolvimento — viabilizando execução em iPhone
real a partir de uma estação Windows.

A contrapartida é a introdução de JavaScript no projeto. Considerou-se aceitável
porque a disciplina de Desenvolvimento Mobile não impõe tecnologia específica, e
porque o alinhamento com .NET permanece assegurado pela camada de serviço, que
é integralmente C#, conforme a seção 7.

## 6.2 Telas principais

O aplicativo é composto por sete telas:

| Tela | Finalidade |
|---|---|
| Login | Autenticação por CPF e senha |
| Início | Indicadores de engajamento e atividades recentes |
| Matérias | Disciplinas e conteúdos, com registro automático de leitura |
| Atividades | Avaliações separadas entre pendentes e concluídas |
| Responder Atividade | Execução da avaliação com barra de progresso |
| Meus Resultados | Histórico de desempenho com representação gráfica |
| Assistente e Acessibilidade | Apoio ao usuário e recursos de inclusão |

`[INSERIR FIGURA — Tela de login do aplicativo]`
`[INSERIR FIGURA — Painel inicial do aplicativo]`
`[INSERIR FIGURA — Matérias e conteúdos]`
`[INSERIR FIGURA — Execução de uma atividade]`

## 6.3 Fluxo de navegação

A navegação combina dois padrões. Um **navegador por abas** na parte inferior
dá acesso às áreas principais — Início, Matérias, Atividades e Resultados —,
enquanto uma **pilha de navegação** trata telas de contexto, como a execução de
uma atividade e o assistente virtual.

A aba Resultados é exibida apenas para o perfil Aluno. Docentes e a secretaria
acompanham desempenho pelos relatórios da aplicação web, mais adequados à
visualização de dados agregados.

O fluxo principal do estudante é o seguinte:

1. Autenticação com CPF e senha;
2. Painel inicial com indicadores e atividades pendentes;
3. Acesso a Matérias e leitura de conteúdo, registrada automaticamente;
4. Execução de atividade, com envio das respostas e retorno imediato do
   resultado;
5. Consulta ao histórico em Meus Resultados.

## 6.4 Autenticação e armazenamento seguro

O token recebido no login é gravado por meio do **expo-secure-store**, que
utiliza o Keychain no iOS e o Keystore no Android. Ambos são serviços do
sistema operacional que cifram o conteúdo e o vinculam ao aplicativo.

A escolha é relevante em contraste com a alternativa comum, o
`AsyncStorage`, que grava os dados **em texto claro** no sistema de arquivos.
Em um aparelho comprometido, um token assim armazenado poderia ser extraído e
utilizado para personificar o usuário durante a validade da sessão.

Ao iniciar, o aplicativo restaura a sessão gravada e **verifica a data de
expiração antes de considerá-la válida**, descartando tokens vencidos. O
procedimento evita que o usuário navegue até receber uma recusa de autorização,
substituindo o erro por um redirecionamento silencioso à tela de login.

## 6.5 Sincronização de dados

O aplicativo mantém **cópia local dos dados consultados**. Cada leitura
bem-sucedida é gravada em armazenamento local junto com o instante da coleta.
Quando uma requisição falha por indisponibilidade de rede, a tela exibe a
última cópia conhecida acompanhada de aviso explícito de que os dados podem
estar desatualizados.

A estratégia adotada é a de **cache com precedência da rede**: tenta-se sempre
obter o dado atualizado, recorrendo à cópia local apenas em caso de falha.
Evita-se, assim, apresentar informação obsoleta quando há conexão disponível.

Cabe distinguir os tipos de falha. Erros de negócio — credencial inválida,
permissão insuficiente — não acionam o cache, pois representam respostas
legítimas do servidor. Somente falhas de rede o fazem. A distinção evita que o
usuário receba dados antigos quando o problema é de outra natureza.

No encerramento da sessão, todo o cache é descartado, impedindo que dados de um
usuário permaneçam acessíveis a outro que utilize o mesmo aparelho.

## 6.6 Integração com a interface de programação

O aplicativo consome os mesmos endpoints da aplicação web, compartilhando
inclusive a base de usuários — as credenciais são idênticas nas duas
plataformas.

A camada de acesso concentra três responsabilidades: montagem das requisições
com injeção automática do token; normalização do envelope de resposta; e
aplicação de tempo limite de quinze segundos, evitando que a interface
permaneça indefinidamente em espera diante de um servidor inacessível.

## 6.7 Acessibilidade no aplicativo

Os recursos descritos na seção 4 foram implementados também no aplicativo:

- Alto contraste e três escalas tipográficas, com preferências persistidas;
- Glossário em Libras com doze termos;
- Rótulos de acessibilidade e papéis semânticos em todos os elementos
  interativos, viabilizando o uso por leitor de tela;
- Alvos de toque com dimensão mínima de 48 pontos.

`[INSERIR FIGURA — Recursos de acessibilidade no aplicativo]`

A captura desta figura revelou um defeito que três revisões do código não
haviam identificado. A paleta de alto contraste substitui a cor de destaque —
o roxo institucional — pelo amarelo, mas o texto sobreposto a essas
superfícies permanecia branco. A razão de contraste resultante era de 1,07:1,
quando a WCAG 2.1 estabelece 4,5:1 como mínimo para texto comum no nível AA.
Cinco componentes eram afetados, entre eles o próprio interruptor de alto
contraste: o texto que descreve o recurso tornava-se ilegível exatamente
quando o recurso era acionado.

A correção introduziu um token cromático específico para texto aplicado sobre
superfícies de destaque, definido separadamente em cada paleta. Na paleta de
alto contraste, o preto sobre amarelo produz razão de 19,6:1.

O episódio é instrutivo por dois motivos. Primeiro, porque o defeito residia
precisamente no recurso destinado a mitigar barreiras visuais — declarar
conformidade não a produz. Segundo, porque nenhuma leitura de código o teria
revelado: as duas cores estavam corretas isoladamente, e apenas a
sobreposição, observada na tela do aparelho, o tornou evidente.

## 6.8 Verificação

A verificação do aplicativo compreendeu duas frentes.

A **compilação do pacote** foi executada a cada alteração relevante, produzindo
o pacote de 859 módulos sem erros. O procedimento detecta importações
inexistentes e erros de sintaxe antes que o código chegue ao dispositivo.

A **execução em dispositivo real** foi realizada em iPhone conectado à mesma
rede local do servidor. Registram-se as dificuldades enfrentadas, por
constituírem aprendizado sobre desenvolvimento móvel:

| Obstáculo | Causa | Solução |
|---|---|---|
| Aparelho não alcançava o servidor | Firewall bloqueando as portas em rede classificada como pública | Regra restrita à sub-rede local |
| Endereço deixou de responder | Endereço IP renovado por DHCP | Atualização da configuração e recomendação de reserva fixa |
| Projeto recusado pelo Expo Go | Divergência entre o SDK do projeto e o suportado pela versão do aplicativo intermediário | Alinhamento do projeto à versão vigente |
| Projeto recusado por falta de autenticação | Aplicativo intermediário autenticado em uma conta, ferramenta de linha de comando anônima | Autenticação da ferramenta na mesma conta |

O segundo obstáculo merece nota: o endereço da estação foi alterado
automaticamente pelo roteador durante o intervalo entre dois testes, fazendo
falhar uma configuração que antes funcionava. A ocorrência ilustra a fragilidade
de ambientes de desenvolvimento apoiados em endereçamento dinâmico.

O terceiro obstáculo ocorreu duas vezes, em sentidos opostos, e por isso
merece registro. O aplicativo intermediário utilizado para executar o projeto
em dispositivo físico é distribuído pela loja da fabricante, que mantém apenas
a versão mais recente. Quando o projeto foi criado, essa versão era anterior à
do projeto, o que exigiu regredir o projeto. Semanas depois, o aplicativo foi
atualizado automaticamente no aparelho e passou a exigir a versão mais nova,
tornando necessário desfazer a regressão. A dependência de um componente cuja
versão não está sob controle da equipe é um risco concreto de indisponibilidade
em demonstrações agendadas, mitigado com a desativação da atualização
automática do aplicativo no aparelho.

---

# 7 ARQUITETURA DE SOFTWARE

*(Disciplina: Programação Aplicada em .NET)*

## 7.1 Situação inicial e motivação

Ao término do PIM III, o sistema encontrava-se organizado em **projeto único**,
com todos os arquivos na raiz do repositório: modelos, contexto de dados,
serviços, controladores e ponto de entrada. A estrutura funcionava, mas
apresentava as limitações típicas dessa organização — ausência de fronteiras
que impedissem, por exemplo, que um controlador acessasse o banco diretamente,
contornando a camada de serviço.

Martin (2019) sustenta que o propósito da arquitetura é **postergar decisões e
preservar opções**, mantendo as regras de negócio independentes de detalhes de
infraestrutura. Sommerville (2019), por sua vez, associa a organização em
camadas ao aumento da manutenibilidade, pela redução do acoplamento entre
componentes.

## 7.2 Organização em camadas

A solução foi reorganizada em **quatro projetos**, com dependências explícitas:

```
SistemaEducacional.slnx
└── src/
    ├── SistemaEducacional.Domain/          (sem dependências)
    │   └── Entities/    — 12 entidades, uma por arquivo
    ├── SistemaEducacional.Infrastructure/  → Domain
    │   └── Data/        — contexto do Entity Framework
    ├── SistemaEducacional.Application/     → Domain, Infrastructure
    │   ├── DTOs/        — 31 objetos de transferência
    │   └── Services/    — 8 serviços de negócio
    └── SistemaEducacional.API/             → Application, Infrastructure
        ├── Controllers/ — 8 controladores
        ├── Program.cs   — configuração e inicialização
        └── wwwroot/     — interface web
```

**Camada de Domínio.** Reúne as entidades que representam os conceitos do
negócio. Não referencia nenhum outro projeto, tampouco bibliotecas de acesso a
dados. A ausência de dependências é intencional: as regras do domínio não devem
mudar porque o banco mudou.

**Camada de Infraestrutura.** Concentra o acesso a dados, por meio do contexto
do Entity Framework, onde estão configurados relacionamentos, chaves compostas
e restrições de unicidade.

**Camada de Aplicação.** Contém os serviços que implementam os casos de uso e
os objetos de transferência. É nesta camada que residem as regras de validação
e a orquestração das operações.

**Camada de Apresentação.** Expõe a interface de programação por meio dos
controladores e serve os arquivos da interface web. Trata exclusivamente de
protocolo HTTP: recebe requisições, delega aos serviços e formata respostas.

A separação entre entidade e objeto de transferência merece destaque por seu
efeito sobre a segurança. A entidade `Usuario` possui o campo `SenhaHash`; o
objeto `UsuarioDto` não. Como os controladores devolvem apenas objetos de
transferência, o hash da senha **não pode ser exposto por descuido** — a
omissão é estrutural, e não fruto de atenção do programador.

## 7.3 Orientação a objetos

A aplicação dos princípios de orientação a objetos manifesta-se em:

**Encapsulamento.** Os serviços expõem métodos que representam operações de
negócio — `MatricularAsync`, `SubmeterAtividadeAsync` — e mantêm privados os
detalhes de sua execução. O controlador desconhece se a operação envolve uma ou
várias consultas.

**Abstração.** Os controladores dependem da assinatura pública dos serviços, e
não de sua implementação. A substituição do Entity Framework por outro mecanismo
de acesso exigiria alterações apenas na camada de Infraestrutura.

**Responsabilidade única.** A divisão do arquivo de modelos original, com 316
linhas e 11 classes, em **doze arquivos independentes**, cada um com uma
entidade, atende ao princípio de que cada unidade deve ter uma única razão para
mudar.

**Injeção de dependência.** Os serviços recebem suas dependências pelo
construtor, registradas no contêiner nativo da plataforma. O padrão elimina o
acoplamento a instâncias concretas e viabiliza a substituição por implementações
de teste.

## 7.4 Modularização

Cada camada constitui um projeto compilado independentemente, e as dependências
são declaradas explicitamente. A consequência prática é que **violações
arquiteturais tornam-se erros de compilação**: uma tentativa de acessar o
contexto de dados a partir da camada de Domínio não compila, pois a referência
não existe.

A tabela a seguir sintetiza a organização resultante:

| Camada | Projetos referenciados | Conteúdo |
|---|---|---|
| Domain | nenhum | 12 entidades |
| Infrastructure | Domain | 1 contexto de dados |
| Application | Domain, Infrastructure | 31 objetos de transferência, 8 serviços |
| API | Application, Infrastructure | 8 controladores, configuração, interface web |

## 7.5 Verificação da refatoração

Uma refatoração dessa amplitude — 36 arquivos movidos ou criados — exige
verificação, pois alterações estruturais podem introduzir defeitos silenciosos.
Após a reorganização, foram executados os seguintes testes:

| Verificação | Resultado |
|---|---|
| Compilação da solução | Bem-sucedida, sem erros ou avisos |
| Inicialização e conexão ao banco | Bem-sucedida |
| Autenticação com emissão de token | Bem-sucedida |
| Consulta a endpoint restrito por perfil | Retorno correto dos registros |
| Interface web estática | Resposta HTTP 200 |
| Documentação interativa | Disponível |

A verificação confirmou que a reorganização preservou o comportamento
observável do sistema — condição que define uma refatoração, por oposição a uma
reescrita.

---

# 8 PROJETO DO BANCO DE DADOS

*(Disciplina: Programação de Banco de Dados)*

## 8.1 Justificativa do modelo relacional

Adotou-se o modelo **relacional**, implementado em Microsoft SQL Server. A
decisão apoia-se na natureza dos dados manipulados: informações acadêmicas são
altamente estruturadas e densamente relacionadas — estudantes vinculam-se a
turmas, turmas a disciplinas, disciplinas a conteúdos e avaliações.

Elmasri e Navathe (2018) observam que a principal vantagem do modelo relacional
está na garantia de integridade referencial pelo próprio gerenciador. No
contexto deste projeto, isso significa que não é possível registrar o resultado
de uma avaliação para um estudante inexistente: a restrição é imposta pelo
banco, independentemente do código que tenta a operação.

Bancos não relacionais ofereceriam maior flexibilidade de esquema, vantagem
pouco relevante aqui, dado que a estrutura acadêmica é estável. Em contrapartida,
exigiriam que a consistência entre entidades fosse assegurada pela aplicação —
justamente o que se pretendia evitar.

Registre-se uma correção em relação ao PIM III: aquele documento apresentava
inconsistência interna, mencionando banco não relacional na introdução e na
conclusão, enquanto a seção técnica descrevia corretamente o modelo relacional.
O sistema sempre utilizou SQL Server; a divergência era de redação.

## 8.2 Modelo conceitual

O modelo conceitual, expresso pela abordagem Entidade-Relacionamento, abstrai
detalhes de implementação e representa apenas as regras do negócio.

`[INSERIR FIGURA — Diagrama Entidade-Relacionamento]`

As cardinalidades principais são:

| Relacionamento | Cardinalidade | Interpretação |
|---|---|---|
| Usuário — Sessão | 1:N | Um usuário inicia nenhuma ou várias sessões; cada sessão pertence a um único usuário |
| Usuário — Turma | N:N | Um estudante cursa várias turmas; uma turma reúne vários estudantes |
| Matéria — Conteúdo | 1:N | Uma disciplina reúne vários conteúdos |
| Atividade — Pergunta | 1:N | Uma avaliação compõe-se de várias questões |
| Pergunta — Alternativa | 1:N | Cada questão oferece várias opções |
| Usuário — Atividade | N:N | Resolvido pela entidade associativa Resultado |
| Usuário — Conteúdo | N:N | Resolvido pela entidade associativa Leitura |

## 8.3 Modelo lógico

O modelo lógico traduz o conceitual em estrutura de tabelas, definindo chaves
primárias e propagando chaves estrangeiras. Os relacionamentos muitos-para-muitos
foram normalizados por tabelas associativas com chave primária composta:
`TurmaAlunos`, que representa a matrícula, e `LeituraConteudos`, que registra o
acompanhamento de leitura.

`[INSERIR FIGURA — Modelo lógico de dados]`

### Normalização

O modelo encontra-se na **Terceira Forma Normal**:

- **1FN** — todos os atributos são atômicos. As alternativas de uma questão,
  por exemplo, ocupam tabela própria, e não uma lista delimitada por vírgulas
  em um único campo;
- **2FN** — nas tabelas de chave composta, os atributos dependem da chave
  integral;
- **3FN** — não há dependências transitivas. O nome do docente não se repete em
  `Materias`: armazena-se o CPF, e o nome é obtido por junção.

Registra-se uma **exceção deliberada**: a tabela `Resultados` armazena
`MateriaId`, valor obtenível pela navegação até `Atividades`. A redundância foi
mantida porque relatórios por disciplina constituem a consulta mais frequente
do sistema, e a supressão de uma junção em cada uma delas compensa o custo de
armazenamento. Trata-se de desnormalização consciente, e não de falha de
modelagem.

## 8.4 Modelo físico

O modelo físico compreende **13 tabelas** e **15 índices** explícitos, definidos
no script `01_schema.sql`.

`[INSERIR FIGURA — Estrutura física das tabelas]`

As estratégias de exclusão foram diferenciadas conforme o significado do dado:

| Estratégia | Aplicação | Justificativa |
|---|---|---|
| `CASCADE` | Conteúdos de uma matéria | O conteúdo não subsiste sem a disciplina |
| `NO ACTION` | Resultados de avaliações | Histórico acadêmico não deve ser apagado por efeito colateral |
| `SET NULL` | Turma de uma atividade | Removida a turma, a atividade torna-se geral em vez de ser destruída |

Os índices foram criados sobre as colunas empregadas em filtros e junções
frequentes. Sem eles, consultas como "disciplinas deste docente" exigiriam
varredura completa da tabela.

## 8.5 Procedimentos armazenados

Foram implementados quatro procedimentos:

| Procedimento | Finalidade |
|---|---|
| `sp_RankingGeral` | Classifica estudantes por aproveitamento, com filtro opcional por disciplina |
| `sp_RelatorioAluno` | Retorna resumo, histórico de avaliações e conteúdos lidos |
| `sp_MatricularAluno` | Efetiva matrícula com validação de perfil, situação e vagas |
| `sp_DesempenhoTurma` | Classifica a turma em faixas de rendimento |

Duas decisões merecem explicação.

A **média é ponderada**, calculada pela razão entre o total de acertos e o total
de questões, e não pela média aritmética dos percentuais. A diferença é
relevante: pela média aritmética, uma avaliação de duas questões pesaria tanto
quanto uma de vinte, distorcendo o resultado.

O procedimento de matrícula emprega os **indicadores de bloqueio `UPDLOCK` e
`HOLDLOCK`** ao contar as vagas ocupadas. Sem eles, duas matrículas simultâneas
poderiam ler a mesma contagem e ambas serem aceitas, ultrapassando o limite —
condição de corrida que só se manifesta sob concorrência e é notoriamente
difícil de diagnosticar em produção.

## 8.6 Gatilhos

Quatro gatilhos transpõem para o banco regras antes existentes apenas em
documentação:

| Gatilho | Regra aplicada |
|---|---|
| `tr_TurmaAlunos_LimiteVagas` | Impede ultrapassar 40 estudantes por turma (**RN01**) |
| `tr_Resultados_Validar` | Rejeita acertos negativos ou superiores ao total de questões |
| `tr_Sessoes_CalcularDuracao` | Calcula a duração da sessão no encerramento |
| `tr_Usuarios_Auditoria` | Registra alterações de perfil e situação (**RN02**) |

A implementação no banco, e não apenas na aplicação, decorre de uma
constatação: a regra deve valer para **qualquer caminho de escrita**. Uma
restrição implementada somente no código da aplicação é contornada por
importação em massa, por script de manutenção ou por acesso direto ao
gerenciador.

## 8.7 Verificação

Os scripts foram aplicados em banco criado do zero — descartado ao final, sem
afetar a base de trabalho — e submetidos a verificação:

| Verificação | Resultado |
|---|---|
| Criação do esquema | 13 tabelas, 95 índices |
| Objetos programáveis | 4 procedimentos, 4 gatilhos, 1 visão |
| Carga inicial | 5 usuários, 1 disciplina, 1 turma, 1 avaliação |
| `sp_RankingGeral` | Classificação correta: 100% e 66,67% |
| `sp_DesempenhoTurma` | Faixas "Destaque" e "Em Progresso" atribuídas corretamente |
| `tr_Resultados_Validar` | Rejeitou acertos = 999 e acertos = −5 |
| `tr_Usuarios_Auditoria` | Registrou as alterações de situação |

O teste mais significativo foi o do limite de vagas: **tentou-se inserir 45
estudantes em uma turma**. O gatilho interrompeu a operação na quadragésima
primeira inserção, e a contagem final permaneceu em exatamente 40. A regra
RN01, que no PIM III era uma linha de tabela, passou a ser restrição
verificável.

A verificação também expôs um defeito de natureza distinta. A carga inicial
gravava as senhas das contas de demonstração a partir de um valor de hash
fixado diretamente no script. As contas eram criadas sem qualquer erro, os
relacionamentos permaneciam íntegros e todas as consultas retornavam os dados
esperados — mas **nenhuma das cinco contas conseguia autenticar**. O hash
utilizado provinha de um exemplo da documentação da biblioteca BCrypt e
correspondia a senha diversa da anunciada nos comentários do próprio script.

O caso é ilustrativo porque o defeito é invisível à inspeção do banco: não há
consulta capaz de revelá-lo, uma vez que o hash é, por construção,
irreversível. Só a tentativa efetiva de autenticação o evidencia. A correção
consistiu em gerar o hash com a mesma biblioteca empregada pela aplicação e
submetê-lo a `Verify()` antes de fixá-lo, procedimento que substitui a
suposição pela verificação.

## 8.8 Script completo

O projeto do banco está organizado em três scripts de execução sequencial:

| Ordem | Arquivo | Conteúdo |
|---|---|---|
| 1 | `01_schema.sql` | Banco, 13 tabelas e 15 índices |
| 2 | `02_procedures_triggers.sql` | Procedimentos, gatilhos, visão e auditoria |
| 3 | `03_carga_inicial.sql` | Dados de demonstração |

Os scripts 2 e 3 são **idempotentes**: podem ser executados repetidamente sem
erro, pois verificam a existência dos objetos antes de criá-los. A propriedade
é necessária para que sejam aplicados automaticamente na implantação, conforme
descrito na seção 9.

---

# 9 INFRAESTRUTURA EM NUVEM E DEVOPS

*(Disciplina EAD: Cloud Computing e DevOps)*

## 9.1 Arquitetura proposta

A arquitetura de implantação proposta organiza-se em quatro camadas:

```
                    ┌─────────────────────────┐
   Usuários  ────►  │   Balanceador / CDN     │   TLS, distribuição de carga
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Contêineres da API     │   2 ou mais instâncias
                    │  (ASP.NET Core)         │   escaláveis horizontalmente
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Banco de dados         │   SQL Server gerenciado
                    │  gerenciado             │   com cópias de segurança
                    └─────────────────────────┘
```

A ausência de estado na aplicação, viabilizada pela autenticação por token
descrita na seção 5, é o que permite replicar as instâncias sem
compartilhamento de sessão.

## 9.2 Serviços utilizados

A solução foi implantada em **Render**, plataforma que oferece publicação
contínua a partir de repositório Git. Alternativas equivalentes seriam Azure
App Service, AWS Elastic Beanstalk ou Google Cloud Run.

A escolha por um modelo de Plataforma como Serviço (PaaS), em detrimento de
Infraestrutura como Serviço (IaaS), considerou o perfil da instituição: não
dispondo de equipe dedicada à administração de servidores, o modelo em que o
provedor assume a manutenção do sistema operacional e do runtime reduz a carga
operacional.

## 9.3 Contêineres

A aplicação foi conteinerizada com **Docker**, empregando construção em
múltiplos estágios:

- **Estágio de compilação** — utiliza a imagem do SDK do .NET (cerca de 800 MB)
  para restaurar dependências e publicar a aplicação;
- **Estágio de execução** — parte da imagem do runtime (cerca de 220 MB) e
  recebe apenas os binários publicados.

A separação resultou em imagem final de **376 MB**. Além da economia de espaço,
a redução diminui a superfície de ataque: o SDK, os compiladores e o
código-fonte não integram a imagem publicada.

A aplicação executa sob **usuário sem privilégios**. Caso seja comprometida, o
invasor não obtém privilégios administrativos dentro do contêiner.

O ambiente completo é descrito em `docker-compose.yml`, que orquestra três
serviços:

1. **banco** — SQL Server, com verificação de disponibilidade que executa uma
   consulta real ao gerenciador;
2. **init-banco** — aplica os três scripts de banco e encerra;
3. **api** — a aplicação, que só inicia após a conclusão bem-sucedida do
   serviço anterior.

A sequência garante que a aplicação nunca encontre um banco inexistente.

`[INSERIR FIGURA — Contêineres em execução]`

## 9.4 Pipeline de integração contínua

Foi configurado um pipeline em **GitHub Actions**, acionado a cada envio de
código ou solicitação de incorporação, composto por três tarefas:

| Tarefa | Verificações |
|---|---|
| API | Restauração, compilação em modo Release com avisos tratados como erro, e varredura de pacotes com vulnerabilidades conhecidas |
| Mobile | Instalação de dependências e compilação do pacote |
| Docker | Construção da imagem, condicionada ao êxito da compilação da API |

O tratamento de avisos como erro impede o acúmulo silencioso de pendências. A
varredura de vulnerabilidades automatiza a verificação que, conduzida
manualmente, identificou o pacote comprometido mencionado na seção 5.

## 9.5 Monitoramento

O monitoramento apoia-se no endpoint `/health`, que verifica não apenas a
resposta da aplicação, mas também **o acesso ao banco de dados**, retornando
código 503 quando este está inacessível.

A distinção é relevante. Uma implementação inicial deste projeto verificava
apenas a presença do runtime — abordagem que se revelou inadequada, pois
reportaria o contêiner como saudável ainda que a aplicação estivesse
inoperante. Um indicador que nunca acusa falha é pior que sua ausência, por
produzir falsa confiança.

A implementação corrigida foi verificada experimentalmente: com o banco em
operação, o endpoint retornou 200; após a interrupção deliberada do contêiner
do banco, passou a retornar 503; restabelecido o serviço, voltou a 200.

## 9.6 Escalabilidade

A escalabilidade horizontal é viabilizada pela ausência de estado na aplicação.
Não havendo sessão em memória, qualquer instância atende qualquer requisição, e
a adição de réplicas não exige coordenação.

Os índices descritos na seção 8 sustentam o desempenho das consultas conforme o
volume cresce. Em cenário de expansão significativa, as medidas seguintes
seriam a introdução de cache distribuído para dados de leitura frequente e a
adoção de réplicas de leitura no banco.

## 9.7 Segurança da infraestrutura

| Medida | Implementação |
|---|---|
| Segredos fora do código | Variáveis de ambiente; nenhum valor sensível versionado |
| Execução sem privilégios | Contêiner executa como usuário comum |
| Superfície reduzida | Imagem final sem SDK, compiladores ou código-fonte |
| Isolamento de rede | Rede dedicada; banco não exposto publicamente |
| Dependências verificadas | Varredura automática no pipeline |
| Persistência dos dados | Volume nomeado, preservado entre reinicializações |

## 9.8 Verificação da implantação

O ambiente conteinerizado foi executado e verificado integralmente:

| Verificação | Resultado |
|---|---|
| Construção da imagem | 376 MB |
| Ordem de inicialização | banco → saudável → scripts → API |
| Aplicação dos scripts | 13 tabelas, 4 procedimentos, 5 usuários |
| Autenticação | Bem-sucedida |
| Consultas autenticadas | Dados retornados corretamente |
| Assistente virtual | Respondeu adequadamente |
| Interface web | Resposta HTTP 200 |
| Verificação de saúde sob falha | 200 → 503 → 200 |

Cabe registrar que a configuração inicial **não funcionou na primeira
execução**. Três defeitos foram identificados e corrigidos: a instrução de
criação de usuário empregava utilitário ausente na imagem base; a verificação
de saúde era inócua, conforme discutido; e a aplicação era iniciada antes da
criação do banco, provocando reinicializações sucessivas. O relato é pertinente
porque evidencia que configuração de infraestrutura não verificada oferece
garantia meramente aparente.

---

# 10 GERENCIAMENTO ÁGIL DO PROJETO

*(Disciplina: Gerenciamento de Projetos Ágil)*

## 10.1 Metodologia adotada

O projeto foi conduzido segundo o framework **Scrum**, em continuidade ao
adotado no PIM III. Schwaber e Sutherland (2020) definem o Scrum como
estrutura leve para desenvolvimento de produtos complexos, apoiada em ciclos
iterativos e inspeção frequente.

A escolha justifica-se pela natureza do trabalho: os requisitos, embora
levantados no PIM III, sofreram ajustes durante a implementação — como a
substituição da tecnologia móvel prevista, discutida na seção 6. Um método
preditivo exigiria replanejamento formal a cada ajuste.

O acompanhamento utilizou quadro **Kanban** na plataforma **Trello**, com
colunas Pendente, Em Andamento, Teste e Concluído.

## 10.2 Papéis

| Papel | Atribuição |
|---|---|
| Product Owner | Priorização do backlog conforme os critérios de avaliação do PIM |
| Scrum Master | Condução das reuniões e remoção de impedimentos |
| Time de Desenvolvimento | Implementação, testes e documentação |

Dada a dimensão da equipe — seis integrantes —, os papéis foram exercidos de
forma compartilhada, com rodízio das responsabilidades de condução.

## 10.3 Product Backlog

O backlog do produto foi derivado das nove etapas exigidas pelo manual e
priorizado segundo dois critérios: peso na avaliação e dependência técnica.

| ID | História de usuário | Prioridade | Estimativa |
|---|---|---|---|
| PB01 | Como desenvolvedor, preciso da arquitetura em camadas para organizar o código | Alta | 8 |
| PB02 | Como administrador, preciso que segredos não fiquem expostos no repositório | Alta | 5 |
| PB03 | Como estudante, quero acessar o sistema pelo celular | Alta | 21 |
| PB04 | Como estudante, quero responder atividades e ver o resultado imediatamente | Alta | 13 |
| PB05 | Como docente, quero acompanhar o desempenho da turma por faixas | Média | 8 |
| PB06 | Como secretaria, quero que o limite de vagas seja respeitado automaticamente | Alta | 5 |
| PB07 | Como usuário, quero tirar dúvidas sem acionar a secretaria | Média | 13 |
| PB08 | Como usuário com deficiência, quero utilizar o sistema com autonomia | Alta | 8 |
| PB09 | Como equipe, queremos reproduzir o ambiente em qualquer máquina | Média | 13 |
| PB10 | Como equipe, queremos que erros sejam detectados antes da entrega | Média | 8 |
| PB11 | Como estudante, quero consultar dados mesmo sem conexão | Baixa | 8 |
| PB12 | Como instituição, queremos rastrear alterações de privilégio | Média | 5 |

As estimativas empregam a sequência de Fibonacci, medida em pontos de história,
representando esforço relativo e não duração absoluta.

## 10.4 Sprints

O desenvolvimento organizou-se em **quatro sprints de duas semanas**.

### Sprint 1 — Fundação e segurança

**Meta:** estabelecer base arquitetural sólida e eliminar vulnerabilidades.

| Item | Descrição | Situação |
|---|---|---|
| PB01 | Divisão em quatro camadas | Concluído |
| PB02 | Migração de segredos e rotação de chave | Concluído |
| — | Configuração do ambiente de desenvolvimento | Concluído |

**Resultado:** solução reorganizada em quatro projetos, compilando sem avisos, com
verificação funcional preservada.

### Sprint 2 — Banco de dados

**Meta:** transpor as regras de negócio para o banco.

| Item | Descrição | Situação |
|---|---|---|
| PB06 | Gatilho de limite de vagas | Concluído |
| PB12 | Gatilho de auditoria | Concluído |
| PB05 | Procedimentos de ranking e desempenho | Concluído |
| — | Consolidação dos scripts e modelos | Concluído |

**Resultado:** 4 procedimentos, 4 gatilhos e 1 visão, verificados em banco criado
do zero.

### Sprint 3 — Aplicação móvel

**Meta:** disponibilizar acesso por dispositivo móvel.

| Item | Descrição | Situação |
|---|---|---|
| PB03 | Aplicativo com autenticação e navegação | Concluído |
| PB04 | Execução de atividades e consulta de resultados | Concluído |
| PB08 | Acessibilidade no aplicativo | Concluído |
| PB11 | Consulta offline | Concluído |

**Resultado:** aplicativo executado em dispositivo real. Registre-se o impedimento
tratado nesta sprint: a incompatibilidade entre a versão do SDK gerada e a
suportada pelo aplicativo de execução, resolvida por regressão de versão.

### Sprint 4 — Assistente virtual e infraestrutura

**Meta:** concluir as funcionalidades pendentes e a infraestrutura.

| Item | Descrição | Situação |
|---|---|---|
| PB07 | Assistente virtual na web e no aplicativo | Concluído |
| PB09 | Conteinerização do ambiente | Concluído |
| PB10 | Pipeline de integração contínua | Concluído |

**Resultado:** ambiente conteinerizado verificado em execução, com três defeitos
identificados e corrigidos.

## 10.5 Cronograma

| Sprint | Período | Entrega |
|---|---|---|
| 1 | Semanas 1 e 2 | Arquitetura em camadas e correção de segurança |
| 2 | Semanas 3 e 4 | Banco de dados completo |
| 3 | Semanas 5 e 6 | Aplicativo móvel |
| 4 | Semanas 7 e 8 | Assistente virtual e infraestrutura |
| — | Semanas 9 e 10 | Documentação e revisão final |

`[INSERIR FIGURA — Quadro Kanban no Trello]`

## 10.6 Definição de pronto

Estabeleceu-se que um item somente é considerado concluído quando satisfaz
todos os critérios:

1. Funcionalidade implementada e compilando sem avisos;
2. Comportamento verificado por execução — não apenas por compilação;
3. Código comentado nos pontos em que a intenção não é evidente;
4. Alterações registradas no controle de versão com mensagem descritiva;
5. Documentação correspondente atualizada.

O segundo critério foi decisivo. Diversos defeitos relatados neste trabalho —
a verificação de saúde inócua, a ordem incorreta de inicialização, o endereço
fixo no front-end — passavam pela compilação sem qualquer indício de problema.
Somente a execução os revelou.

## 10.7 Retrospectiva

**O que funcionou bem.** A priorização por dependência técnica evitou
retrabalho: a arquitetura precedeu as funcionalidades, e o banco precedeu o
aplicativo. A prática de verificar cada entrega por execução revelou defeitos
que a compilação não acusava.

**Dificuldades enfrentadas.** Restrições de ambiente consumiram tempo
significativo — regras de firewall, alteração de endereço por DHCP,
incompatibilidade de versões e política de execução de scripts. São
dificuldades pouco visíveis no planejamento, mas de impacto real sobre o
cronograma.

**Melhorias identificadas.** Verificar antecipadamente a compatibilidade entre
as versões de ferramentas e as suportadas pelos dispositivos de teste; reservar
endereço fixo para a estação de desenvolvimento; e executar toda configuração
de infraestrutura assim que escrita, em vez de postergar a verificação.

---

# 11 CONCLUSÃO

O presente Projeto Integrado Multidisciplinar teve por objetivo desenvolver e
implantar uma solução tecnológica corporativa integrada para apoiar a
transformação digital da instituição Lumina, dando continuidade ao estudo
conduzido no PIM III. Considera-se que o objetivo foi alcançado.

A aplicação web foi construída sobre a plataforma .NET, expondo interface de
programação REST protegida por autenticação baseada em token e controle de
acesso por perfis. O aplicativo móvel, desenvolvido em React Native, consome a
mesma interface e compartilha a base de usuários, assegurando consistência
entre as plataformas. A arquitetura foi reorganizada em quatro camadas com
dependências explícitas, de modo que violações estruturais tornaram-se erros de
compilação. O banco de dados, normalizado até a terceira forma normal, teve as
regras de negócio transpostas para procedimentos e gatilhos. A infraestrutura
foi conteinerizada e submetida a pipeline de integração contínua.

Retomando os objetivos específicos enunciados na introdução, verifica-se que:
os dados foram centralizados em base única; a correção automática eliminou o
intervalo entre a aplicação da avaliação e a divulgação do resultado; os
indicadores de desempenho por faixa foram implementados; o assistente virtual
oferece autoatendimento para dúvidas recorrentes; os recursos de acessibilidade
estão presentes nas duas plataformas; e a digitalização das avaliações reduz o
consumo de papel.

Do ponto de vista da formação, o trabalho evidenciou a articulação entre as
disciplinas do semestre. A arquitetura em camadas, tratada em Programação
Aplicada em .NET, condicionou a organização da aplicação web. A modelagem
estudada em Programação de Banco de Dados materializou-se nos procedimentos e
gatilhos. Os conceitos de Cloud Computing e DevOps orientaram a conteinerização.
O gerenciamento ágil estruturou a condução. E os princípios discutidos na
disciplina de Relações Étnico-Raciais e Afrodescendência traduziram-se em
decisões técnicas verificáveis, e não em declarações genéricas.

Merece destaque particular o aprendizado quanto à **verificação por execução**.
Diversos defeitos relatados ao longo deste documento — a verificação de saúde
que nunca acusaria falha, a ordem incorreta de inicialização dos contêineres, o
endereço fixo que impedia o acesso por dispositivo móvel — atravessaram a
compilação sem qualquer sinal. Foram revelados apenas quando o sistema foi
efetivamente executado no ambiente de destino. A constatação de que **código que
compila não é código que funciona** constitui, possivelmente, a lição mais
transferível para a atuação profissional.

Reconhecem-se limitações. Os benefícios projetados na seção 3 não foram
mensurados, dado tratar-se de instituição simulada; sua aferição exigiria
implantação real e acompanhamento longitudinal. Os recursos de acessibilidade,
embora orientados pelas diretrizes aplicáveis, não foram submetidos a teste com
usuários com deficiência, procedimento indispensável em contexto profissional.
E o sistema não foi submetido a teste de carga que permitisse afirmar seu
comportamento sob volume elevado de acessos simultâneos.

Como desdobramentos futuros, sugerem-se: a implementação de testes
automatizados, ausentes nesta etapa; a submissão dos recursos de acessibilidade
a validação com usuários reais; a incorporação de análise preditiva sobre o
histórico acadêmico, ampliando o tratamento iniciado no PIM III; e a realização
de teste de carga que fundamente as decisões de escalabilidade.

Conclui-se que a integração entre aplicações web e móveis, sustentada por
arquitetura modular e banco de dados consistente, constitui caminho viável para
a modernização tecnológica de instituições de ensino de porte médio. Mais do
que a adoção de tecnologias específicas, o trabalho evidencia que a
transformação digital efetiva depende de decisões arquiteturais que preservem a
integridade da informação, da atenção à inclusão desde a concepção e da
disciplina de verificar aquilo que se afirma ter construído.

---

# REFERÊNCIAS

ELMASRI, Ramez; NAVATHE, Shamkant B. **Sistemas de banco de dados**. 7. ed.
São Paulo: Pearson, 2018.

FOWLER, Martin. **Refatoração: aperfeiçoando o design de códigos existentes**.
2. ed. São Paulo: Novatec, 2020.

GAMMA, Erich et al. **Padrões de projeto: soluções reutilizáveis de software
orientado a objetos**. Porto Alegre: Bookman, 2000.

MARTIN, Robert C. **Arquitetura limpa: o guia do artesão para estrutura e
design de software**. Rio de Janeiro: Alta Books, 2019.

MICROSOFT. **Documentação do ASP.NET Core**. Disponível em:
https://learn.microsoft.com/pt-br/aspnet/core/. Acesso em: 10 ago. 2026.

MICROSOFT. **Documentação do Entity Framework Core**. Disponível em:
https://learn.microsoft.com/pt-br/ef/core/. Acesso em: 10 ago. 2026.

NEWMAN, Sam. **Construindo microsserviços**. 2. ed. São Paulo: Novatec, 2019.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem
profissional**. 8. ed. Porto Alegre: AMGH, 2016.

SCHWABER, Ken; SUTHERLAND, Jeff. **O guia do Scrum: o guia definitivo para o
Scrum: as regras do jogo**. 2020. Disponível em:
https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-PortugueseBR.pdf.
Acesso em: 10 ago. 2026.

SOMMERVILLE, Ian. **Engenharia de software**. 10. ed. São Paulo: Pearson, 2019.

STALLINGS, William. **Criptografia e segurança de redes: princípios e
práticas**. 6. ed. São Paulo: Pearson, 2015.

WORLD WIDE WEB CONSORTIUM. **Web Content Accessibility Guidelines (WCAG) 2.1**.
2018. Disponível em: https://www.w3.org/TR/WCAG21/. Acesso em: 10 ago. 2026.

BRASIL. **Lei nº 13.146, de 6 de julho de 2015**. Institui a Lei Brasileira de
Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência).
Brasília, DF: Presidência da República, 2015.

BRASIL. **Lei nº 13.709, de 14 de agosto de 2018**. Lei Geral de Proteção de
Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018.
