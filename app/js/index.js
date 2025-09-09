// ---------- CONFIG ----------
const TEMPLATES = {
  culinaria: {
    post: [
      "3 motivos para amar [tema] na cozinha 🍳 Receita rápida e sabor irresistível!",
      "Você já experimentou [tema]? 😋 Comente sua receita favorita!",
      "Dica rápida: [tema] deixa qualquer refeição mais especial. #culinaria",
      "Antes e depois: veja como [tema] transforma sua cozinha!",
      "Receita express: aprenda [tema] em menos de 15 minutos!",
      "Transforme seu jantar com [tema] hoje mesmo.",
      "Segredo da cozinha: [tema] é o toque final perfeito.",
      "Refeição completa: como [tema] faz toda diferença.",
      "Aproveite [tema] para criar pratos incríveis.",
      "Aprenda [tema] e impressione sua família!",
      "Experimente [tema] para um sabor único e delicioso.",
      "Dica de chef: como [tema] pode elevar suas receitas.",
      "Receita rápida de [tema] que todos vão adorar.",
      "Inove na cozinha usando [tema] de forma criativa.",
      "Cozinhar com [tema] nunca foi tão fácil!",
      "Receitas simples e deliciosas com [tema].",
      "Aprenda truques de cozinha usando [tema].",
      "Como [tema] transforma pratos comuns em especiais.",
      "Delícias em minutos: receitas com [tema].",
      "O segredo do sabor: [tema] na sua mesa.",
      "Prato perfeito: inclua [tema] na sua receita hoje.",
      "Receitas irresistíveis com [tema] para qualquer ocasião.",
      "Dicas rápidas para usar [tema] sem complicações.",
      "A magia do [tema] na cozinha: fácil e saborosa.",
      "Receitas de família com [tema]: tradição e sabor.",
      "Transforme qualquer refeição com [tema] agora.",
      "Inspiração do dia: crie algo novo com [tema].",
      "Como impressionar usando apenas [tema] na receita.",
      "Sugestões deliciosas com [tema] para o jantar.",
      "Receita prática de [tema] que todos vão adorar.",
      "Receitas gourmet fáceis com [tema].",
      "Aposte em [tema] e surpreenda sua família.",
      "Receitas rápidas e saborosas com [tema].",
      "Dicas de chef: receitas incríveis com [tema].",
      "Como [tema] pode salvar o seu jantar em minutos.",
      "Receitas saudáveis com [tema] para o dia a dia.",
      "O poder do [tema] em pratos simples e deliciosos.",
      "Receitas criativas com [tema] para impressionar amigos.",
      "Como preparar [tema] de forma fácil e rápida.",
      "Sugestão do dia: prato incrível com [tema].",
      "Aprenda a usar [tema] como um verdadeiro chef.",
      "Dicas de preparo: [tema] para receitas perfeitas.",
      "Receita express com [tema]: sabor em minutos.",
      "Como [tema] transforma o café da manhã em especial.",
      "Receita simples de [tema] que todos vão adorar.",
      "Experimente [tema] e surpreenda no almoço.",
      "Receitas incríveis com [tema] para qualquer ocasião.",
      "O segredo de uma refeição deliciosa: [tema].",
      "Aprenda receitas rápidas usando [tema] hoje mesmo.",
      "Receitas irresistíveis com [tema] que você precisa testar.",
      "Dicas de cozinha: como [tema] muda tudo.",
      "Receita prática e saborosa com [tema] em menos de 20 minutos."
    ],
  },

  marketingDigital: {
    post: [
      "Como [tema] pode aumentar suas vendas online 💻 3 passos rápidos para aplicar hoje!",
      "Estratégia de marketing: use [tema] para engajar seu público.",
      "Dica rápida: [tema] é essencial para crescer online.",
      "Antes e depois: veja os resultados de aplicar [tema] em sua campanha!",
      "Marketing digital eficiente: descubra como [tema] muda tudo.",
      "Aumente o alcance usando [tema]. #MarketingDigital",
      "Segredo de engajamento: [tema] aplicado corretamente.",
      "Transforme sua estratégia com [tema].",
      "Use [tema] para gerar leads e vendas rapidamente.",
      "Descubra o poder do [tema] no marketing online.",
      // ...continue até 50
    ],
  },

  fitness: {
    post: [
      "Treino rápido de [tema] para resultados visíveis 💪 Inclua na sua rotina diária!",
      "Dica fitness: como [tema] ajuda a manter a forma.",
      "Treine com [tema] e veja resultados impressionantes.",
      "Antes e depois: [tema] que faz diferença na performance.",
      "Exercício rápido de [tema] para iniciantes.",
      "Potencialize seu treino usando [tema].",
      "Descubra os benefícios do [tema] diariamente.",
      "Rotina fitness: [tema] é essencial para resultados.",
      "Como [tema] melhora força e resistência.",
      "Treinos curtos e eficientes com [tema].",
    ]
  }
};

const LIMITE_DIARIO = 3;
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

// Premium
function isPremium() { return localStorage.getItem(STORAGE_PREFIX + 'premium') === 'true'; }

// Contador diário
function getDaily() {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'daily');
    if (!raw) return { date: todayStr(), count: 0 };
    const obj = JSON.parse(raw);
    if (obj.date !== todayStr()) return { date: todayStr(), count: 0 };
    return obj;
  } catch (e) { return { date: todayStr(), count: 0 }; }
}
function saveDaily(obj) { localStorage.setItem(STORAGE_PREFIX + 'daily', JSON.stringify(obj)); }
function todayStr() { return new Date().toISOString().slice(0, 10); }

// Histórico
function getHistory() { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'history') || "[]"); }
function saveHistory(h) { localStorage.setItem(STORAGE_PREFIX + 'history', JSON.stringify(h)); }

// Atualiza limite
function updateLimitInfo() {
  if (isPremium()) { limiteInfo.textContent = "✅ Premium: geração ilimitada."; }
  else { const d = getDaily(); limiteInfo.textContent = `Grátis: ${d.count}/${LIMITE_DIARIO} gerações hoje.`; }
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
    const d = getDaily();
    if (d.count >= LIMITE_DIARIO) { showToast('Limite diário atingido! Torne-se Premium.', 'error'); return; }
    d.count++; saveDaily(d);
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

  // Evita múltiplas confirmações
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



// Init
window.addEventListener('load', () => {
  updateLimitInfo();
  renderHistory();
  gerarBtn.addEventListener('click', gerar);
  copiarTudoBtn.addEventListener('click', copiarTudo);
  exportarPDFBtn.addEventListener('click', exportarPDF);
  limparHistBtn.addEventListener('click', limparHistorico);
  if (isPremium()) { const buy = document.getElementById('comprarLink'); if (buy) buy.style.display = 'none'; }
});
