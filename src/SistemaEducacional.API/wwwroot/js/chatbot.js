/* ================================================================
   chatbot.js — Assistente virtual do Lumina

   Widget flutuante disponível em todas as páginas. Conversa com o
   endpoint /api/chatbot, que resolve a dúvida por correspondência de
   palavras-chave sobre a base de conhecimento armazenada no banco.

   Fica ao lado do botão de acessibilidade, sem sobrepô-lo.
================================================================ */

(function () {
  'use strict';

  const CHATBOT_API = '/api/chatbot';

  // ── Estilos ────────────────────────────────────────────────────
  const estilos = `
    #lumina-chat-btn {
      position: fixed; right: 20px; bottom: 88px; z-index: 9998;
      width: 52px; height: 52px; border-radius: 50%;
      background: linear-gradient(135deg, #6b3fcf, #8b5cf6);
      border: none; cursor: pointer; color: #fff; font-size: 24px;
      box-shadow: 0 4px 16px rgba(107,63,207,.5);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s;
    }
    #lumina-chat-btn:hover  { transform: scale(1.08); }
    #lumina-chat-btn:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }

    #lumina-chat-painel {
      position: fixed; right: 20px; bottom: 150px; z-index: 9999;
      width: 340px; max-width: calc(100vw - 40px);
      height: 460px; max-height: calc(100vh - 200px);
      background: #16122a; border: 1px solid rgba(107,63,207,.4);
      border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,.6);
      display: none; flex-direction: column; overflow: hidden;
    }
    #lumina-chat-painel.aberto { display: flex; }

    .lumina-chat-topo {
      background: linear-gradient(135deg, #2d1f6e, #4a2f9a);
      padding: 12px 16px; display: flex; align-items: center;
      justify-content: space-between; flex-shrink: 0;
    }
    .lumina-chat-topo h4 { margin: 0; color: #fff; font-size: 15px; font-weight: 700; }
    .lumina-chat-topo button {
      background: none; border: none; color: #fff; font-size: 22px;
      cursor: pointer; line-height: 1; padding: 0 4px;
    }

    .lumina-chat-msgs {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .lumina-msg { max-width: 85%; padding: 10px 13px; border-radius: 14px; font-size: 14px; line-height: 1.45; }
    .lumina-msg.bot     { background: #1c1830; color: #e9e6f5; align-self: flex-start; border-bottom-left-radius: 4px; }
    .lumina-msg.usuario { background: #6b3fcf; color: #fff;    align-self: flex-end;   border-bottom-right-radius: 4px; }

    .lumina-sugestoes { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
    .lumina-sugestao {
      background: rgba(107,63,207,.18); border: 1px solid rgba(139,92,246,.5);
      color: #c4b5fd; border-radius: 999px; padding: 6px 11px;
      font-size: 12px; cursor: pointer; text-align: left;
    }
    .lumina-sugestao:hover { background: rgba(107,63,207,.35); }

    .lumina-chat-form {
      display: flex; gap: 8px; padding: 12px; border-top: 1px solid rgba(107,63,207,.25);
      flex-shrink: 0;
    }
    .lumina-chat-form input {
      flex: 1; background: #1c1830; border: 1px solid rgba(107,63,207,.35);
      border-radius: 999px; padding: 10px 14px; color: #fff; font-size: 14px;
    }
    .lumina-chat-form input:focus { outline: none; border-color: #8b5cf6; }
    .lumina-chat-form button {
      background: #6b3fcf; border: none; border-radius: 50%;
      width: 40px; height: 40px; color: #fff; cursor: pointer; font-size: 16px;
    }
    .lumina-chat-form button:disabled { opacity: .5; cursor: default; }

    /* Em telas pequenas o painel ocupa quase toda a largura */
    @media (max-width: 480px) {
      #lumina-chat-painel { right: 10px; left: 10px; width: auto; bottom: 140px; }
    }
  `;

  // ── Montagem do widget ─────────────────────────────────────────
  function montar() {
    const style = document.createElement('style');
    style.textContent = estilos;
    document.head.appendChild(style);

    const botao = document.createElement('button');
    botao.id = 'lumina-chat-btn';
    botao.innerHTML = '💬';
    botao.setAttribute('aria-label', 'Abrir assistente virtual');
    botao.setAttribute('title', 'Assistente virtual');

    const painel = document.createElement('div');
    painel.id = 'lumina-chat-painel';
    painel.setAttribute('role', 'dialog');
    painel.setAttribute('aria-label', 'Assistente virtual do Lumina');
    painel.innerHTML = `
      <div class="lumina-chat-topo">
        <h4>💬 Assistente Lumina</h4>
        <button type="button" aria-label="Fechar assistente">&times;</button>
      </div>
      <div class="lumina-chat-msgs" id="lumina-chat-msgs" aria-live="polite"></div>
      <form class="lumina-chat-form" id="lumina-chat-form">
        <input type="text" id="lumina-chat-input" placeholder="Digite sua dúvida..."
               autocomplete="off" maxlength="500" aria-label="Sua pergunta">
        <button type="submit" aria-label="Enviar pergunta">➤</button>
      </form>
    `;

    document.body.appendChild(botao);
    document.body.appendChild(painel);

    const msgs   = painel.querySelector('#lumina-chat-msgs');
    const form   = painel.querySelector('#lumina-chat-form');
    const input  = painel.querySelector('#lumina-chat-input');
    const fechar = painel.querySelector('.lumina-chat-topo button');

    let iniciado = false;

    botao.addEventListener('click', () => {
      painel.classList.toggle('aberto');
      if (painel.classList.contains('aberto')) {
        if (!iniciado) { iniciar(); iniciado = true; }
        input.focus();
      }
    });

    fechar.addEventListener('click', () => painel.classList.remove('aberto'));

    // Esc fecha o painel
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') painel.classList.remove('aberto');
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const texto = input.value.trim();
      if (!texto) return;
      input.value = '';
      await enviar(texto);
    });

    // ── Funções internas ─────────────────────────────────────────

    function adicionar(texto, tipo) {
      const div = document.createElement('div');
      div.className = `lumina-msg ${tipo}`;
      div.textContent = texto;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    function adicionarSugestoes(lista) {
      if (!lista || lista.length === 0) return;
      const wrap = document.createElement('div');
      wrap.className = 'lumina-sugestoes';
      lista.forEach(s => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'lumina-sugestao';
        b.textContent = s;
        b.addEventListener('click', () => enviar(s));
        wrap.appendChild(b);
      });
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    }

    /** Cabeçalhos com token, quando o usuário está autenticado. */
    function cabecalhos() {
      const h = { 'Content-Type': 'application/json' };
      try {
        const t = sessionStorage.getItem('token');
        if (t) h.Authorization = `Bearer ${t}`;
      } catch { /* sessionStorage indisponível */ }
      return h;
    }

    async function iniciar() {
      adicionar('Olá! Sou o assistente do Lumina. Como posso ajudar?', 'bot');
      try {
        const r = await fetch(`${CHATBOT_API}/sugestoes`, { headers: cabecalhos() });
        const j = await r.json();
        adicionarSugestoes(j?.dados ?? []);
      } catch {
        // Sem sugestões o usuário ainda pode digitar livremente
      }
    }

    async function enviar(pergunta) {
      adicionar(pergunta, 'usuario');
      const carregando = adicionar('digitando...', 'bot');

      try {
        const r = await fetch(`${CHATBOT_API}/perguntar`, {
          method: 'POST',
          headers: cabecalhos(),
          body: JSON.stringify({ pergunta })
        });
        const j = await r.json();
        const d = j?.dados;

        carregando.textContent = d?.resposta ?? 'Não consegui responder agora.';
        if (d && !d.entendeu) adicionarSugestoes(d.sugestoes);
      } catch {
        carregando.textContent = 'Não consegui falar com o servidor. Verifique sua conexão.';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
