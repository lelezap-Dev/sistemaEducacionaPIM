/* professor.js */
(function() {
  if (!Auth.estaLogado() || Auth.getPerfil() !== 'Professor') {
    window.location.href = '/index.html';
  }
})();

const user = Auth.getUser();
let perguntaIdx = 0;

// Cache local para evitar data-attributes com caracteres especiais
const _cache = { materias: {}, turmas: {}, conteudos: {} };

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
  res.data.dados.forEach(m => { _cache.materias[m.id] = m; });
  el.innerHTML = res.data.dados.map(m => `
    <div class="card mb-2">
      <div class="card-header">
        <div class="card-title">📚 ${m.nome}</div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="toggleConteudos('${m.id}', this)">
            📄 ${m.totalConteudos} conteúdo(s)
          </button>
          <button class="btn btn-outline btn-sm" onclick="abrirConteudo('${m.id}')">+ Conteúdo</button>
          <button class="btn btn-outline btn-sm" onclick="abrirEditarMateria('${m.id}')">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="excluirMateria('${m.id}')">Excluir</button>
        </div>
      </div>
      <p class="muted">${m.descricao || 'Sem descrição.'}</p>
      <div id="conteudos-${m.id}" style="display:none;margin-top:.75rem;border-top:1px solid var(--border);padding-top:.75rem"></div>
    </div>
  `).join('');
}

function abrirEditarMateria(id) {
  const m = _cache.materias[id];
  if (!m) return;
  document.getElementById('edit-mat-id').value   = id;
  document.getElementById('edit-mat-nome').value = m.nome;
  document.getElementById('edit-mat-desc').value = m.descricao || '';
  abrirModal('modal-editar-materia');
}

async function salvarMateria() {
  const btn  = document.getElementById('btn-salvar-materia');
  const id   = document.getElementById('edit-mat-id').value;
  const nome = document.getElementById('edit-mat-nome').value.trim();
  const desc = document.getElementById('edit-mat-desc').value.trim();
  if (!nome) { toast('Informe o nome da matéria.', 'error'); return; }

  mostrarLoader(btn);
  const res = await put(`/materias/${id}`, { nome, descricao: desc });
  esconderLoader(btn);

  if (res?.ok) {
    toast('Matéria atualizada!');
    fecharModal('modal-editar-materia');
    carregarMaterias();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function toggleConteudos(materiaId, btn) {
  const el = document.getElementById(`conteudos-${materiaId}`);
  if (el.style.display !== 'none') { el.style.display = 'none'; return; }

  const res = await get(`/materias/${materiaId}/conteudos`);
  if (!res?.ok || !res.data.dados?.length) {
    el.innerHTML = '<p class="muted" style="margin:0">Nenhum conteúdo cadastrado.</p>';
  } else {
    res.data.dados.forEach(c => { _cache.conteudos[c.id] = c; });
    el.innerHTML = res.data.dados.map(c => `
      <div style="padding:.75rem;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:.5rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
          <strong style="color:var(--text-1)">📄 ${c.titulo}</strong>
          <div style="display:flex;gap:.4rem">
            <button class="btn btn-outline btn-sm" onclick="abrirEditarConteudo('${c.id}','${materiaId}')">✏️ Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirConteudo('${c.id}','${materiaId}')">Excluir</button>
          </div>
        </div>
        <div class="muted" style="font-size:.85rem;white-space:pre-wrap">${c.texto.length > 300 ? c.texto.substring(0, 300) + '...' : c.texto}</div>
      </div>
    `).join('');
  }
  el.style.display = 'block';
}

function abrirEditarConteudo(conteudoId, materiaId) {
  const c = _cache.conteudos[conteudoId];
  if (!c) return;
  document.getElementById('edit-cont-id').value         = conteudoId;
  document.getElementById('edit-cont-materia-id').value = materiaId;
  document.getElementById('edit-cont-titulo').value     = c.titulo;
  document.getElementById('edit-cont-texto').value      = c.texto;
  abrirModal('modal-editar-conteudo');
}

async function salvarConteudo() {
  const btn    = document.getElementById('btn-salvar-conteudo');
  const id     = document.getElementById('edit-cont-id').value;
  const matId  = document.getElementById('edit-cont-materia-id').value;
  const titulo = document.getElementById('edit-cont-titulo').value.trim();
  const texto  = document.getElementById('edit-cont-texto').value.trim();
  if (!titulo || !texto) { toast('Preencha título e texto.', 'error'); return; }

  mostrarLoader(btn);
  const res = await put(`/materias/conteudos/${id}`, { titulo, texto });
  esconderLoader(btn);

  if (res?.ok) {
    toast('Conteúdo atualizado!');
    fecharModal('modal-editar-conteudo');
    document.getElementById(`conteudos-${matId}`).style.display = 'none';
    carregarMaterias();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function excluirConteudo(conteudoId, materiaId) {
  if (!confirm('Excluir este conteúdo?')) return;
  const res = await del(`/materias/conteudos/${conteudoId}`);
  if (res?.ok) {
    toast('Conteúdo excluído.');
    document.getElementById(`conteudos-${materiaId}`).style.display = 'none';
    carregarMaterias();
    carregarInicio();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
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
    carregarInicio();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function excluirMateria(id) {
  if (!confirm('Excluir esta matéria?')) return;
  const res = await del(`/materias/${id}`);
  res?.ok ? (toast('Matéria excluída.'), carregarMaterias(), carregarInicio()) : toast(res?.data?.mensagem, 'error');
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
  res.data.dados.forEach(t => { _cache.turmas[t.codigo] = t; });
  el.innerHTML = res.data.dados.map(t => `
    <div class="card mb-2">
      <div class="card-header">
        <div class="card-title">🎓 ${t.codigo}</div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="toggleAlunos('${t.codigo}')">👥 ${t.totalAlunos} aluno(s)</button>
          <button class="btn btn-outline btn-sm" onclick="abrirMatricula('${t.codigo}')">+ Aluno</button>
          <button class="btn btn-outline btn-sm" onclick="abrirEditarTurma('${t.codigo}')">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="excluirTurma('${t.codigo}')">Excluir</button>
        </div>
      </div>
      <div style="color:var(--text-1);font-weight:600;margin-bottom:.25rem">${t.materiaNome}</div>
      <div class="muted">🕐 ${t.horario || 'Sem horário'} · 👥 ${t.totalAlunos} aluno(s)</div>
      <div id="alunos-${t.codigo}" style="display:none;margin-top:.75rem;border-top:1px solid var(--border);padding-top:.75rem"></div>
    </div>
  `).join('');
}

function abrirEditarTurma(codigo) {
  const t = _cache.turmas[codigo];
  if (!t) return;
  document.getElementById('edit-turma-codigo').value      = codigo;
  document.getElementById('edit-turma-codigo-show').value = codigo;
  document.getElementById('edit-turma-horario').value     = t.horario || '';
  abrirModal('modal-editar-turma');
}

async function salvarTurma() {
  const btn     = document.getElementById('btn-salvar-turma');
  const codigo  = document.getElementById('edit-turma-codigo').value;
  const horario = document.getElementById('edit-turma-horario').value.trim();
  if (!horario) { toast('Informe o horário.', 'error'); return; }

  mostrarLoader(btn);
  const res = await put(`/turmas/${codigo}`, { horario });
  esconderLoader(btn);

  if (res?.ok) {
    toast('Turma atualizada!');
    fecharModal('modal-editar-turma');
    carregarTurmas();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function toggleAlunos(turmaCodigo) {
  const el = document.getElementById(`alunos-${turmaCodigo}`);
  if (el.style.display !== 'none') { el.style.display = 'none'; return; }

  const res = await get(`/turmas/${turmaCodigo}/alunos`);
  if (!res?.ok || !res.data.dados?.length) {
    el.innerHTML = '<p class="muted" style="margin:0">Nenhum aluno matriculado.</p>';
  } else {
    el.innerHTML = `
      <div class="muted" style="font-size:.8rem;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Alunos matriculados</div>
      ${res.data.dados.map(a => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem .75rem;
             background:var(--bg-3);border-radius:var(--radius);margin-bottom:.3rem">
          <div>
            <span style="font-weight:600;color:var(--text-1)">${a.nome}</span>
            <span class="muted" style="font-size:.82rem"> · ${cpfMask(a.cpf)}</span>
          </div>
          <button class="btn btn-danger btn-sm" onclick="desmatricularAluno('${a.cpf}','${turmaCodigo}')">Remover</button>
        </div>
      `).join('')}
    `;
  }
  el.style.display = 'block';
}

async function desmatricularAluno(alunoCpf, turmaCodigo) {
  if (!confirm('Remover este aluno da turma?')) return;
  const res = await del(`/turmas/${turmaCodigo}/alunos/${alunoCpf}`);
  if (res?.ok) { toast('Aluno removido.'); carregarTurmas(); }
  else toast(res?.data?.mensagem || 'Erro.', 'error');
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
    carregarInicio();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function excluirTurma(codigo) {
  if (!confirm('Excluir esta turma?')) return;
  const res = await del(`/turmas/${codigo}`);
  res?.ok ? (toast('Turma excluída.'), carregarTurmas(), carregarInicio()) : toast(res?.data?.mensagem, 'error');
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
    <div class="card mb-2">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap">
        <div>
          <div style="font-weight:600;color:var(--text-1)">${a.titulo}</div>
          <div class="muted">📚 ${a.materiaNome} · ${a.totalPerguntas} pergunta(s)</div>
        </div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="togglePerguntas('${a.id}')">👁 Ver perguntas</button>
          <button class="btn btn-danger btn-sm" onclick="excluirAtividade('${a.id}')">Excluir</button>
        </div>
      </div>
      <div id="pergs-${a.id}" style="display:none;margin-top:.75rem;border-top:1px solid var(--border);padding-top:.75rem"></div>
    </div>
  `).join('');
}

async function togglePerguntas(atividadeId) {
  const el = document.getElementById(`pergs-${atividadeId}`);
  if (el.style.display !== 'none') { el.style.display = 'none'; return; }

  const res = await get(`/atividades/${atividadeId}`);
  const perguntas = res?.data?.dados?.perguntas;
  if (!res?.ok || !perguntas?.length) {
    el.innerHTML = '<p class="muted" style="margin:0">Sem perguntas cadastradas.</p>';
  } else {
    el.innerHTML = perguntas.map((p, i) => `
      <div style="margin-bottom:.6rem;padding:.75rem;background:var(--bg-3);border-radius:var(--radius)">
        <div style="font-weight:600;color:var(--text-1);margin-bottom:.4rem">${i + 1}. ${p.textoPergunta}</div>
        <div style="display:flex;flex-wrap:wrap;gap:.35rem">
          ${p.alternativas.map((alt, j) => `
            <span style="padding:.2rem .55rem;background:var(--bg-2);border:1px solid var(--border);
                 border-radius:4px;font-size:.8rem;color:var(--text-2)">
              ${String.fromCharCode(65 + j)}) ${alt}
            </span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
  el.style.display = 'block';
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
    carregarInicio();
  } else { toast(res?.data?.mensagem || 'Erro.', 'error'); }
}

async function excluirAtividade(id) {
  if (!confirm('Excluir esta atividade?')) return;
  const res = await del(`/atividades/${id}`);
  res?.ok ? (toast('Atividade excluída.'), carregarAtividades(), carregarInicio()) : toast(res?.data?.mensagem, 'error');
}

// ── Ranking ───────────────────────────────────────────────────
async function carregarRanking() {
  const res = await get('/relatorios/ranking');
  renderRanking('ranking-list', res?.data?.dados);
}
