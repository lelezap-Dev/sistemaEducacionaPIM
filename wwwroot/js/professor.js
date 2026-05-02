/* professor.js */
(function() {
  if (!Auth.estaLogado() || Auth.getPerfil() !== 'Professor') {
    window.location.href = '/index.html';
  }
})();

const user = Auth.getUser();
let perguntaIdx = 0;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nav-nome').textContent = user?.nome || '';
  carregarInicio();
});

async function logout() {
  await post('/auth/logout');
  Auth.limpar();
  window.location.href = '/index.html';
}

// ── Início ────────────────────────────────────────────────────
async function carregarInicio() {
  const [resMat, resTurma, resAtv] = await Promise.all([
    get('/materias'), get('/turmas'), get('/atividades')
  ]);
  document.getElementById('stat-materias').textContent   = resMat?.data?.dados?.length   ?? '—';
  document.getElementById('stat-turmas').textContent     = resTurma?.data?.dados?.length ?? '—';
  document.getElementById('stat-atividades').textContent = resAtv?.data?.dados?.length   ?? '—';

  const resRank = await get('/relatorios/ranking');
  renderRanking('home-ranking', resRank?.data?.dados?.slice(0, 5));
}

function renderRanking(elId, dados) {
  const el = document.getElementById(elId);
  if (!dados?.length) { el.innerHTML = `<div class="empty-state"><p>Nenhum dado ainda.</p></div>`; return; }
  el.innerHTML = dados.map(r => `
    <div class="ranking-item">
      <div class="ranking-pos ${r.posicao <= 3 ? 'top' : ''}">
        ${r.posicao === 1 ? '🥇' : r.posicao === 2 ? '🥈' : r.posicao === 3 ? '🥉' : r.posicao}
      </div>
      <div style="flex:1">
        <div style="font-weight:600;color:var(--text-1)">${r.alunoNome}</div>
        <div class="muted">${r.totalAtividades} atividade(s)</div>
      </div>
      <span class="badge badge-green">${r.media}%</span>
    </div>
  `).join('');
}

// ── Matérias ─────────────────────────────────────────────────
async function carregarMaterias() {
  const res = await get('/materias');
  const el  = document.getElementById('materias-list');
  if (!res?.ok || !res.data.dados.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-icon">📚</span><p>Nenhuma matéria criada.</p></div>`; return;
  }
  el.innerHTML = res.data.dados.map(m => `
    <div class="card mb-2">
      <div class="card-header">
        <div class="card-title">📚 ${m.nome}</div>
        <div style="display:flex;gap:.5rem">
          <button class="btn btn-outline btn-sm" onclick="abrirConteudo('${m.id}')">+ Conteúdo</button>
          <button class="btn btn-danger btn-sm" onclick="excluirMateria('${m.id}')">Excluir</button>
        </div>
      </div>
      <p class="muted">${m.descricao || 'Sem descrição.'}</p>
      <div class="muted mt-1">📄 ${m.totalConteudos} conteúdo(s)</div>
    </div>
  `).join('');
}

async function criarMateria() {
  const btn  = document.getElementById('btn-criar-materia');
  const nome = document.getElementById('mat-nome').value.trim();
  const desc = document.getElementById('mat-desc').value.trim();
  if (!nome) { toast('Informe o nome da matéria.', 'error'); return; }

  mostrarLoader(btn);
  const res = await post('/materias', { nome, descricao: desc });
  esconderLoader(btn);

  if (res?.ok) {
    toast('Matéria criada!');
    fecharModal('modal-nova-materia');
    document.getElementById('mat-nome').value = '';
    document.getElementById('mat-desc').value = '';
    carregarMaterias();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function excluirMateria(id) {
  if (!confirm('Excluir esta matéria?')) return;
  const res = await del(`/materias/${id}`);
  res?.ok ? (toast('Matéria excluída.'), carregarMaterias()) : toast(res?.data?.mensagem, 'error');
}

function abrirConteudo(materiaId) {
  document.getElementById('cont-materia-id').value = materiaId;
  document.getElementById('cont-titulo').value = '';
  document.getElementById('cont-texto').value  = '';
  abrirModal('modal-novo-conteudo');
}

async function criarConteudo() {
  const btn     = document.getElementById('btn-criar-conteudo');
  const matId   = document.getElementById('cont-materia-id').value;
  const titulo  = document.getElementById('cont-titulo').value.trim();
  const texto   = document.getElementById('cont-texto').value.trim();
  if (!titulo || !texto) { toast('Preencha título e texto.', 'error'); return; }

  mostrarLoader(btn);
  const res = await post(`/materias/${matId}/conteudos`, { titulo, texto });
  esconderLoader(btn);

  if (res?.ok) {
    toast('Conteúdo adicionado!');
    fecharModal('modal-novo-conteudo');
    carregarMaterias();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

// ── Turmas ───────────────────────────────────────────────────
async function carregarTurmas() {
  const res = await get('/turmas');
  const el  = document.getElementById('turmas-list');
  if (!res?.ok || !res.data.dados.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-icon">🎓</span><p>Nenhuma turma criada.</p></div>`; return;
  }
  el.innerHTML = res.data.dados.map(t => `
    <div class="card mb-2">
      <div class="card-header">
        <div class="card-title">🎓 ${t.codigo}</div>
        <div style="display:flex;gap:.5rem">
          <button class="btn btn-outline btn-sm" onclick="abrirMatricula('${t.codigo}')">+ Aluno</button>
          <button class="btn btn-danger btn-sm" onclick="excluirTurma('${t.codigo}')">Excluir</button>
        </div>
      </div>
      <div style="color:var(--text-1);font-weight:600;margin-bottom:.25rem">${t.materiaNome}</div>
      <div class="muted">🕐 ${t.horario || 'Sem horário'} · 👥 ${t.totalAlunos} aluno(s)</div>
    </div>
  `).join('');
}

async function criarTurma() {
  const btn     = document.getElementById('btn-criar-turma');
  const codigo  = document.getElementById('turma-codigo').value.trim();
  const matId   = document.getElementById('turma-materia').value;
  const horario = document.getElementById('turma-horario').value.trim();
  if (!codigo || !matId) { toast('Preencha código e matéria.', 'error'); return; }

  mostrarLoader(btn);
  const res = await post('/turmas', { codigo, materiaId: matId, horario });
  esconderLoader(btn);

  if (res?.ok) {
    toast('Turma criada!');
    fecharModal('modal-nova-turma');
    carregarTurmas();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function excluirTurma(codigo) {
  if (!confirm('Excluir esta turma?')) return;
  const res = await del(`/turmas/${codigo}`);
  res?.ok ? (toast('Turma excluída.'), carregarTurmas()) : toast(res?.data?.mensagem, 'error');
}

function abrirMatricula(turmaCodigo) {
  document.getElementById('mat-turma-codigo').value = turmaCodigo;
  document.getElementById('mat-aluno-cpf').value    = '';
  abrirModal('modal-matricular');
}

async function matricularAluno() {
  const btn        = document.getElementById('btn-matricular');
  const turmaCodigo = document.getElementById('mat-turma-codigo').value;
  const alunoCpf    = document.getElementById('mat-aluno-cpf').value.trim();
  if (!alunoCpf) { toast('Informe o CPF do aluno.', 'error'); return; }

  mostrarLoader(btn);
  const res = await post('/turmas/matricular', { alunoCpf, turmaCodigo });
  esconderLoader(btn);

  if (res?.ok) {
    toast('Aluno matriculado!');
    fecharModal('modal-matricular');
    carregarTurmas();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

// Popular selects ao abrir modais com matérias
document.getElementById('modal-nova-turma').addEventListener('click', async function(e) {
  if (!e.target.closest('.modal')) return;
}, { once: false });

async function popularSelectMaterias() {
  const res = await get('/materias');
  if (!res?.ok) return;
  const opts = res.data.dados.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
  ['turma-materia','atv-materia'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.innerHTML = `<option value="">Selecione...</option>` + opts;
  });
}

// Chama ao abrir modais de turma e atividade
document.querySelectorAll('[onclick*="modal-nova-turma"],[onclick*="modal-nova-atividade"]').forEach(btn => {
  btn.addEventListener('click', popularSelectMaterias);
});

// ── Atividades ────────────────────────────────────────────────
async function carregarAtividades() {
  const res = await get('/atividades');
  const el  = document.getElementById('atividades-list');
  if (!res?.ok || !res.data.dados.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-icon">📝</span><p>Nenhuma atividade criada.</p></div>`; return;
  }
  el.innerHTML = res.data.dados.map(a => `
    <div class="card mb-2" style="display:flex;align-items:center;justify-content:space-between;gap:1rem">
      <div>
        <div style="font-weight:600;color:var(--text-1)">${a.titulo}</div>
        <div class="muted">📚 ${a.materiaNome} · ${a.totalPerguntas} pergunta(s)</div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="excluirAtividade('${a.id}')">Excluir</button>
    </div>
  `).join('');
}

// ── Perguntas dinâmicas no modal de nova atividade ────────────
function adicionarPergunta() {
  const idx = perguntaIdx++;
  const container = document.getElementById('perguntas-container');
  const div = document.createElement('div');
  div.className = 'card mb-2';
  div.style.cssText = 'padding:1rem;';
  div.id = `perg-${idx}`;
  div.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
      <strong style="color:var(--text-1)">Pergunta ${idx + 1}</strong>
      <button class="btn btn-danger btn-sm" onclick="document.getElementById('perg-${idx}').remove()">✕</button>
    </div>
    <div class="form-group">
      <label class="form-label">Enunciado</label>
      <input type="text" class="form-control perg-texto" placeholder="Digite a pergunta..." />
    </div>
    <div class="form-group">
      <label class="form-label">Alternativas (uma por linha — marque a correta)</label>
      ${[0,1,2,3].map(i => `
        <div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem">
          <input type="radio" name="correta-${idx}" value="${i}" style="accent-color:var(--accent)" />
          <input type="text" class="form-control alt-${idx}" placeholder="Alternativa ${String.fromCharCode(65+i)}" />
        </div>
      `).join('')}
    </div>
  `;
  container.appendChild(div);
}

async function criarAtividade() {
  const btn    = document.getElementById('btn-criar-atividade');
  const titulo = document.getElementById('atv-titulo').value.trim();
  const matId  = document.getElementById('atv-materia').value;
  const turma  = document.getElementById('atv-turma').value.trim() || null;

  if (!titulo || !matId) { toast('Preencha título e matéria.', 'error'); return; }

  const perguntas = [];
  document.querySelectorAll('[id^="perg-"]').forEach((div, i) => {
    const texto   = div.querySelector('.perg-texto')?.value?.trim();
    const corrIdx = div.querySelector(`input[type="radio"]:checked`)?.value;
    const alts    = [...div.querySelectorAll(`input.alt-${div.id.split('-')[1]}`)].map(el => el.value.trim()).filter(Boolean);

    if (texto && corrIdx !== undefined && alts.length) {
      perguntas.push({
        textoPergunta:   texto,
        respostaCorreta: alts[parseInt(corrIdx)],
        alternativas:    alts,
        ordem: i
      });
    }
  });

  if (!perguntas.length) { toast('Adicione ao menos uma pergunta completa.', 'error'); return; }

  mostrarLoader(btn);
  const res = await post('/atividades', { titulo, materiaId: matId, turmaCodigo: turma, perguntas });
  esconderLoader(btn);

  if (res?.ok) {
    toast('Atividade criada!');
    fecharModal('modal-nova-atividade');
    document.getElementById('perguntas-container').innerHTML = '';
    perguntaIdx = 0;
    carregarAtividades();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function excluirAtividade(id) {
  if (!confirm('Excluir esta atividade?')) return;
  const res = await del(`/atividades/${id}`);
  res?.ok ? (toast('Atividade excluída.'), carregarAtividades()) : toast(res?.data?.mensagem, 'error');
}

// ── Ranking ───────────────────────────────────────────────────
async function carregarRanking() {
  const res = await get('/relatorios/ranking');
  renderRanking('ranking-list', res?.data?.dados);
}
