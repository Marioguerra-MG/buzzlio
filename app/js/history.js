/******************************************************
 * Módulo: Histórico de Ideias
 * Descrição: Gerencia armazenamento, renderização
 * e limpeza do histórico de ideias no localStorage.
 ******************************************************/
const STORAGE_PREFIX = 'gmc_';

/**
 * Retorna o histórico salvo no localStorage
 */
export function getHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'history') || "[]");
}

/**
 * Salva o histórico no localStorage
 * @param {Array} hist - lista de ideias
 */
export function saveHistory(hist) {
  localStorage.setItem(STORAGE_PREFIX + 'history', JSON.stringify(hist));
}

/**
 * Adiciona uma nova ideia ao histórico
 * @param {Object} ideia - objeto {tipo, categoria, text}
 */
export function addHistory(ideia) {
  const hist = getHistory();
  hist.unshift({ ...ideia, date: Date.now() }); // adiciona data única
  saveHistory(hist);
}

/**
 * Renderiza o histórico como cards
 * @param {HTMLElement} histList - container do histórico
 * @param {Function} showToast - função para exibir toasts
 */
export function renderHistory(histList, showToast, isPremium) {
  const hist = getHistory();

  if (!hist.length) {
    histList.innerHTML = '<small style="color:var(--muted)">Nenhum histórico</small>';
    return;
  }

  histList.innerHTML = '';
  histList.style.display = 'grid';
  histList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
  histList.style.gap = '16px';

  // Contador de cópias grátis já realizadas
  const freeCopiedCount = hist.filter(h => !h.premium && h.copied).length;

  hist.forEach(h => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.position = 'relative';

    const tipoDiv = document.createElement('div');
    tipoDiv.className = 'tipo';
    tipoDiv.textContent = `${h.tipo.toUpperCase()} • ${h.categoria} • ${new Date(h.date).toLocaleString()}`;

    const p = document.createElement('p');
    p.textContent = h.text;
    p.style.cursor = 'text';
    p.style.marginBottom = '10px';

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    // Botão Copiar
    const copiarBtn = document.createElement('button');
    copiarBtn.className = 'btn';
    copiarBtn.textContent = 'Copiar';

    // Se usuário grátis e já copiou 5, desabilita o botão
    if (!isPremium && freeCopiedCount >= 5 && !h.premium) {
      copiarBtn.disabled = true;
      copiarBtn.textContent = 'Limite atingido';
    }

    copiarBtn.addEventListener('click', () => {
      if (!isPremium && freeCopiedCount >= 5 && !h.premium) {
        showToast('Limite de cópias grátis atingido!', 'error');
        return;
      }

      navigator.clipboard.writeText(p.textContent);
      showToast('Copiado!', 'success');

      // Marca como copiado
      if (!h.premium) h.copied = true;
      saveHistory(hist);
    });

    // Botão Editar
    const editarBtn = document.createElement('button');
    editarBtn.className = 'btn';
    editarBtn.textContent = 'Editar';
    editarBtn.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'rgba(255,255,255,0.95)';
      overlay.style.border = '1px solid #ccc';
      overlay.style.borderRadius = 'var(--radius)';
      overlay.style.padding = '10px';
      overlay.style.boxSizing = 'border-box';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.justifyContent = 'space-between';
      overlay.style.zIndex = 1000;

      const textarea = document.createElement('textarea');
      textarea.value = p.textContent;
      textarea.style.width = '100%';
      textarea.style.height = '80%';
      textarea.style.fontFamily = 'inherit';
      textarea.style.fontSize = 'inherit';
      textarea.style.padding = '5px';
      textarea.style.boxSizing = 'border-box';
      textarea.style.resize = 'none';

      const salvarBtn = document.createElement('button');
      salvarBtn.className = 'btn';
      salvarBtn.textContent = 'Salvar';
      salvarBtn.style.marginTop = '5px';
      salvarBtn.addEventListener('click', () => {
        const histAtual = getHistory();
        const idx = histAtual.findIndex(item => item.date === h.date);
        if (idx !== -1) {
          histAtual[idx].text = textarea.value;
          saveHistory(histAtual);
        }
        overlay.remove();
        renderHistory(histList, showToast, isPremium);
        showToast('Editado com sucesso!', 'success');
      });

      overlay.appendChild(textarea);
      overlay.appendChild(salvarBtn);
      card.appendChild(overlay);
      textarea.focus();
    });

    actions.appendChild(copiarBtn);
    actions.appendChild(editarBtn);

    card.appendChild(tipoDiv);
    card.appendChild(p);
    card.appendChild(actions);

    histList.appendChild(card);
  });
}

/**
 * Limpa todo o histórico com confirmação
 * @param {HTMLElement} histList 
 * @param {Function} showToast 
 */
export function limparHistorico(histList, showToast) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  if (container.querySelector('.toast-confirm')) return;

  const toast = document.createElement('div');
  toast.className = 'toast-confirm';
  toast.innerHTML = `
    <div>Tem certeza que deseja limpar o histórico?</div>
    <div style="margin-top:10px;">
      <button id="confirmYes">Sim</button>
      <button id="confirmNo">Não</button>
    </div>
  `;
  container.appendChild(toast);

  document.getElementById('confirmYes').onclick = () => {
    localStorage.removeItem(STORAGE_PREFIX + 'history');
    renderHistory(histList, showToast);
    showToast('Histórico limpo!', 'success');
    container.removeChild(toast);
  };

  document.getElementById('confirmNo').onclick = () => {
    container.removeChild(toast);
  };
}
