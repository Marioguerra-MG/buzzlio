import { TEMPLATES } from '/app/js/templetes/start.js';

const STORAGE_PREFIX = 'gmc_';

// DOM
const temaInput = document.getElementById('tema');
const tipoSelect = document.getElementById('tipo');
const categoriaSelect = document.getElementById('categoria');
const gerarBtn = document.getElementById('gerar');
const resultadosEl = document.getElementById('resultados');
const copiarTudoBtn = document.getElementById('copiarTudo');
const exportarPDFBtn = document.getElementById('exportarPDF');
const limiteInfo = document.getElementById('limiteInfo');
const histList = document.getElementById('histList');
const limparHistBtn = document.getElementById('limparHist');

// ---------- TOAST ----------
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;

  if (type === 'success') toast.style.backgroundColor = '#4CAF50';
  if (type === 'error') toast.style.backgroundColor = '#f44336';
  if (type === 'warning') toast.style.backgroundColor = '#ff9800';

  container.appendChild(toast);

  setTimeout(() => { container.removeChild(toast); }, 4000);
}

// ---------- FUNÇÕES ----------

// Premium com expiração (30 dias)
function isPremium() {
  const raw = localStorage.getItem(STORAGE_PREFIX + 'premiumData');
  if (!raw) return false;

  try {
    const obj = JSON.parse(raw);
    if (Date.now() > obj.expires) {
      localStorage.removeItem(STORAGE_PREFIX + 'premiumData');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function ativarPremium() {
  const expires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 dias
  localStorage.setItem(STORAGE_PREFIX + 'premiumData', JSON.stringify({ expires }));
  updateLimitInfo();
}

// Retorna quanto tempo falta do Premium
function getPremiumRemaining() {
  const raw = localStorage.getItem(STORAGE_PREFIX + 'premiumData');
  if (!raw) return null;
  const obj = JSON.parse(raw);
  const diff = obj.expires - Date.now();
  if (diff <= 0) return null;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return { dias, horas };
}

// Limite diário por categoria
function getDailyByCategory() {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'dailyByCat');
    const data = raw ? JSON.parse(raw) : {};
    if (data.date !== todayStr()) return { date: todayStr(), categories: {} };
    return data;
  } catch (e) { return { date: todayStr(), categories: {} }; }
}

function saveDailyByCategory(obj) {
  localStorage.setItem(STORAGE_PREFIX + 'dailyByCat', JSON.stringify(obj));
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

// Histórico
function getHistory() { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'history') || "[]"); }
function saveHistory(h) { localStorage.setItem(STORAGE_PREFIX + 'history', JSON.stringify(h)); }

// Atualiza limite
function updateLimitInfo() {
  if (isPremium()) {
    const rest = getPremiumRemaining();
    if (rest) {
      limiteInfo.textContent = `✅ Premium ativo • expira em ${rest.dias}d ${rest.horas}h`;
    } else {
      limiteInfo.textContent = "⏳ Premium expirado";
    }
  } else {
    const daily = getDailyByCategory();
    const cat = categoriaSelect.value;
    const count = daily.categories[cat] || 0;
    limiteInfo.textContent = `Grátis: ${count}/1 geração hoje para ${cat}`;
  }
}

// Aleatório
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Renderiza resultados
function renderResults(list) {
  resultadosEl.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    const tipo = document.createElement('div');
    tipo.className = 'tipo';
    tipo.textContent = `${item.tipo.toUpperCase()} • ${item.categoria}`;
    const p = document.createElement('p');
    p.textContent = item.text;
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const copiar = document.createElement('button');
    copiar.className = 'btn';
    copiar.textContent = 'Copiar';
    copiar.onclick = () => { navigator.clipboard.writeText(item.text); showToast('Copiado!', 'success'); };
    const salvar = document.createElement('button');
    salvar.className = 'btn';
    salvar.textContent = 'Salvar';
    salvar.onclick = () => { saveToHistory(item); showToast('Salvo no histórico.', 'success'); renderHistory(); };
    actions.appendChild(copiar);
    actions.appendChild(salvar);
    card.appendChild(tipo);
    card.appendChild(p);
    card.appendChild(actions);
    resultadosEl.appendChild(card);
  });
}

// Salvar histórico
function saveToHistory(item) {
  const hist = getHistory();
  hist.unshift({ tema: item.tema, tipo: item.tipo, categoria: item.categoria, text: item.text, date: new Date().toISOString() });
  saveHistory(hist.slice(0, 200));
}

// Render histórico
function renderHistory() {
  const hist = getHistory();
  if (hist.length === 0) { histList.innerHTML = '<small style="color:var(--muted)">Nenhum histórico</small>'; return; }
  histList.innerHTML = '';
  hist.forEach(h => {
    const el = document.createElement('div');
    el.className = 'card';
    el.style.marginBottom = '8px';
    el.innerHTML = `<div style="font-size:13px;color:var(--muted)">${h.tipo.toUpperCase()} • ${h.categoria} • ${new Date(h.date).toLocaleString()}</div>
                  <div style="margin-top:6px;white-space:pre-wrap">${h.text}</div>`;
    histList.appendChild(el);
  });
}

// Gerar ideias
function gerar() {
  const tema = temaInput.value.trim();
  const tipo = tipoSelect.value;
  const categoria = categoriaSelect.value;
  if (!tema) { showToast('Digite um tema!', 'warning'); return; }
  if (!TEMPLATES[categoria] || !TEMPLATES[categoria][tipo]) { showToast('Não há templates para essa categoria/tipo', 'error'); return; }

  if (!isPremium()) {
    const daily = getDailyByCategory();
    const catCount = daily.categories[categoria] || 0;
    if (catCount >= 1) { showToast('Limite diário para esta categoria atingido! Torne-se Premium.', 'error'); return; }
    daily.categories[categoria] = catCount + 1;
    daily.date = todayStr();
    saveDailyByCategory(daily);
  }

  const arr = TEMPLATES[categoria][tipo];
  const results = [];
  for (let i = 0; i < 5; i++) { results.push({ tema, tipo, categoria, text: pickRandom(arr).replace(/\[tema\]/g, tema) }); }

  renderResults(results);
  renderHistory();
  updateLimitInfo();
}

// Copiar tudo
function copiarTudo() {
  const texts = Array.from(document.querySelectorAll('#resultados .card p')).map(p => p.textContent).join('\n\n');
  if (!texts) return showToast('Nada para copiar!', 'warning');
  navigator.clipboard.writeText(texts); showToast('Todas as ideias copiadas!', 'success');
}

// Exportar PDF
function exportarPDF() {
  if (!isPremium()) { showToast('Recurso premium. Compre para desbloquear.', 'warning'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const cards = Array.from(document.querySelectorAll('#resultados .card p')).map(p => p.textContent);
  if (cards.length === 0) return showToast('Gere ideias antes!', 'warning');
  let y = 40; doc.setFontSize(14); doc.text('Micro-conteúdos gerados', 40, 30); doc.setFontSize(11);
  cards.forEach((c, idx) => {
    const lines = doc.splitTextToSize((idx + 1) + '. ' + c, 500);
    doc.text(lines, 40, y); y += (lines.length * 14) + 10; if (y > 740) { doc.addPage(); y = 40; }
  });
  doc.save('micro_conteudos.pdf');
  showToast('PDF gerado com sucesso!', 'success');
}

// Limpar histórico com toast centralizado
function limparHistorico() {
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
    renderHistory();
    showToast('Histórico limpo!', 'success');
    container.removeChild(toast);
  };

  document.getElementById('confirmNo').onclick = () => {
    container.removeChild(toast);
  };
}

// ---------- Auto ativar Premium na página de Obrigado ----------
function autoPremium() {
  // Exemplo: checa se URL tem "obrigado" para ativar premium
  if (window.location.href.includes('obrigado')) {
    if (!isPremium()) {
      ativarPremium();
      showToast('Premium ativado automaticamente por 30 dias!', 'success');
    }
  }
}

// Init
window.addEventListener('load', () => {
  autoPremium(); // ativa premium se estiver na página de obrigado
  updateLimitInfo();
  renderHistory();
  gerarBtn.addEventListener('click', gerar);
  copiarTudoBtn.addEventListener('click', copiarTudo);
  exportarPDFBtn.addEventListener('click', exportarPDF);
  limparHistBtn.addEventListener('click', limparHistorico);

  if (isPremium()) { 
    const buy = document.getElementById('comprarLink'); 
    if (buy) buy.style.display = 'none'; 
  }

  const ativarPremiumBtn = document.getElementById('ativarPremium');
  if (ativarPremiumBtn) {
    ativarPremiumBtn.addEventListener('click', () => {
      ativarPremium();
      showToast('Premium ativado por 30 dias!', 'success');
      if (document.getElementById('comprarLink')) document.getElementById('comprarLink').style.display = 'none';
    });
  }
});
