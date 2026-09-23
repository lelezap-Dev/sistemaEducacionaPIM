// ================================================================
//  farol.js — Farol de Evasão
//
//  Componente compartilhado pelos painéis da Secretaria e do
//  Professor. O servidor decide o escopo: a secretaria recebe toda
//  a instituição; o professor, apenas os alunos das próprias turmas.
//
//  Acessibilidade (WCAG 2.1, critério 1.4.1 — uso de cor): o nível
//  de risco nunca é comunicado só pela cor. Cada nível tem também
//  um símbolo de formato distinto e o rótulo por extenso, para que
//  pessoas com daltonismo consigam diferenciá-los.
// ================================================================

const FAROL_NIVEIS = {
  Alto:    { rotulo: 'Risco alto', simbolo: '●', classe: 'badge-red',    cor: 'var(--red)'    },
  Atencao: { rotulo: 'Atenção',    simbolo: '▲', classe: 'badge-yellow', cor: 'var(--yellow)' },
  Regular: { rotulo: 'Regular',    simbolo: '■', classe: 'badge-green',  cor: 'var(--green)'  },
};

const FAROL_SINAIS = {
  DESEMPENHO:  '📉',
  INATIVIDADE: '💤',
  LEITURA:     '📖',
  PENDENCIAS:  '📝',
  QUEDA:       '⤵️',
};

let farolDados  = null;
let farolFiltro = 'Todos';

// Nomes vêm do banco: escapa antes de inserir no HTML
function farolEsc(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

async function carregarFarol() {
  const el = document.getElementById('farol-conteudo');
  el.innerHTML = `<div class="empty-state"><p>Calculando o farol...</p></div>`;

  const res = await get('/farol');
  if (!res?.ok) {
    el.innerHTML = `<div class="empty-state"><p>Não foi possível gerar o farol.</p></div>`;
    return;
  }

  farolDados = res.data.dados;
  renderizarFarol();
}

function filtrarFarol(nivel) {
  farolFiltro = nivel;
  renderizarFarol();
}

function renderizarFarol() {
  const el = document.getElementById('farol-conteudo');
  const d  = farolDados;

  if (!d.totalAlunos) {
    el.innerHTML = `<div class="empty-state"><p>Nenhum aluno matriculado no seu escopo.</p></div>`;
    return;
  }

  const contador = (nivel, qtd) => {
    const n = FAROL_NIVEIS[nivel];
    const ativo = farolFiltro === nivel;
    return `
      <button class="farol-contador ${ativo ? 'ativo' : ''}" style="--farol-cor:${n.cor}"
              onclick="filtrarFarol('${ativo ? 'Todos' : nivel}')"
              aria-pressed="${ativo}" aria-label="${qtd} aluno(s) com nível ${n.rotulo}. Clique para filtrar.">
        <span class="farol-contador-num">${qtd}</span>
        <span class="farol-contador-rotulo"><span aria-hidden="true">${n.simbolo}</span> ${n.rotulo}</span>
      </button>`;
  };

  const visiveis = farolFiltro === 'Todos'
    ? d.alunos
    : d.alunos.filter(a => a.nivel === farolFiltro);

  const linhas = visiveis.map(a => {
    const n = FAROL_NIVEIS[a.nivel];
    const sinais = a.sinais.length
      ? `<ul class="farol-sinais">${a.sinais.map(s => `
          <li><span aria-hidden="true">${FAROL_SINAIS[s.codigo] || '•'}</span>
              ${farolEsc(s.descricao)} <span class="muted">+${s.pontos}</span></li>`).join('')}
        </ul>`
      : `<p class="muted farol-sem-sinais">Nenhum sinal de risco identificado.</p>`;

    return `
      <article class="farol-aluno" style="--farol-cor:${n.cor}">
        <div class="farol-aluno-topo">
          <div>
            <div class="farol-nome">${farolEsc(a.alunoNome)}</div>
            <div class="muted">${cpfMask(a.alunoCpf)} · ${a.turmas.map(farolEsc).join(', ')}</div>
          </div>
          <div class="farol-nota">
            <span class="badge ${n.classe}"><span aria-hidden="true">${n.simbolo}</span> ${n.rotulo}</span>
            <div class="farol-pontos" aria-label="Pontuação ${a.pontuacao} de 100">
              <div class="progress-bar"><div class="progress-fill" style="width:${a.pontuacao}%;background:${n.cor}"></div></div>
              <span>${a.pontuacao}</span>
            </div>
          </div>
        </div>
        ${sinais}
      </article>`;
  }).join('');

  el.innerHTML = `
    <div class="farol-contadores">
      ${contador('Alto', d.riscoAlto)}
      ${contador('Atencao', d.atencao)}
      ${contador('Regular', d.regular)}
    </div>
    <p class="muted farol-legenda">
      ${farolFiltro === 'Todos'
        ? `${d.totalAlunos} aluno(s) monitorado(s)`
        : `Mostrando ${visiveis.length} de ${d.totalAlunos} · <a href="#" onclick="filtrarFarol('Todos');return false">ver todos</a>`}
      · atualizado em ${formatarData(d.geradoEm)}
    </p>
    <div class="farol-lista">${linhas}</div>
    <p class="muted farol-rodape">
      A pontuação (0 a 100) soma sinais fixos e explicados: desempenho, inatividade,
      leitura, atividades pendentes e queda de rendimento. É uma ferramenta de apoio —
      um convite à conversa com o aluno, não um rótulo. Os alunos não têm acesso a esta tela.
    </p>`;
}
