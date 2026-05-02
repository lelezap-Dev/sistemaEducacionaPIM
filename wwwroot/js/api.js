/* ================================================================
   api.js — Funções para comunicar com a API ASP.NET Core
   Toda chamada HTTP passa por aqui. Centraliza token, erros, etc.
================================================================ */

const API_BASE = 'http://localhost:5000/api';

// ── Token JWT ──────────────────────────────────────────────────
const Auth = {
  getToken:  () => sessionStorage.getItem('token'),
  getUser:   () => JSON.parse(sessionStorage.getItem('user') || 'null'),
  getPerfil: () => sessionStorage.getItem('perfil'),

  salvar(dados) {
    sessionStorage.setItem('token',  dados.token);
    sessionStorage.setItem('perfil', dados.perfil);
    sessionStorage.setItem('user',   JSON.stringify(dados));
  },

  limpar() {
    sessionStorage.clear();
  },

  estaLogado() {
    return !!this.getToken();
  }
};

// ── Fetch centralizado ─────────────────────────────────────────
async function api(method, endpoint, body = null) {
  const headers = { 'Content-Type': 'application/json' };

  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const res  = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    if (res.status === 401) {
      Auth.limpar();
      window.location.href = '/index.html';
      return null;
    }

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error('Erro de rede:', err);
    return { ok: false, status: 0, data: { mensagem: 'Erro de conexão com o servidor.' } };
  }
}

// ── Helpers HTTP ──────────────────────────────────────────────
const get  = (ep)       => api('GET',    ep);
const post = (ep, body) => api('POST',   ep, body);
const put  = (ep, body) => api('PUT',    ep, body);
const del  = (ep)       => api('DELETE', ep);

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, tipo = 'success') {
  const container = document.getElementById('toast-container') || criarToastContainer();

  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.innerHTML = `
    <span class="toast-icon">${tipo === 'success' ? '✓' : tipo === 'error' ? '✕' : 'ℹ'}</span>
    <span>${msg}</span>
  `;

  container.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

function criarToastContainer() {
  const el = document.createElement('div');
  el.id = 'toast-container';
  document.body.appendChild(el);

  const style = document.createElement('style');
  style.textContent = `
    #toast-container {
      position: fixed; bottom: 1.5rem; right: 1.5rem;
      display: flex; flex-direction: column; gap: .5rem;
      z-index: 9999;
    }
    .toast {
      display: flex; align-items: center; gap: .6rem;
      padding: .75rem 1.2rem;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      font-size: .9rem;
      color: var(--text-1);
      transform: translateX(120%);
      transition: transform .3s ease;
      min-width: 240px;
    }
    .toast.show { transform: translateX(0); }
    .toast-success { border-left: 3px solid var(--accent); }
    .toast-success .toast-icon { color: var(--accent); }
    .toast-error   { border-left: 3px solid var(--red); }
    .toast-error   .toast-icon { color: var(--red); }
    .toast-info    { border-left: 3px solid var(--blue); }
    .toast-info    .toast-icon { color: var(--blue); }
  `;
  document.head.appendChild(style);
  return el;
}

// ── Modal helpers (Bootstrap 5) ────────────────────────────────
function abrirModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const m = bootstrap.Modal.getOrCreateInstance(el);
  m.show();
}

function fecharModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const m = bootstrap.Modal.getInstance(el);
  if (m) m.hide();
}

// ── Loader ─────────────────────────────────────────────────────
function mostrarLoader(btn) {
  if (!btn) return;
  btn._textoOriginal = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Aguarde...`;
}

function esconderLoader(btn) {
  if (!btn || !btn._textoOriginal) return;
  btn.disabled = false;
  btn.innerHTML = btn._textoOriginal;
}

// ── Formatadores ───────────────────────────────────────────────
function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function formatarPorcentagem(acertos, total) {
  if (!total) return '0%';
  return ((acertos / total) * 100).toFixed(1) + '%';
}

function cpfMask(cpf) {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// ── Navegação entre seções do dashboard ──────────────────────
function navegarPara(secaoId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));

  const secao = document.getElementById(secaoId);
  if (secao) secao.classList.add('active');

  const item = document.querySelector(`[data-secao="${secaoId}"]`);
  if (item) item.classList.add('active');
}
