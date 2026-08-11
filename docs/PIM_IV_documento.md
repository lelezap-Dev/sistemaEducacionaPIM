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

> **Nota sobre o andamento**
>
> As seções 5 a 11 (Desenvolvimento Web, Mobile, Arquitetura, Banco de Dados,
> Infraestrutura, Gerenciamento Ágil e Conclusão) estão em elaboração e serão
> acrescentadas na sequência.
