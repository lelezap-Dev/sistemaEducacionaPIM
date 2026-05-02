/* aluno.js — Lógica do dashboard do Aluno */

// Verifica se está logado e é Aluno
(function() {
  if (!Auth.estaLogado() || Auth.getPerfil() !== 'Aluno') {
    window.location.href = '/index.html';
  }
})();

const user = Auth.getUser();
let atividadeAtual = null;  // atividade aberta no quiz

// ── Init ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nav-nome').textContent = user?.nome || '';
  document.getElementById('nome-aluno').textContent = user?.nome?.split(' ')[0] || 'Aluno';
  carregarInicio();
});

// ── Logout ────────────────────────────────────────────────────
async function logout() {
  await post('/auth/logout');
  Auth.limpar();
  window.location.href = '/index.html';
}

// ── Início — stats + listas rápidas ──────────────────────────
async function carregarInicio() {
  const cpf = user.cpf;

  // Relatório do aluno
  const resRel = await get(`/relatorios/aluno/${cpf}`);
  if (resRel?.ok) {
    const d = resRel.data.dados;
    document.getElementById('stat-atividades').textContent = d.totalAtividades;
    document.getElementById('stat-media').textContent      = d.mediaAcertos + '%';
    document.getElementById('stat-leituras').textContent   = d.totalConteudosLidos;
  }

  // Turmas (para contar)
  const resTurmas = await get('/turmas');
  if (resTurmas?.ok) {
    document.getElementById('stat-turmas').textContent = resTurmas.data.dados.length;
  }

  // Atividades recentes (3 últimas)
  const resAtv = await get('/atividades');
  if (resAtv?.ok) {
    const list = resAtv.data.dados.slice(0, 3);
    const el = document.getElementById('home-atividades-list');
    if (!list.length) {
      el.innerHTML = `<div class="empty-state"><span class="empty-icon">📋</span><p>Nenhuma atividade disponível</p></div>`;
    } else {
      el.innerHTML = list.map(a => `
        <div class="ranking-item" style="border-bottom:1px solid var(--border)">
          <div style="flex:1">
            <div style="font-weight:600;font-size:.9rem">${a.titulo}</div>
            <div class="muted">${a.materiaNome}</div>
          </div>
          ${a.jaRealizada
            ? `<span class="badge badge-green">✓ Feita</span>`
            : `<button class="btn btn-primary btn-sm" onclick="abrirQuiz('${a.id}','${a.titulo}')">Iniciar</button>`
          }
        </div>
      `).join('');
    }
  }

  // Últimos resultados (3)
  const resResultados = await get(`/relatorios/aluno/${cpf}`);
  if (resResultados?.ok) {
    const list = resResultados.data.dados.resultados.slice(-3).reverse();
    const el = document.getElementById('home-resultados-list');
    if (!list.length) {
      el.innerHTML = `<div class="empty-state"><span class="empty-icon">📊</span><p>Nenhum resultado ainda</p></div>`;
    } else {
      el.innerHTML = list.map(r => `
        <div class="ranking-item" style="border-bottom:1px solid var(--border)">
          <div style="flex:1">
            <div style="font-weight:600;font-size:.9rem">${r.atividadeTitulo}</div>
            <div class="muted">${r.materiaNome}</div>
          </div>
          <span class="badge ${r.porcentagem >= 70 ? 'badge-green' : 'badge-red'}">
            ${r.porcentagem}%
          </span>
        </div>
      `).join('');
    }
  }
}

// ── Turmas ───────────────────────────────────────────────────
async function carregarTurmas() {
  const res = await get('/turmas');
  const el  = document.getElementById('turmas-list');

  if (!res?.ok || !res.data.dados.length) {
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <span class="empty-icon">🎓</span><p>Você não está matriculado em nenhuma turma.</p>
    </div>`;
    return;
  }

  el.innerHTML = res.data.dados.map(t => `
    <div class="card">
      <div class="card-header">
        <div class="card-title">🎓 ${t.codigo}</div>
        <span class="badge badge-blue">${t.totalAlunos} alunos</span>
      </div>
      <div style="margin-bottom:.5rem">
        <strong style="color:var(--text-1)">${t.materiaNome}</strong>
      </div>
      <div class="muted">👨‍🏫 ${t.professorNome}</div>
      <div class="muted">🕐 ${t.horario || 'Horário não definido'}</div>
    </div>
  `).join('');
}

// ── Matérias e Conteúdos ─────────────────────────────────────
async function carregarMaterias() {
  const res = await get('/materias');
  const el  = document.getElementById('materias-list');

  if (!res?.ok || !res.data.dados.length) {
    el.innerHTML = `<div class="empty-state">
      <span class="empty-icon">📚</span><p>Nenhuma matéria disponível.</p>
    </div>`;
    return;
  }

  el.innerHTML = '';
  for (const m of res.data.dados) {
    const divCard = document.createElement('div');
    divCard.className = 'card mb-2';
    divCard.innerHTML = `
      <div class="card-header" style="cursor:pointer" onclick="toggleConteudos('cont-${m.id}','${m.id}')">
        <div class="card-title">📚 ${m.nome}</div>
        <div style="display:flex;align-items:center;gap:.5rem">
          <span class="muted">${m.totalConteudos} conteúdo(s)</span>
          <span style="color:var(--text-3)">▼</span>
        </div>
      </div>
      <div class="muted mb-2">${m.descricao || ''}</div>
      <div id="cont-${m.id}" class="hidden"></div>
    `;
    el.appendChild(divCard);
  }
}

async function toggleConteudos(elId, materiaId) {
  const el = document.getElementById(elId);
  if (!el.classList.contains('hidden')) {
    el.classList.add('hidden'); return;
  }
  el.classList.remove('hidden');
  if (el.dataset.carregado) return;

  el.innerHTML = `<div class="muted">Carregando...</div>`;
  const res = await get(`/materias/${materiaId}/conteudos`);
  el.dataset.carregado = '1';

  if (!res?.ok || !res.data.dados.length) {
    el.innerHTML = `<div class="empty-state"><p>Nenhum conteúdo cadastrado.</p></div>`;
    return;
  }

  el.innerHTML = res.data.dados.map(c => `
    <div style="display:flex;align-items:center;justify-content:space-between;
      padding:.6rem .75rem;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:.4rem">
      <div>
        <span style="margin-right:.5rem">${c.jaLido ? '✅' : '📄'}</span>
        <strong style="color:var(--text-1)">${c.titulo}</strong>
      </div>
      <button class="btn btn-outline btn-sm" onclick="lerConteudo('${c.id}','${c.titulo}','${materiaId}')">
        ${c.jaLido ? 'Reler' : 'Ler'}
      </button>
    </div>
  `).join('');
}

async function lerConteudo(conteudoId, titulo, materiaId) {
  const res = await get(`/materias/${materiaId}/conteudos`);
  const conteudo = res?.data?.dados?.find(c => c.id === conteudoId);

  document.getElementById('conteudo-titulo').textContent = titulo;
  document.getElementById('conteudo-corpo').innerHTML =
    conteudo?.texto
      ? conteudo.texto.replace(/\n/g, '<br>')
      : '<p class="muted">Conteúdo não encontrado.</p>';

  abrirModal('modal-conteudo');

  // Registra leitura
  await post(`/materias/conteudos/${conteudoId}/leitura`);
}

// ── Atividades ────────────────────────────────────────────────
async function carregarAtividades() {
  const res = await get('/atividades');
  const el  = document.getElementById('atividades-list');

  if (!res?.ok || !res.data.dados.length) {
    el.innerHTML = `<div class="empty-state">
      <span class="empty-icon">📝</span><p>Nenhuma atividade disponível.</p>
    </div>`;
    return;
  }

  el.innerHTML = res.data.dados.map(a => `
    <div class="card mb-2" style="display:flex;align-items:center;justify-content:space-between;gap:1rem">
      <div>
        <div style="font-weight:600;color:var(--text-1);margin-bottom:.2rem">${a.titulo}</div>
        <div class="muted">📚 ${a.materiaNome} · ${a.totalPerguntas} pergunta(s)</div>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;flex-shrink:0">
        ${a.jaRealizada
          ? `<span class="badge badge-green">✓ Concluída</span>`
          : `<button class="btn btn-primary btn-sm" onclick="abrirQuiz('${a.id}','${a.titulo}')">
               Iniciar
             </button>`
        }
      </div>
    </div>
  `).join('');
}

// ── Quiz ──────────────────────────────────────────────────────
async function abrirQuiz(atividadeId, titulo) {
  document.getElementById('quiz-titulo').textContent = titulo;
  document.getElementById('quiz-body').innerHTML = `<div class="flex-center" style="padding:2rem"><span class="spinner"></span></div>`;
  abrirModal('modal-quiz');

  const res = await get(`/atividades/${atividadeId}`);
  if (!res?.ok) { toast('Erro ao carregar atividade.', 'error'); return; }

  atividadeAtual = res.data.dados;
  const { perguntas } = atividadeAtual;

  document.getElementById('quiz-body').innerHTML = perguntas.map((p, i) => `
    <div class="quiz-question">
      <p>${i + 1}. ${p.textoPergunta}</p>
      ${p.alternativas.map((alt, j) => `
        <label class="quiz-option" onclick="selecionarOpcao(this)">
          <input type="radio" name="q_${p.id}" value="${alt}" style="display:none">
          <span style="font-family:var(--font-mono);color:var(--accent);font-weight:700">
            ${String.fromCharCode(65 + j)})
          </span>
          ${alt}
        </label>
      `).join('')}
    </div>
  `).join('');
}

function selecionarOpcao(label) {
  const grupo = label.closest('.quiz-question').querySelectorAll('.quiz-option');
  grupo.forEach(l => l.classList.remove('selected'));
  label.classList.add('selected');
  label.querySelector('input[type="radio"]').checked = true;
}

async function submeterAtividade() {
  if (!atividadeAtual) return;

  const respostas = atividadeAtual.perguntas.map(p => {
    const input = document.querySelector(`input[name="q_${p.id}"]:checked`);
    return { perguntaId: p.id, respostaDada: input?.value || '' };
  });

  const naoRespondidas = respostas.filter(r => !r.respostaDada).length;
  if (naoRespondidas > 0) {
    toast(`Responda todas as perguntas (${naoRespondidas} pendente(s)).`, 'error'); return;
  }

  const res = await post('/atividades/submeter', {
    atividadeId: atividadeAtual.id,
    respostas
  });

  fecharModal('modal-quiz');

  if (res?.ok) {
    const r = res.data.dados.resultado;
    toast(`✅ ${r.acertos}/${r.totalPerguntas} acertos — ${r.porcentagem}%`, 'success');
    carregarAtividades();
    carregarInicio();
  } else {
    toast(res?.data?.mensagem || 'Erro ao submeter.', 'error');
  }
}

// ── Resultados ───────────────────────────────────────────────
async function carregarResultados() {
  const res = await get(`/relatorios/aluno/${user.cpf}`);
  const tbody = document.getElementById('resultados-tbody');

  if (!res?.ok || !res.data.dados.resultados.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center muted">Nenhum resultado ainda.</td></tr>`;
    return;
  }

  tbody.innerHTML = res.data.dados.resultados.reverse().map(r => `
    <tr>
      <td><strong>${r.atividadeTitulo}</strong></td>
      <td>${r.materiaNome}</td>
      <td>${r.acertos}/${r.totalPerguntas}</td>
      <td><span class="badge ${r.porcentagem >= 70 ? 'badge-green' : 'badge-red'}">${r.porcentagem}%</span></td>
      <td class="muted">${formatarData(r.realizadoEm)}</td>
    </tr>
  `).join('');
}
