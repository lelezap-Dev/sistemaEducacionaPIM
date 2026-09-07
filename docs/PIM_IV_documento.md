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

# UNIVERSIDADE PAULISTA — UNIP

**Projeto Integrado Multidisciplinar**

**Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas**

<br><br>

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

Instituições desse porte ocupam posição peculiar no segmento privado: são
grandes o bastante para que processos manuais se tornem gargalo, mas não
dispõem de orçamento comparável ao de grandes redes para adquirir sistemas
proprietários, cujo licenciamento costuma ser cobrado por aluno matriculado.

## 2.2 Produtos e serviços

A instituição oferece ensino regular presencial do Fundamental II e do Ensino
Médio, em turmas de até 40 estudantes; acompanhamento pedagógico, com
avaliações periódicas e comunicação de desempenho às famílias; material
didático digital produzido pelo próprio corpo docente; e atendimento
administrativo de matrículas, rematrículas e emissão de documentos escolares.

## 2.3 Estrutura organizacional

A estrutura organiza-se em três níveis. A **direção** responde pelas decisões
estratégicas e pelo orçamento. A **coordenação pedagógica** acompanha o plano
de ensino, orienta os docentes e monitora indicadores de aprendizagem. A
**secretaria acadêmica** executa os processos administrativos e o atendimento
de primeiro nível aos usuários dos sistemas internos. Sob a coordenação atua o
corpo docente, responsável por aulas, material, avaliações e lançamento de
notas; o corpo discente é o público final dos serviços.

Essa divisão relaciona-se diretamente com o controle de acesso adotado no
sistema, apresentado na seção 5, no qual os privilégios foram segmentados nos
perfis Secretaria, Professor e Aluno.

## 2.4 Principais processos

Quatro processos são centrais. A **matrícula e alocação** era conduzida em
planilhas, sem validação automática do limite de vagas. A **gestão de conteúdo
pedagógico** distribuía material por meios heterogêneos — mensageiros,
correio eletrônico e cópias impressas —, sem repositório central. A
**avaliação** aplicava provas em papel, com correção manual e transcrição para
planilhas, levando até duas semanas entre a aplicação e a divulgação. O
**acompanhamento gerencial** dependia de levantamentos produzidos manualmente
a partir das planilhas dos docentes.

## 2.5 Problemas identificados

A análise conduzida no PIM III identificou seis problemas, aqui retomados por
constituírem a justificativa da solução. A **dispersão da informação** entre
planilhas, impressos e mensagens pessoais elimina a fonte única de consulta e
produz divergência entre registros. A **comunicação fragmentada** decorre da
ausência de canal institucional único, gerando perda de prazos e retrabalho. A
**ausência de indicadores** consolidados impede identificar tempestivamente
estudantes com baixo rendimento, restringindo a atuação pedagógica ao caráter
corretivo. A **sobrecarga administrativa** concentra na secretaria tarefas
repetitivas — sobretudo recuperação de senha e dúvidas operacionais — que
consomem tempo qualificado sem agregar valor. O **consumo de papel** decorre
da impressão recorrente de avaliações e comunicados. As **barreiras de
acessibilidade** impedem o uso autônomo dos sistemas por pessoas com
deficiência visual ou auditiva.

## 2.6 Oportunidades de melhoria por meio da tecnologia

Do diagnóstico decorrem as oportunidades que orientaram as decisões técnicas
descritas nos capítulos seguintes:

| Problema identificado | Oportunidade tecnológica | Seção correspondente |
|---|---|---|
| Dispersão da informação | Banco de dados relacional único, normalizado e íntegro | 8 |
| Comunicação fragmentada | Plataforma web e móvel com base de dados compartilhada | 5 e 6 |
| Ausência de indicadores | Painéis com indicadores e classificação automática de desempenho | 5 |
| Sobrecarga administrativa | Assistente virtual para dúvidas recorrentes e autoatendimento | 5 |
| Consumo de papel | Digitalização de avaliações e materiais didáticos | 5 |
| Barreiras de acessibilidade | Recursos de acessibilidade nas duas plataformas | 4 |

A solução não pretende substituir a atuação humana, mas eliminar o trabalho
repetitivo que hoje a consome.

---

# 3 PLANEJAMENTO DA SOLUÇÃO TECNOLÓGICA

*(Disciplina: Empreendedorismo em Tecnologia da Informação)*

## 3.1 Problema a ser resolvido

O problema central pode ser assim enunciado: **a instituição Lumina não dispõe
de um ambiente digital unificado que integre os processos acadêmicos e
administrativos, o que provoca dispersão de informações, retrabalho e ausência
de indicadores para a tomada de decisão pedagógica.**

Trata-se de problema de integração, e não de falta de ferramentas. A
instituição utiliza planilhas, mensageiros e correio eletrônico, cada qual
resolvendo bem uma tarefa isolada; o conjunto, porém, não constitui um
sistema, pois os dados não circulam entre eles e exigem transcrição manual a
cada etapa.

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
PIM III pela técnica de personas e aqui retomados por terem orientado as
decisões de projeto. Os **estudantes** (cerca de 800) são representados pela
persona Lucas, 16 anos, com alta familiaridade tecnológica e acesso
predominante por telefone celular; necessita consultar materiais, acompanhar
prazos e verificar desempenho. Os **docentes** (cerca de 45) são
representados por Mariana, 34 anos, professora de Matemática, cuja rotina se
divide entre planejamento, correção e aulas; necessita publicar materiais com
agilidade e identificar estudantes com dificuldade. A **equipe
administrativa** (cerca de 12) é representada por Carla, 45 anos, da
secretaria, que cadastra usuários, efetiva matrículas, emite relatórios e
resolve problemas de acesso.

A predominância do acesso móvel entre estudantes justificou o aplicativo
descrito na seção 6 e a revisão da responsividade da aplicação web.

## 3.4 Proposta de valor

A proposta articula-se em quatro elementos. A **unificação** faz com que uma
única base alimente a aplicação web e o aplicativo, tornando imediatamente
disponível em uma plataforma o que se registra na outra. O **imediatismo** da
correção automática converte um processo de até duas semanas em resultado
instantâneo, permitindo intervenção pedagógica enquanto o conteúdo ainda está
sendo trabalhado. A **visibilidade** dada por indicadores consolidados e pela
classificação automática por faixa de rendimento desloca a atuação da
coordenação do caráter corretivo para o preventivo. A **inclusão**, por fim,
assegura que a modernização alcance também os usuários habitualmente
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
indicadores acima são parâmetros propostos para aferição em implantação real,
não resultados mensurados.

## 3.6 Diferenciais competitivos

Quatro diferenciais distinguem a solução das alternativas de mercado. Não há
**licenciamento por usuário**: sistemas acadêmicos comerciais cobram
mensalidade proporcional ao número de matriculados, ao passo que a solução
emprega apenas tecnologias sem custo de licença, tornando o custo de operação
independente do porte da instituição. Há **autonomia em relação a serviços
externos**, pois o assistente virtual opera sobre base de conhecimento própria
— o que elimina custo por requisição e, diante da Lei Geral de Proteção de
Dados, evita que dados de estudantes trafeguem para fora da instituição. A
**acessibilidade é nativa**, incorporada desde a concepção e presente
igualmente nas duas plataformas. E a **portabilidade** conferida pela
conteinerização descrita na seção 9 permite implantar a solução em servidor
próprio ou em provedor de nuvem, sem dependência de fornecedor específico.

---

# 4 RESPONSABILIDADE SOCIAL E DIVERSIDADE

*(Disciplina EAD: Relações Étnico-Raciais e Afrodescendência)*

## 4.1 Combate à discriminação

O combate à discriminação foi tratado como conjunto de decisões técnicas
verificáveis, e não como declaração de princípios.

A **identificação emprega dado objetivo**: a autenticação usa o Cadastro de
Pessoa Física, e o sistema não coleta informações de raça, religião,
orientação sexual ou origem — ao não registrá-las, elimina-se a possibilidade
de que sejam empregadas, ainda que involuntariamente, como critério de
diferenciação. Os **critérios de avaliação são uniformes**, pois a correção
compara a resposta assinalada com o gabarito armazenado, procedimento idêntico
para todos e independente de julgamento humano, o que afasta vieses
inconscientes. A **segregação de privilégios** faz o escopo de visualização
decorrer apenas da função exercida — um docente vê somente suas turmas; um
estudante, apenas seu desempenho — e a regra é aplicada no servidor, não
podendo ser contornada pela manipulação da interface. Por fim, a
**rastreabilidade** garantida pelo gatilho de auditoria da seção 8 registra
toda alteração de perfil ou situação cadastral com valor anterior, valor novo
e momento, tornando auditável eventual tratamento diferenciado.

## 4.2 Valorização da diversidade

A valorização da diversidade parte do reconhecimento de que os usuários
acessam o sistema em condições materiais desiguais.

Quanto aos **dispositivos**, a persona Lucas acessa a internet
predominantemente por telefone celular — realidade de parcela expressiva dos
estudantes brasileiros —, o que motivou tanto o aplicativo quanto a correção
da responsividade da aplicação web. Quanto às **condições de conexão**, o
aplicativo mantém cópia local dos dados consultados, permitindo consultar
matérias, conteúdos e resultados já carregados mesmo sem conexão, com aviso
explícito de que podem estar desatualizados; a funcionalidade reconhece que o
acesso contínuo à internet não é condição universal. Quanto ao **repertório
tecnológico**, o assistente virtual responde em linguagem corrente e admite
variações de escrita, desconsiderando acentos e diferenças entre maiúsculas e
minúsculas, o que beneficia usuários com menor familiaridade tecnológica.

## 4.3 Recursos tecnológicos inclusivos

Cinco recursos foram implementados, disponíveis nas duas plataformas. O **modo
de alto contraste** substitui a paleta por combinação de maior razão de
contraste, com a preferência persistida entre sessões. As **escalas
tipográficas** oferecem três níveis progressivos de ampliação, aplicados sem
quebra do alinhamento. O **glossário em Língua Brasileira de Sinais** relaciona
termos acadêmicos recorrentes à descrição do respectivo sinal, tendo sido
ampliado dos três termos do PIM III para doze. A **rotulação para leitores de
tela** atribuiu a todos os elementos interativos do aplicativo rótulos e papéis
semânticos, permitindo navegação por tecnologia assistiva. E o
**dimensionamento dos alvos de toque** observa o mínimo de 48 pontos,
beneficiando usuários com limitação de coordenação motora.

## 4.4 Ações voltadas à acessibilidade

As ações adotadas orientaram-se pelas Diretrizes de Acessibilidade para
Conteúdo Web (WCAG) e pela Lei Brasileira de Inclusão da Pessoa com Deficiência
(Lei nº 13.146/2015), cujo artigo 63 estabelece a obrigatoriedade de
acessibilidade em sítios eletrônicos. O quadro relaciona cada ação ao
princípio correspondente:

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

A dimensão cidadã expressa-se em três frentes. A **transparência do
desempenho** dá ao estudante acesso direto ao histórico de avaliações, com
acertos e percentual de cada uma; a informação deixa de ser mediada
exclusivamente pela instituição, condição para que o estudante acompanhe e
questione a própria trajetória. A **autonomia no acesso**, viabilizada pela
recuperação de senha por palavra-chave e pelo assistente virtual, reduz a
dependência de intermediação administrativa em tarefas rotineiras —
especialmente relevante para famílias com menor disponibilidade de
deslocamento. E a **sustentabilidade ambiental** decorre da digitalização de
avaliações e materiais: para 800 estudantes submetidos a avaliações
periódicas, a economia projetada é da ordem de milhares de folhas por período
letivo.

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
REST**, no qual um único processo atende as requisições da interface e do
aplicativo móvel. A opção pelo monólito foi deliberada: Newman (2019) adverte
que a decomposição prematura em serviços introduz complexidade de rede, de
implantação e de observabilidade que raramente se justifica em domínio único e
equipe pequena. Para cerca de 800 usuários e seis desenvolvedores, o monólito
bem estruturado em camadas oferece simplicidade operacional sem comprometer a
organização interna do código, tema da seção 7.

O servidor embutido, Kestrel, atende as requisições e serve os arquivos
estáticos da interface. Servir o front-end pela mesma aplicação eliminou uma
classe inteira de problemas: como página e interface de programação
compartilham origem, as chamadas usam caminho relativo e a aplicação funciona
sem alteração em qualquer endereço.

`[INSERIR FIGURA — Tela de login da aplicação web]`

## 5.2 Interface de programação REST

A interface expõe **48 endpoints** distribuídos em oito controladores, cada um
responsável por um agregado do domínio:

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

Todas as respostas seguem envelope uniforme — `{ "sucesso": true, "dados": {…} }`
em caso de êxito e `{ "sucesso": false, "mensagem": "…" }` em caso de falha —,
padronização que permitiu ao front-end web e ao aplicativo móvel implementarem
um único ponto de tratamento de erros, em vez de verificar cada chamada
individualmente.

## 5.3 Autenticação

A autenticação emprega **JSON Web Token (JWT)**, padrão definido pela RFC 7519.
O fluxo é o seguinte: o usuário envia CPF e senha; o servidor verifica a senha
contra o hash armazenado; em caso de sucesso, emite um token assinado contendo
as reivindicações de identidade, nome e perfil, com validade de oito horas.

A opção pelo token, em lugar de sessão em memória, atende a dois requisitos. A
**ausência de estado no servidor** permite replicar a aplicação
horizontalmente sem compartilhamento de sessão, sustentando a escalabilidade
discutida na seção 9; e o mesmo mecanismo atende navegador e aplicativo sem
adaptação, já que o token trafega em cabeçalho HTTP e não depende de cookies.

As senhas são armazenadas com **BCrypt**, algoritmo de hash deliberadamente
lento e com sal embutido. Diferentemente de funções como SHA-256, projetadas
para velocidade, o BCrypt impõe custo computacional a cada verificação,
inviabilizando o teste massivo de combinações. A senha em texto claro nunca é
gravada nem registrada em log.

## 5.4 Segurança

Além da autenticação, seis controles foram implementados. O **controle de
acesso por perfis** é aplicado por atributos nos controladores e verificado no
servidor a cada requisição: um estudante que alterasse a interface no navegador
para exibir opções administrativas ainda receberia resposta 403, pois a decisão
não depende do cliente. A **verificação de propriedade do dado** acrescenta a
titularidade ao perfil — no relatório individual, o estudante obtém apenas o
próprio desempenho, e consultar o de outro resulta em 403, impedindo que o
simples conhecimento do CPF alheio dê acesso. A **proteção do gabarito** mantém
as respostas corretas exclusivamente no banco: o objeto enviado ao estudante
não inclui esse campo e a correção ocorre no servidor, o que impede obtê-lo por
inspeção do tráfego. A **auditoria** registra alterações de perfil e situação
cadastral por gatilho, conforme a seção 8.

A **segregação de segredos** merece relato mais detido. Identificou-se que a
chave de assinatura dos tokens e a senha administrativa estavam gravadas em
arquivo de configuração versionado, em repositório público. A correção
transferiu esses valores para o mecanismo de segredos do usuário, em
desenvolvimento, e para variáveis de ambiente, em produção, além de
**rotacionar a chave comprometida**. Acrescentou-se validação na inicialização:
a aplicação recusa-se a subir se algum segredo estiver ausente ou se a chave
tiver menos de 32 bytes, exigência do HMAC-SHA256. A exposição de segredos em
repositório é uma das falhas mais comuns e mais facilmente exploráveis em
projetos acadêmicos e profissionais.

Por fim, a **atualização de dependência vulnerável**: o pacote
`Microsoft.OpenApi` 2.0.0, incluído por padrão pelo modelo de projeto,
apresentava vulnerabilidade de severidade alta catalogada sob
GHSA-v5pm-xwqc-g5wc. O pacote foi removido, e a verificação de pacotes
vulneráveis passou a integrar o pipeline descrito na seção 9.

## 5.5 Estrutura administrativa

O perfil Secretaria dispõe de painel com indicadores consolidados de
estudantes, docentes, disciplinas e turmas; gestão de identidades, incluindo
cadastro, aprovação e revogação de contas; matrículas com validação automática
de vagas; auditoria de sessões com data, hora e duração; e relatórios de
desempenho individual e ranking geral.

`[INSERIR FIGURA — Painel da Secretaria]`

## 5.6 Assistente virtual

O assistente virtual, previsto no PIM III e não implementado naquela etapa, foi
incorporado nesta fase. Opera sobre **base de conhecimento armazenada no
próprio banco de dados**, com quinze perguntas categorizadas. O atendimento se
dá por correspondência de palavras-chave: a pergunta é normalizada —
convertida para minúsculas e despida de acentuação — e comparada com os termos
cadastrados, somando três pontos por correspondência exata e um por parcial; a
resposta de maior pontuação é devolvida, desde que ultrapasse um limiar mínimo
de confiança.

A decisão de **não recorrer a serviços externos de inteligência artificial**
merece registro, por contrariar a tendência atual. Sustentam-na três razões. A
**proteção de dados**: perguntas de estudantes podem conter informações
pessoais, e encaminhá-las a provedor externo implicaria transferência
internacional de dados, hipótese que a Lei Geral de Proteção de Dados submete a
requisitos específicos e que seria desproporcional ao benefício. A
**previsibilidade**: modelos generativos produzem respostas plausíveis porém
incorretas, e em contexto educacional uma orientação errada sobre prazo ou
matrícula gera prejuízo concreto, enquanto a base curada garante que toda
resposta tenha sido revisada. E o **custo e a autonomia**: serviços externos
cobram por requisição e dependem de disponibilidade de terceiros,
comprometendo o requisito de operação autônoma da instituição.

Quando não há correspondência confiável, o assistente **declara que não sabe**
e oferece perguntas alternativas, encaminhando o usuário ao canal de contato da
secretaria. O comportamento foi verificado com a pergunta "qual a receita de
bolo", diante da qual o sistema corretamente admitiu desconhecimento e
apresentou quatro perguntas pertinentes ao domínio acadêmico, em vez de
forçar uma resposta.

`[INSERIR FIGURA — Assistente virtual em uso]`

## 5.7 Integração entre módulos

A integração entre a aplicação web, o aplicativo móvel e o banco ocorre
exclusivamente pela interface REST. Não há acesso direto do cliente ao banco,
o que concentra a validação das regras de negócio em um único ponto. Um efeito
prático foi observado nos testes: uma matéria cadastrada pela interface web
tornou-se imediatamente visível no aplicativo, sem sincronização adicional —
ambos consultam a mesma fonte.

## 5.8 Correções decorrentes de teste em dispositivo real

O teste em telefone celular revelou dois defeitos ausentes no ambiente de
desenvolvimento. O primeiro era um **endereço de interface fixo**: o front-end
apontava para `http://localhost:5000/api`, e em um celular `localhost` refere-se
ao próprio aparelho, não ao servidor — a porta, ademais, estava incorreta. A
correção substituiu o endereço absoluto por caminho relativo (`/api`), fazendo
as requisições seguirem para a mesma origem da página. O segundo era a
**sobreposição de elementos na barra superior**: a marca institucional usava
`position: absolute` com deslocamento central e cobria os atalhos de navegação
em telas estreitas; uma consulta de mídia devolve o elemento ao fluxo normal
abaixo de 640 pixels.

Ambos correspondem ao risco antecipado no PIM III, que registrara o "risco de
quebra de componentes em telas de smartphones" para a persona Lucas. Nenhum
dos dois apareceria em navegador de computador.

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

A contrapartida é a introdução de JavaScript no projeto, considerada aceitável
porque a disciplina não impõe tecnologia específica e porque o alinhamento com
.NET permanece assegurado pela camada de serviço, integralmente C#.

## 6.2 Telas principais

O aplicativo compõe-se de sete telas: **Login**, com autenticação por CPF e
senha; **Início**, com indicadores de engajamento e atividades recentes;
**Matérias**, que apresenta disciplinas e conteúdos com registro automático de
leitura; **Atividades**, separando pendentes de concluídas; **Responder
Atividade**, com barra de progresso; **Meus Resultados**, com o histórico de
desempenho; e **Assistente e Acessibilidade**, que reúne o apoio ao usuário e
os recursos de inclusão.

`[INSERIR FIGURA — Tela de login do aplicativo]`
`[INSERIR FIGURA — Painel inicial do aplicativo]`
`[INSERIR FIGURA — Matérias e conteúdos]`
`[INSERIR FIGURA — Execução de uma atividade]`

## 6.3 Fluxo de navegação

A navegação combina dois padrões. Um **navegador por abas** na parte inferior
dá acesso às áreas principais — Início, Matérias, Atividades e Resultados —,
enquanto uma **pilha de navegação** trata telas de contexto, como a execução de
uma atividade e o assistente virtual.

A aba Resultados é exibida apenas ao perfil Aluno; docentes e secretaria
acompanham desempenho pelos relatórios da aplicação web, mais adequados a
dados agregados. O fluxo principal do estudante percorre a autenticação por
CPF e senha, o painel inicial com indicadores e atividades pendentes, o acesso
a Matérias com registro automático de leitura, a execução da atividade com
retorno imediato do resultado e, por fim, a consulta ao histórico.

## 6.4 Autenticação e armazenamento seguro

O token recebido no login é gravado pelo **expo-secure-store**, que utiliza o
Keychain no iOS e o Keystore no Android — serviços do sistema operacional que
cifram o conteúdo e o vinculam ao aplicativo. A escolha contrasta com a
alternativa comum, o `AsyncStorage`, que grava **em texto claro** no sistema de
arquivos: em aparelho comprometido, um token assim armazenado poderia ser
extraído e usado para personificar o usuário durante a validade da sessão.

Ao iniciar, o aplicativo restaura a sessão e **verifica a data de expiração
antes de considerá-la válida**, descartando tokens vencidos e substituindo a
eventual recusa de autorização por redirecionamento silencioso ao login.

## 6.5 Sincronização de dados

O aplicativo mantém **cópia local dos dados consultados**, gravando cada
leitura bem-sucedida junto com o instante da coleta. Falhando a requisição por
indisponibilidade de rede, a tela exibe a última cópia conhecida com aviso
explícito de possível desatualização. A estratégia é a de **cache com
precedência da rede**: tenta-se sempre o dado atualizado, recorrendo à cópia
local apenas em caso de falha.

Cabe distinguir os tipos de falha. Erros de negócio — credencial inválida,
permissão insuficiente — não acionam o cache, por serem respostas legítimas do
servidor; somente falhas de rede o fazem. No encerramento da sessão todo o
cache é descartado, impedindo que dados de um usuário permaneçam acessíveis a
outro que utilize o mesmo aparelho.

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
alto contraste e três escalas tipográficas com preferências persistidas;
glossário em Libras com doze termos; rótulos de acessibilidade e papéis
semânticos em todos os elementos interativos, viabilizando leitor de tela; e
alvos de toque de no mínimo 48 pontos.

`[INSERIR FIGURA — Recursos de acessibilidade no aplicativo]`

A captura desta figura revelou um defeito que três revisões do código não
haviam identificado. A paleta de alto contraste substitui a cor de destaque
pelo amarelo, mas o texto sobreposto a essas superfícies permanecia branco,
produzindo razão de contraste de 1,07:1 quando a WCAG 2.1 exige 4,5:1 no nível
AA. Cinco componentes eram afetados, entre eles o próprio interruptor de alto
contraste: o texto que descreve o recurso tornava-se ilegível exatamente
quando o recurso era acionado. A correção introduziu um token cromático
específico para texto sobre superfícies de destaque, definido por paleta; em
alto contraste, o preto sobre amarelo rende 19,6:1.

O episódio é instrutivo porque o defeito residia justamente no recurso
destinado a mitigar barreiras visuais — declarar conformidade não a produz — e
porque nenhuma leitura de código o revelaria: as duas cores estavam corretas
isoladamente, e só a sobreposição, observada na tela do aparelho, o evidenciou.

## 6.8 Verificação

A verificação compreendeu duas frentes. A **compilação do pacote**, executada a
cada alteração relevante, produziu sem erros o pacote de 2,2 MB destinado ao
dispositivo, detectando importações inexistentes e erros de sintaxe antes que o
código chegasse ao aparelho. A **execução em dispositivo real** foi feita em
iPhone conectado à mesma rede local do servidor; registram-se as dificuldades
enfrentadas, por constituírem aprendizado sobre desenvolvimento móvel:

O aparelho não alcançava o servidor porque o firewall bloqueava as portas em
rede classificada como pública, resolvido por regra restrita à sub-rede local.
O endereço deixou de responder após renovação por DHCP, corrigido pela
atualização da configuração e pela recomendação de reserva fixa. O projeto foi
recusado pelo aplicativo intermediário por divergência de SDK, resolvida pelo
alinhamento à versão vigente, e novamente por falta de autenticação, já que o
aplicativo estava vinculado a uma conta enquanto a ferramenta de linha de
comando permanecia anônima.

O segundo obstáculo ilustra a fragilidade de ambientes apoiados em
endereçamento dinâmico: o endereço da estação foi alterado pelo roteador no
intervalo entre dois testes, fazendo falhar uma configuração que antes
funcionava.

O terceiro ocorreu duas vezes, em sentidos opostos. O aplicativo intermediário
usado para executar o projeto em dispositivo físico é distribuído pela loja da
fabricante, que mantém apenas a versão mais recente. Quando o projeto foi
criado, essa versão era anterior à dele, o que exigiu regredi-lo; semanas
depois, o aplicativo atualizou-se automaticamente e passou a exigir a versão
mais nova, tornando necessário desfazer a regressão. A dependência de um
componente cuja versão não está sob controle da equipe é risco concreto de
indisponibilidade em demonstrações agendadas, mitigado com a desativação da
atualização automática no aparelho.

---

# 7 ARQUITETURA DE SOFTWARE

*(Disciplina: Programação Aplicada em .NET)*

## 7.1 Situação inicial e motivação

Ao término do PIM III, o sistema estava organizado em **projeto único**, com
modelos, contexto de dados, serviços, controladores e ponto de entrada na raiz
do repositório. A estrutura funcionava, mas não impunha fronteiras: nada
impedia que um controlador acessasse o banco diretamente, contornando a camada
de serviço.

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

A **camada de Domínio** reúne as entidades do negócio e não referencia nenhum
outro projeto nem bibliotecas de acesso a dados — ausência intencional, pois as
regras do domínio não devem mudar porque o banco mudou. A **Infraestrutura**
concentra o acesso a dados pelo contexto do Entity Framework, onde se
configuram relacionamentos, chaves compostas e restrições de unicidade. A
**Aplicação** contém os serviços que implementam os casos de uso, os objetos de
transferência, as validações e a orquestração das operações. A
**Apresentação** expõe a interface de programação e serve os arquivos da
interface web, tratando exclusivamente de protocolo HTTP.

A separação entre entidade e objeto de transferência tem efeito direto sobre a
segurança: a entidade `Usuario` possui o campo `SenhaHash`, e o objeto
`UsuarioDto` não. Como os controladores devolvem apenas objetos de
transferência, o hash **não pode ser exposto por descuido** — a omissão é
estrutural, e não fruto de atenção do programador.

## 7.3 Orientação a objetos

Os princípios de orientação a objetos manifestam-se em quatro pontos. O
**encapsulamento** faz os serviços exporem métodos que representam operações de
negócio — `MatricularAsync`, `SubmeterAtividadeAsync` — mantendo privados os
detalhes de execução, de modo que o controlador desconhece quantas consultas a
operação envolve. A **abstração** faz os controladores dependerem da assinatura
pública dos serviços, e não da implementação: substituir o Entity Framework por
outro mecanismo exigiria alterar apenas a Infraestrutura. A **responsabilidade
única** levou à divisão do arquivo de modelos original, com 316 linhas e 11
classes, em doze arquivos independentes. E a **injeção de dependência**, com os
serviços recebendo suas dependências pelo construtor a partir do contêiner
nativo, elimina o acoplamento a instâncias concretas e viabiliza substituí-las
por implementações de teste.

## 7.4 Modularização

Cada camada é um projeto compilado independentemente, com dependências
declaradas explicitamente. A consequência prática é que **violações
arquiteturais tornam-se erros de compilação**: acessar o contexto de dados a
partir do Domínio não compila, pois a referência não existe.

## 7.5 Verificação da refatoração

Uma refatoração dessa amplitude — 36 arquivos movidos ou criados — exige
verificação, pois alterações estruturais introduzem defeitos silenciosos. Após
a reorganização, verificou-se que a solução compila sem erros nem avisos, que a
aplicação inicia e conecta ao banco, que a autenticação emite token válido, que
endpoints restritos por perfil retornam corretamente os registros, que a
interface web responde com HTTP 200 e que a documentação interativa permanece
disponível.

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

Bancos não relacionais ofereceriam maior flexibilidade de esquema — vantagem
pouco relevante aqui, dado que a estrutura acadêmica é estável — mas exigiriam
que a consistência entre entidades fosse assegurada pela aplicação, justamente
o que se pretendia evitar.

Registre-se uma correção quanto ao PIM III: aquele documento mencionava banco
não relacional na introdução e na conclusão, enquanto a seção técnica descrevia
corretamente o modelo relacional. O sistema sempre utilizou SQL Server; a
divergência era de redação.

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

O modelo encontra-se na **Terceira Forma Normal**. Na **1FN**, todos os
atributos são atômicos: as alternativas de uma questão ocupam tabela própria, e
não uma lista delimitada por vírgulas em um único campo. Na **2FN**, nas
tabelas de chave composta, os atributos dependem da chave integral. Na **3FN**,
não há dependências transitivas — o nome do docente não se repete em
`Materias`, onde se armazena o CPF, obtendo-se o nome por junção.

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
o esquema criou 13 tabelas e 15 índices explícitos; os objetos programáveis
somaram 4 procedimentos, 4 gatilhos e 1 visão; a carga inicial inseriu 5
usuários, 1 disciplina, 1 turma e 1 avaliação. O `sp_RankingGeral` classificou
corretamente em 100% e 66,67%; o `sp_DesempenhoTurma` atribuiu as faixas
"Destaque" e "Em Progresso"; o `tr_Resultados_Validar` rejeitou acertos iguais a
999 e a −5; e o `tr_Usuarios_Auditoria` registrou as alterações de situação.

O teste mais significativo foi o do limite de vagas: **tentou-se inserir 45
estudantes em uma turma**. O gatilho interrompeu a operação na quadragésima
primeira inserção, e a contagem final permaneceu em exatamente 40. A regra
RN01, que no PIM III era uma linha de tabela, passou a ser restrição
verificável.

A verificação também expôs defeito de natureza distinta. A carga inicial
gravava as senhas das contas de demonstração a partir de um hash fixado no
script. As contas eram criadas sem erro, os relacionamentos permaneciam
íntegros e as consultas retornavam os dados esperados — mas **nenhuma das cinco
contas conseguia autenticar**: o hash provinha de um exemplo da documentação da
biblioteca BCrypt e correspondia a senha diversa da anunciada nos comentários
do próprio script.

O caso é ilustrativo porque o defeito é invisível à inspeção do banco — o hash
é, por construção, irreversível, e nenhuma consulta o revelaria; só a tentativa
efetiva de autenticação o evidencia. A correção gerou o hash com a mesma
biblioteca empregada pela aplicação e o submeteu a `Verify()` antes de fixá-lo,
substituindo a suposição pela verificação.

## 8.8 Script completo

O projeto do banco organiza-se em três scripts sequenciais: `01_schema.sql`,
que cria o banco, as 13 tabelas e os 15 índices; `02_procedures_triggers.sql`,
com os procedimentos, gatilhos, visão e tabela de auditoria; e
`03_carga_inicial.sql`, com os dados de demonstração.

Os scripts 2 e 3 são **idempotentes**: executam repetidamente sem erro, pois
verificam a existência dos objetos antes de criá-los — propriedade necessária
para a aplicação automática descrita na seção 9.

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

A plataforma escolhida para a implantação é o **Render**, que oferece
publicação contínua a partir de repositório Git. Alternativas equivalentes
seriam Azure App Service, AWS Elastic Beanstalk ou Google Cloud Run.

A escolha por um modelo de Plataforma como Serviço (PaaS), em detrimento de
Infraestrutura como Serviço (IaaS), considerou o perfil da instituição: não
dispondo de equipe dedicada à administração de servidores, o modelo em que o
provedor assume a manutenção do sistema operacional e do runtime reduz a carga
operacional.

Cabe registrar uma limitação, cuja omissão comprometeria a honestidade do
relato. Uma versão anterior do sistema, correspondente ao estágio do PIM III,
está publicada nessa plataforma e responde às requisições, mas as operações
dependentes de persistência falham: a instância de banco associada foi removida
pelo provedor por inatividade, condição comum aos planos gratuitos, e a
autenticação retorna erro de resolução de nome do servidor de dados.

A versão descrita neste documento **não foi publicada nessa instância**. A
camada de dados emprega SQL Server, e o plano gratuito oferece apenas
PostgreSQL; migrar exigiria converter as instruções em dialeto Transact-SQL
executadas na inicialização, além dos procedimentos e gatilhos da seção 8.
Optou-se por manter o SQL Server, preservando os objetos programáveis que
constituem a entrega da disciplina de banco de dados, e verificar o ambiente
pela conteinerização descrita a seguir, que reproduz integralmente aplicação,
banco e inicialização, e foi submetida a execução conforme a seção 9.8. A
distinção é relevante: demonstra-se não uma hospedagem em funcionamento, mas a
capacidade de reproduzir o ambiente de produção de forma determinística em
qualquer máquina — que é o que a prática de DevOps efetivamente busca.

## 9.3 Contêineres

A aplicação foi conteinerizada com **Docker**, em construção de múltiplos
estágios: o **estágio de compilação** usa a imagem do SDK do .NET (cerca de
800 MB) para restaurar dependências e publicar a aplicação, e o **estágio de
execução** parte da imagem do runtime (cerca de 220 MB) e recebe apenas os
binários publicados. A separação resultou em imagem final de **376 MB** e
reduziu a superfície de ataque, pois SDK, compiladores e código-fonte não
integram a imagem publicada. A aplicação executa sob **usuário sem
privilégios**, de modo que um comprometimento não confere privilégios
administrativos dentro do contêiner.

O ambiente completo é descrito em `docker-compose.yml`, que orquestra três
serviços: **banco**, o SQL Server, com verificação de disponibilidade que
executa consulta real ao gerenciador; **init-banco**, que aplica os três
scripts e encerra; e **api**, que só inicia após a conclusão bem-sucedida do
anterior. A sequência garante que a aplicação nunca encontre banco inexistente.

`[INSERIR FIGURA — Contêineres em execução]`

## 9.4 Pipeline de integração contínua

Foi configurado um pipeline em **GitHub Actions**, acionado a cada envio de
código ou solicitação de incorporação, com três tarefas. A tarefa **API**
restaura dependências, compila em modo Release com avisos tratados como erro e
varre pacotes com vulnerabilidades conhecidas. A tarefa **Mobile** instala as
dependências e compila o pacote. A tarefa **Docker** constrói a imagem,
condicionada ao êxito da compilação da API.

O tratamento de avisos como erro impede o acúmulo silencioso de pendências, e a
varredura de vulnerabilidades automatiza a verificação que, conduzida
manualmente, identificou o pacote comprometido mencionado na seção 5.

## 9.5 Monitoramento

O monitoramento apoia-se no endpoint `/health`, que verifica não apenas a
resposta da aplicação, mas também **o acesso ao banco de dados**, retornando
código 503 quando este está inacessível.

A distinção é relevante. A implementação inicial verificava apenas a presença
do runtime, e reportaria o contêiner como saudável ainda que a aplicação
estivesse inoperante — um indicador que nunca acusa falha é pior que sua
ausência, por produzir falsa confiança. A implementação corrigida foi
verificada experimentalmente: com o banco em operação o endpoint retornou 200;
após a interrupção deliberada do contêiner do banco, 503; restabelecido o
serviço, voltou a 200.

## 9.6 Escalabilidade

A escalabilidade horizontal é viabilizada pela ausência de estado: não havendo
sessão em memória, qualquer instância atende qualquer requisição e a adição de
réplicas não exige coordenação. Os índices da seção 8 sustentam o desempenho
das consultas conforme o volume cresce; em expansão significativa, as medidas
seguintes seriam cache distribuído para dados de leitura frequente e réplicas
de leitura no banco.

## 9.7 Segurança da infraestrutura

Seis medidas compõem a segurança do ambiente: os segredos permanecem fora do
código, em variáveis de ambiente, sem nenhum valor sensível versionado; o
contêiner executa como usuário comum; a imagem final não contém SDK,
compiladores nem código-fonte; o banco opera em rede dedicada, sem exposição
pública; as dependências passam por varredura automática no pipeline; e os
dados residem em volume nomeado, preservado entre reinicializações.

## 9.8 Verificação do ambiente

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
substituição da tecnologia móvel prevista, discutida na seção 6 —, e um método
preditivo exigiria replanejamento formal a cada ajuste. O acompanhamento
utilizou quadro **Kanban** na plataforma **Trello**, com as colunas Pendente,
Em Andamento, Teste e Concluído.

## 10.2 Papéis

Ao **Product Owner** coube priorizar o backlog conforme os critérios de
avaliação do PIM; ao **Scrum Master**, conduzir as reuniões e remover
impedimentos; e ao **Time de Desenvolvimento**, a implementação, os testes e a
documentação. Dada a dimensão da equipe — seis integrantes —, os papéis foram
exercidos de forma compartilhada, com rodízio das responsabilidades de
condução.

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

## 10.4 Sprint Backlog

O desenvolvimento organizou-se em **quatro sprints de duas semanas**, com os
itens do backlog distribuídos conforme a dependência técnica entre eles. Todos
foram concluídos.

| Sprint | Meta | Itens | Resultado |
|---|---|---|---|
| 1 — Fundação e segurança | Base arquitetural sólida e eliminação de vulnerabilidades | PB01, PB02 e configuração do ambiente | Solução em quatro projetos, compilando sem avisos, com verificação funcional preservada |
| 2 — Banco de dados | Transpor as regras de negócio para o banco | PB05, PB06, PB12 e consolidação dos scripts | 4 procedimentos, 4 gatilhos e 1 visão, verificados em banco criado do zero |
| 3 — Aplicação móvel | Disponibilizar acesso por dispositivo móvel | PB03, PB04, PB08, PB11 | Aplicativo executado em dispositivo real |
| 4 — Assistente e infraestrutura | Concluir funcionalidades pendentes e infraestrutura | PB07, PB09, PB10 | Ambiente conteinerizado verificado em execução, com três defeitos corrigidos |

Registre-se o impedimento tratado na terceira sprint: a incompatibilidade entre
a versão do SDK do projeto e a suportada pelo aplicativo intermediário
instalado no aparelho, discutida na seção 6.8. O impedimento reapareceu semanas
depois, em sentido inverso, quando esse aplicativo foi atualizado
automaticamente — evidência de que impedimentos originados em dependências
externas não se encerram com a sprint em que foram tratados.

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

Um item só é considerado concluído quando satisfaz cinco critérios:
funcionalidade implementada e compilando sem avisos; comportamento verificado
por execução, e não apenas por compilação; código comentado onde a intenção não
é evidente; alterações registradas no controle de versão com mensagem
descritiva; e documentação correspondente atualizada.

O segundo critério foi decisivo. Diversos defeitos relatados neste trabalho —
a verificação de saúde inócua, a ordem incorreta de inicialização, o endereço
fixo no front-end, o hash de senha que não correspondia à senha anunciada e o
texto ilegível sobre a superfície de alto contraste — passavam pela compilação
sem qualquer indício de problema. Somente a execução os revelou.

Os dois últimos merecem distinção. Não foram encontrados por um teste
planejado, mas durante a captura das imagens que ilustram este documento —
isto é, ao usar o sistema como um usuário o usaria. Sugerem que o critério de
pronto deveria exigir não apenas execução, mas execução observada por alguém
que não escreveu o código.

## 10.7 Retrospectiva

**Funcionou bem** a priorização por dependência técnica, que evitou retrabalho:
a arquitetura precedeu as funcionalidades, e o banco precedeu o aplicativo.
**Dificultaram** o andamento as restrições de ambiente — firewall, alteração de
endereço por DHCP, incompatibilidade de versões e política de execução de
scripts —, pouco visíveis no planejamento e de impacto real sobre o cronograma.
Como **melhoria**, registra-se a necessidade de verificar antecipadamente a
compatibilidade entre versões de ferramentas e dispositivos de teste, reservar
endereço fixo para a estação de desenvolvimento e executar toda configuração de
infraestrutura assim que escrita, em vez de postergar a verificação.

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
