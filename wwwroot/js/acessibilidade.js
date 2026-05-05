/* acessibilidade.js — Widget de Acessibilidade Lumina
   Objetivo: prover recursos de alto contraste, controle de tamanho de texto
   e um glossário básico de LIBRAS para os principais termos do sistema,
   promovendo inclusão digital conforme princípios do PIM III. */

(function () {
  'use strict';

  const TERMOS_LIBRAS = [
    { termo: 'Matéria',    descricao: 'Mão em "M" com movimento circular no peito, indicando disciplina.' },
    { termo: 'Turma',      descricao: 'Mãos abertas voltadas para dentro, aproximando-se, representando grupo.' },
    { termo: 'Atividade',  descricao: 'Mão em "A" com movimento lateral repetido, indicando tarefa.' },
    { termo: 'Aluno',      descricao: 'Dedo indicador aponta para si mesmo, depois movimento para frente.' },
    { termo: 'Professor',  descricao: 'Mão em "P" com movimentos que remetem ao ato de ensinar.' },
    { termo: 'Conteúdo',   descricao: 'Mãos formando livro aberto, dedos em movimento de virar páginas.' },
    { termo: 'Avaliação',  descricao: 'Mão em "A" com movimento vertical descendente, como assinatura.' },
    { termo: 'Aprovado',   descricao: 'Polegar para cima com leve movimento afirmativo.' },
    { termo: 'Cadastro',   descricao: 'Mãos simulando escrita em papel com movimento suave.' },
    { termo: 'Sistema',    descricao: 'Mãos espalmadas girando uma ao redor da outra, indicando processo.' },
    { termo: 'Relatório',  descricao: 'Mão aberta inclinada para frente, simulando apresentação de dados.' },
    { termo: 'Resultado',  descricao: 'Mão em "R" movendo-se da frente para o lado, indicando conclusão.' },
  ];

  function criarPainel() {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.9rem">
        <strong style="font-size:.88rem;color:#e0d8ff">♿ Acessibilidade</strong>
        <button id="a11y-fechar" style="background:none;border:none;color:#888;cursor:pointer;font-size:1rem;line-height:1"
          aria-label="Fechar painel de acessibilidade">✕</button>
      </div>

      <div style="margin-bottom:.85rem">
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#777;margin-bottom:.35rem">
          Contraste
        </div>
        <button id="a11y-contrast-btn"
          style="width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);
          color:#ccc;border-radius:9px;padding:.45rem .85rem;cursor:pointer;font-size:.8rem;
          text-align:left;transition:border-color .2s">
          🔲 Ativar alto contraste
        </button>
      </div>

      <div style="margin-bottom:.85rem">
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#777;margin-bottom:.35rem">
          Tamanho do texto
        </div>
        <div style="display:flex;gap:.35rem" role="group" aria-label="Tamanho do texto">
          <button class="a11y-font-btn" data-size="normal"
            style="flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);
            color:#ccc;border-radius:9px;padding:.38rem;cursor:pointer;font-size:.78rem;transition:.2s"
            aria-label="Tamanho normal">A</button>
          <button class="a11y-font-btn" data-size="large"
            style="flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);
            color:#ccc;border-radius:9px;padding:.38rem;cursor:pointer;font-size:.92rem;transition:.2s"
            aria-label="Texto maior">A+</button>
          <button class="a11y-font-btn" data-size="larger"
            style="flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);
            color:#ccc;border-radius:9px;padding:.38rem;cursor:pointer;font-size:1.1rem;transition:.2s"
            aria-label="Texto ainda maior">A++</button>
        </div>
      </div>

      <div>
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#777;margin-bottom:.35rem">
          Glossário LIBRAS
        </div>
        <div role="list" style="max-height:195px;overflow-y:auto;border:1px solid rgba(255,255,255,.1);
          border-radius:9px;padding:.5rem .7rem;background:rgba(255,255,255,.03)">
          ${TERMOS_LIBRAS.map(t => `
            <div role="listitem" style="padding:.3rem 0;border-bottom:1px solid rgba(255,255,255,.06)">
              <div style="font-weight:600;font-size:.78rem;color:#c4b8e8">${t.termo}</div>
              <div style="font-size:.72rem;color:#7a6e99;line-height:1.45">${t.descricao}</div>
            </div>
          `).join('')}
          <div style="font-size:.65rem;color:#555;margin-top:.4rem;padding-top:.3rem">
            Ref.: Dicionário de Libras — INES (Instituto Nacional de Educação de Surdos)
          </div>
        </div>
      </div>
    `;
  }

  function init() {
    // Botão flutuante
    const botao = document.createElement('button');
    botao.id = 'a11y-toggle';
    botao.setAttribute('aria-label', 'Abrir painel de acessibilidade');
    botao.setAttribute('aria-haspopup', 'true');
    botao.title = 'Acessibilidade';
    botao.textContent = '♿';
    botao.style.cssText = [
      'position:fixed', 'bottom:1.5rem', 'right:1.5rem', 'z-index:9999',
      'background:#6b3fcf', 'color:#fff', 'border:none', 'border-radius:50%',
      'width:50px', 'height:50px', 'font-size:1.3rem', 'cursor:pointer',
      'box-shadow:0 4px 20px rgba(107,63,207,.65)', 'transition:transform .2s',
      'display:flex', 'align-items:center', 'justify-content:center',
    ].join(';');

    botao.addEventListener('mouseenter', () => { botao.style.transform = 'scale(1.12)'; });
    botao.addEventListener('mouseleave', () => { botao.style.transform = 'scale(1)'; });

    // Painel
    const painel = document.createElement('div');
    painel.id = 'a11y-panel';
    painel.setAttribute('role', 'dialog');
    painel.setAttribute('aria-label', 'Painel de acessibilidade');
    painel.style.cssText = [
      'position:fixed', 'bottom:4.5rem', 'right:1.5rem', 'z-index:9998',
      'background:#16122a', 'border:1px solid rgba(139,92,246,.4)',
      'border-radius:16px', 'padding:1.1rem', 'width:272px',
      'box-shadow:0 12px 40px rgba(0,0,0,.65)', 'display:none',
    ].join(';');
    painel.innerHTML = criarPainel();

    document.body.appendChild(botao);
    document.body.appendChild(painel);

    // Abrir/fechar painel
    botao.addEventListener('click', () => {
      const aberto = painel.style.display === 'block';
      painel.style.display = aberto ? 'none' : 'block';
      botao.setAttribute('aria-expanded', String(!aberto));
    });

    painel.querySelector('#a11y-fechar').addEventListener('click', () => {
      painel.style.display = 'none';
      botao.setAttribute('aria-expanded', 'false');
    });

    // Alto contraste
    const btnContraste = painel.querySelector('#a11y-contrast-btn');
    function atualizarContraste(ativo) {
      btnContraste.textContent = ativo
        ? '🔲 Desativar alto contraste'
        : '🔲 Ativar alto contraste';
      btnContraste.style.borderColor = ativo ? '#8b5cf6' : 'rgba(255,255,255,.15)';
    }
    btnContraste.addEventListener('click', () => {
      const ativo = document.body.classList.toggle('a11y-high-contrast');
      atualizarContraste(ativo);
      localStorage.setItem('a11y-contrast', ativo ? '1' : '0');
    });

    // Tamanho de texto
    painel.querySelectorAll('.a11y-font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tamanho = btn.dataset.size;
        document.body.classList.remove('a11y-text-large', 'a11y-text-larger');
        if (tamanho !== 'normal') document.body.classList.add(`a11y-text-${tamanho}`);
        localStorage.setItem('a11y-font', tamanho);
        painel.querySelectorAll('.a11y-font-btn').forEach(b => {
          b.style.borderColor = 'rgba(255,255,255,.15)';
          b.style.color = '#ccc';
        });
        btn.style.borderColor = '#8b5cf6';
        btn.style.color = '#a78bfa';
      });
    });

    // Restaurar preferências salvas
    const contrasteAtivo = localStorage.getItem('a11y-contrast') === '1';
    if (contrasteAtivo) {
      document.body.classList.add('a11y-high-contrast');
      atualizarContraste(true);
    }

    const tamanhoSalvo = localStorage.getItem('a11y-font') || 'normal';
    if (tamanhoSalvo !== 'normal') {
      document.body.classList.add(`a11y-text-${tamanhoSalvo}`);
      const btnAtivo = painel.querySelector(`.a11y-font-btn[data-size="${tamanhoSalvo}"]`);
      if (btnAtivo) {
        btnAtivo.style.borderColor = '#8b5cf6';
        btnAtivo.style.color = '#a78bfa';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
