using SistemaEducacional.Domain.Entities;

namespace SistemaEducacional.API;

// ================================================================
//  SeedChatbot — base de conhecimento inicial do assistente virtual.
//
//  As perguntas foram derivadas das dores mapeadas nas personas do
//  PIM III (Lucas/aluno, Mariana/professora e Carla/secretaria) e dos
//  pontos em que os usuários mais recorrem ao suporte: recuperação de
//  senha, cadastro pendente e localização de conteúdos.
// ================================================================

public static class SeedChatbot
{
    public static List<ChatbotFaq> BaseInicial() =>
    [
        // ── Acesso ────────────────────────────────────────────────
        new() {
            Pergunta      = "Esqueci minha senha, como recupero?",
            Resposta      = "Na tela de login, toque em \"Esqueci minha senha\". " +
                            "Você precisará informar seu CPF e a palavra-chave que cadastrou. " +
                            "Se não lembrar a palavra-chave, procure a secretaria para redefinir seu acesso.",
            PalavrasChave = "senha,esqueci,recuperar,redefinir,acesso,perdi,esqueceu",
            Categoria     = "Acesso",
            PerfilAlvo    = "Todos",
            Ordem         = 1
        },
        new() {
            Pergunta      = "Meu cadastro está pendente. O que fazer?",
            Resposta      = "Cadastros de professor e secretaria passam por aprovação. " +
                            "A secretaria analisa a solicitação no painel de Aprovações. " +
                            "Enquanto o status for \"Pendente\", o login fica bloqueado. " +
                            "Alunos são ativados automaticamente.",
            PalavrasChave = "pendente,aprovacao,aprovar,cadastro,bloqueado,liberar,ativar",
            Categoria     = "Acesso",
            PerfilAlvo    = "Todos",
            Ordem         = 2
        },
        new() {
            Pergunta      = "Como faço login no sistema?",
            Resposta      = "Use seu CPF (somente números, sem pontos ou traços) e sua senha. " +
                            "O sistema identifica automaticamente se você é aluno, professor ou secretaria " +
                            "e abre o painel correspondente.",
            PalavrasChave = "login,entrar,acessar,cpf,conectar",
            Categoria     = "Acesso",
            PerfilAlvo    = "Todos",
            Ordem         = 3
        },
        new() {
            Pergunta      = "Quais são os requisitos da senha?",
            Resposta      = "A senha precisa ter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, " +
                            "uma minúscula, um número e um símbolo (!@#$%...). " +
                            "Ela é armazenada de forma criptografada e nem a secretaria consegue vê-la.",
            PalavrasChave = "requisito,forte,fraca,caracteres,simbolo,maiuscula,criptografada,seguranca",
            Categoria     = "Acesso",
            PerfilAlvo    = "Todos",
            Ordem         = 4
        },

        // ── Aluno ─────────────────────────────────────────────────
        new() {
            Pergunta      = "Como vejo minhas notas?",
            Resposta      = "Acesse \"Meus Resultados\" no menu. Lá aparecem todas as atividades realizadas, " +
                            "com acertos, percentual e data. O painel inicial também mostra sua média geral.",
            PalavrasChave = "nota,notas,resultado,resultados,desempenho,media,pontuacao,acertos",
            Categoria     = "Aluno",
            PerfilAlvo    = "Aluno",
            Ordem         = 10
        },
        new() {
            Pergunta      = "Onde encontro os conteúdos das matérias?",
            Resposta      = "Vá em \"Matérias\" e toque na disciplina desejada para abrir os conteúdos. " +
                            "Ao abrir um conteúdo, ele é marcado como lido e passa a contar no seu " +
                            "indicador de engajamento.",
            PalavrasChave = "conteudo,conteudos,material,materiais,aula,apostila,estudar,ler",
            Categoria     = "Aluno",
            PerfilAlvo    = "Aluno",
            Ordem         = 11
        },
        new() {
            Pergunta      = "Como respondo uma atividade?",
            Resposta      = "Em \"Atividades\", escolha uma tarefa pendente e toque em Iniciar. " +
                            "Responda todas as perguntas e envie. A correção é automática e o resultado " +
                            "aparece na hora. Atenção: cada atividade só pode ser respondida uma vez.",
            PalavrasChave = "atividade,atividades,prova,questionario,responder,fazer,tarefa,exercicio",
            Categoria     = "Aluno",
            PerfilAlvo    = "Aluno",
            Ordem         = 12
        },
        new() {
            Pergunta      = "Posso refazer uma atividade?",
            Resposta      = "Não. Cada atividade permite um único envio por aluno, e o sistema impede " +
                            "tentativas repetidas. Em caso de problema durante o envio, procure seu professor.",
            PalavrasChave = "refazer,repetir,denovo,novamente,segunda,tentativa",
            Categoria     = "Aluno",
            PerfilAlvo    = "Aluno",
            Ordem         = 13
        },

        // ── Professor ─────────────────────────────────────────────
        new() {
            Pergunta      = "Como crio uma atividade?",
            Resposta      = "Em \"Atividades\", clique em \"Nova Atividade\", escolha a matéria e a turma, " +
                            "dê um título e cadastre as perguntas com suas alternativas, indicando a resposta " +
                            "correta. A correção dos alunos passa a ser automática.",
            PalavrasChave = "criar,nova,cadastrar,atividade,prova,questionario,perguntas",
            Categoria     = "Professor",
            PerfilAlvo    = "Professor",
            Ordem         = 20
        },
        new() {
            Pergunta      = "Como acompanho o desempenho da turma?",
            Resposta      = "O módulo \"Análise\" classifica os alunos em Destaque (80% ou mais), " +
                            "Em Progresso (60% a 79%) e Em Risco (abaixo de 60%), destacando quem precisa " +
                            "de atenção. O \"Ranking\" mostra a ordenação geral por aproveitamento.",
            PalavrasChave = "desempenho,analise,turma,risco,ranking,acompanhar,relatorio,grafico",
            Categoria     = "Professor",
            PerfilAlvo    = "Professor",
            Ordem         = 21
        },

        // ── Secretaria ────────────────────────────────────────────
        new() {
            Pergunta      = "Como matriculo um aluno em uma turma?",
            Resposta      = "Acesse \"Matrículas\", informe o CPF do aluno e selecione a turma. " +
                            "O sistema valida se o aluno está ativo e se ainda há vagas — o limite é de " +
                            "40 alunos por turma.",
            PalavrasChave = "matricula,matricular,turma,vincular,inscrever,vaga",
            Categoria     = "Secretaria",
            PerfilAlvo    = "Secretaria",
            Ordem         = 30
        },
        new() {
            Pergunta      = "Como aprovo um cadastro pendente?",
            Resposta      = "Em \"Aprovações\" ficam as solicitações aguardando análise. " +
                            "Você pode aprovar ou rejeitar cada uma. Toda alteração de perfil ou status " +
                            "fica registrada na auditoria do sistema.",
            PalavrasChave = "aprovar,aprovacao,rejeitar,pendente,solicitacao,liberar,cadastro",
            Categoria     = "Secretaria",
            PerfilAlvo    = "Secretaria",
            Ordem         = 31
        },

        // ── Acessibilidade e geral ────────────────────────────────
        new() {
            Pergunta      = "O sistema tem recursos de acessibilidade?",
            Resposta      = "Sim. O botão de acessibilidade fica sempre disponível e oferece alto contraste, " +
                            "três tamanhos de texto e um glossário em Libras com os principais termos " +
                            "acadêmicos. Os recursos estão tanto no site quanto no aplicativo.",
            PalavrasChave = "acessibilidade,contraste,fonte,tamanho,libras,surdo,visao,inclusao,deficiencia",
            Categoria     = "Acessibilidade",
            PerfilAlvo    = "Todos",
            Ordem         = 40
        },
        new() {
            Pergunta      = "Existe aplicativo para celular?",
            Resposta      = "Sim. O aplicativo Lumina traz painel, matérias, atividades e resultados, " +
                            "com os mesmos dados do site — o login é o mesmo. " +
                            "Ele ainda guarda os últimos dados no aparelho, permitindo consulta mesmo " +
                            "sem conexão.",
            PalavrasChave = "aplicativo,app,celular,mobile,android,iphone,telefone,offline",
            Categoria     = "Geral",
            PerfilAlvo    = "Todos",
            Ordem         = 41
        },
        new() {
            Pergunta      = "Como falo com a secretaria?",
            Resposta      = "Use a opção \"Contate-nos\" no topo da tela inicial para enviar sua mensagem. " +
                            "Questões de matrícula, documentos e liberação de acesso são resolvidas por lá.",
            PalavrasChave = "contato,falar,secretaria,ajuda,suporte,atendimento,duvida",
            Categoria     = "Geral",
            PerfilAlvo    = "Todos",
            Ordem         = 42
        }
    ];
}
