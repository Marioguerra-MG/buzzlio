import { addHistory, renderHistory as renderHistoryFunc, getHistory } from './history.js';

export function gerar({
  TEMPLATES,
  temaInput,
  tipoSelect,
  categoriaSelect,
  resultadosEl,
  showToast,
  isPremium,
  getDailyByCategory,
  saveDailyByCategory,
  renderHistory,
  updateLimitInfo
}) {
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const tema = temaInput.value.trim();
  const tipo = tipoSelect.value;
  const categoria = categoriaSelect.value;

  if (!tema) {
    showToast('Digite um tema!', 'warning');
    return;
  }

  if (!TEMPLATES[categoria] || !TEMPLATES[categoria][tipo]) {
    showToast('Não há templates para essa categoria/tipo', 'error');
    return;
  }

  // ====== Limite diário ======
  if (!isPremium()) {
    const daily = getDailyByCategory();
    const catCount = daily.categories[categoria] || 0;
    if (catCount >= 1) {
      showToast('Limite diário para esta categoria atingido! Torne-se Premium.', 'error');
      return;
    }
    daily.categories[categoria] = catCount + 1;
    daily.date = new Date().toISOString().slice(0, 10);
    saveDailyByCategory(daily);
  }

  const arr = TEMPLATES[categoria][tipo];
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push({
      tema,
      tipo,
      categoria,
      text: pickRandom(arr).replace(/\[tema\]/g, tema)
    });
  }

  resultadosEl.innerHTML = '';

  // ====== Contadores para limites free ======
  const hist = getHistory();
  let freeSaved = hist.filter(h => !h.premium).length;
  let freeEdited = hist.filter(h => !h.premium && h.edited).length;
  let freeCopied = hist.filter(h => !h.premium && h.copied).length;

  results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.position = 'relative';

    const tipoDiv = document.createElement('div');
    tipoDiv.className = 'tipo';
    tipoDiv.textContent = `${item.tipo.toUpperCase()} • ${item.categoria}`;

    const p = document.createElement('p');
    p.textContent = item.text;
    p.style.cursor = 'text';
    p.style.marginBottom = '10px';

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    // ====== Copiar ======
    const copiarBtn = document.createElement('button');
    copiarBtn.className = 'btn';
    copiarBtn.textContent = 'Copiar';
    if (!isPremium() && freeCopied >= 5) {
      copiarBtn.disabled = true;
      copiarBtn.textContent = 'Limite atingido';
    }
    copiarBtn.addEventListener('click', () => {
      if (!isPremium() && freeCopied >= 5) {
        showToast('Limite de cópias grátis atingido!', 'error');
        return;
      }
      navigator.clipboard.writeText(p.textContent);
      showToast('Copiado!', 'success');

      if (!isPremium()) freeCopied++;
      // Marca como copiado no histórico
      addHistory({
        tema: item.tema,
        tipo: item.tipo,
        categoria: item.categoria,
        text: p.textContent,
        premium: isPremium(),
        copied: true
      });
      renderHistoryFunc(document.getElementById('histList'), showToast, isPremium);
    });

    // ====== Editar ======
    const editarBtn = document.createElement('button');
    editarBtn.className = 'btn';
    editarBtn.textContent = 'Editar';
    if (!isPremium() && freeEdited >= 5) {
      editarBtn.disabled = true;
      editarBtn.textContent = 'Limite atingido';
    }
    editarBtn.addEventListener('click', () => {
      if (!isPremium() && freeEdited >= 5) {
        showToast('Limite de edições para usuários grátis atingido!', 'error');
        return;
      }

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

      const salvarEditBtn = document.createElement('button');
      salvarEditBtn.textContent = 'Salvar';
      salvarEditBtn.className = 'btn';
      salvarEditBtn.style.marginTop = '5px';
      salvarEditBtn.onclick = () => {
        p.textContent = textarea.value;
        if (!isPremium()) freeEdited++;
        overlay.remove();
      };

      overlay.appendChild(textarea);
      overlay.appendChild(salvarEditBtn);
      card.appendChild(overlay);
      textarea.focus();
    });

    // ====== Salvar ======
    const salvarBtn = document.createElement('button');
    salvarBtn.className = 'btn';
    salvarBtn.textContent = 'Salvar';
    if (!isPremium() && freeSaved >= 5) {
      salvarBtn.disabled = true;
      salvarBtn.textContent = 'Limite atingido';
    }
    salvarBtn.addEventListener('click', () => {
      if (!isPremium() && freeSaved >= 5) {
        showToast('Limite de salvamentos para usuários grátis atingido!', 'error');
        return;
      }
      addHistory({
        tema: item.tema,
        tipo: item.tipo,
        categoria: item.categoria,
        text: p.textContent,
        premium: isPremium(),
        edited: false
      });
      if (!isPremium()) freeSaved++;
      showToast('Salvo no histórico.', 'success');
      renderHistoryFunc(document.getElementById('histList'), showToast, isPremium);
    });

    actions.appendChild(copiarBtn);
    actions.appendChild(editarBtn);
    actions.appendChild(salvarBtn);

    card.appendChild(tipoDiv);
    card.appendChild(p);
    card.appendChild(actions);

    resultadosEl.appendChild(card);
  });

  renderHistoryFunc(document.getElementById('histList'), showToast, isPremium);
  updateLimitInfo();
}
