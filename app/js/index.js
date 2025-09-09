/* script.js - lógica do Gerador de Micro-Conteúdos (MVP)
   - Geração aleatória por templates
   - Limite diário para não-premium
   - Salvar histórico local
   - Copiar, exportar (PDF) - exporta só se premium
   - Compras via Stripe Payment Link (sucesso.html salva premium=true)
*/

// ------------- CONFIG ----------------
const TEMPLATES = {
  post: [
    "3 motivos para amar [tema] 🍽️\nSabor autêntico, ingredientes frescos e atendimento rápido.\n👉 Reserve já!",
    "Você já experimentou [tema] aqui? 🤤\nComentário abaixo se já provou e sua opinião!",
    "Dica rápida sobre [tema]: escolha ingredientes locais para mais sabor.\n#local #qualidade",
    "Antes e depois: veja como [tema] transforma a experiência do cliente.\nMarque alguém que precisa ver!"
  ],
  tweet: [
    "Quer melhorar seu [tema]? 3 dicas: 1) X 2) Y 3) Z. #Dica #[tema]",
    "Curiosidade: [tema] pode aumentar sua produtividade. Saiba como.",
    "1 minuto de leitura: por que [tema] é importante para pequenos negócios."
  ],
  thread: [
    "[1/3] Você sabia que [problema relacionado a tema]? 👇",
    "[2/3] A razão é: [explicação curta]. Faça isso: [ação simples].",
    "[3/3] Resultado: [benefício]. CTA: compartilhe com alguém que precisa!"
  ],
  reel: [
    "Frame1: Mostrar problema – texto: 'Cansado de [problema]?' (3s)\nFrame2: Mostrar solução passo 1 (10s)\nFrame3: Resultado/antes-depois (10s)\nCTA: 'Link na bio!' (4s)",
    "Abertura: close no detalhe do produto (3s)\nMeio: passo a passo em 3 stages (20s)\nFechamento: oferta/CTA (5s)"
  ]
};

const LIMITE_DIARIO = 3; // gerações/dia para não premium
const STORAGE_PREFIX = 'gmc_'; // gerador micro conteudos

// DOM
const temaInput = document.getElementById('tema');
const tipoSelect = document.getElementById('tipo');
const gerarBtn = document.getElementById('gerar');
const resultadosEl = document.getElementById('resultados');
const copiarTudoBtn = document.getElementById('copiarTudo');
const exportarPDFBtn = document.getElementById('exportarPDF');
const limiteInfo = document.getElementById('limiteInfo');
const histList = document.getElementById('histList');
const limparHistBtn = document.getElementById('limparHist');

// util:
// checa premium
function isPremium(){ return localStorage.getItem(STORAGE_PREFIX + 'premium') === 'true'; }

// contador diário: guarda {date: 'YYYY-MM-DD', count: N}
function getDaily(){
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'daily') || null;
    if(!raw) return {date: todayStr(), count:0};
    const obj = JSON.parse(raw);
    if(obj.date !== todayStr()) return {date: todayStr(), count:0};
    return obj;
  } catch(e){
    return {date: todayStr(), count:0};
  }
}
function saveDaily(obj){ localStorage.setItem(STORAGE_PREFIX + 'daily', JSON.stringify(obj)); }
function todayStr(){ return new Date().toISOString().slice(0,10); }

// histórico (array)
function getHistory(){ return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'history') || "[]"); }
function saveHistory(h){ localStorage.setItem(STORAGE_PREFIX + 'history', JSON.stringify(h)); }

// UI update do limite
function updateLimitInfo(){
  if(isPremium()){
    limiteInfo.textContent = "✅ Premium: geração ilimitada.";
  } else {
    const d = getDaily();
    limiteInfo.textContent = `Grátis: ${d.count}/${LIMITE_DIARIO} gerações hoje.`;
  }
}

// geração aleatória
function pickRandom(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

// monta cards no DOM
function renderResults(list){
  resultadosEl.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    const tipo = document.createElement('div');
    tipo.className = 'tipo';
    tipo.textContent = item.tipo.toUpperCase();
    const p = document.createElement('p');
    p.textContent = item.text;
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const copiar = document.createElement('button');
    copiar.className = 'btn';
    copiar.textContent = 'Copiar';
    copiar.onclick = ()=>{ navigator.clipboard.writeText(item.text); alert('Copiado!'); };
    const salvar = document.createElement('button');
    salvar.className = 'btn';
    salvar.textContent = 'Salvar';
    salvar.onclick = ()=>{ saveToHistory(item); alert('Salvo no histórico local.'); renderHistory(); };
    actions.appendChild(copiar);
    actions.appendChild(salvar);
    if(item.tipo === 'thread'){
      const expand = document.createElement('button');
      expand.className='btn';
      expand.textContent = 'Expandir (cada tweet)';
      expand.onclick = ()=>{ alert(item.text.split('\n').join('\n\n')); };
      actions.appendChild(expand);
    }
    card.appendChild(tipo);
    card.appendChild(p);
    card.appendChild(actions);
    resultadosEl.appendChild(card);
  });
}

// salvar histórico
function saveToHistory(item){
  const hist = getHistory();
  hist.unshift({tema: item.tema, tipo: item.tipo, text: item.text, date: new Date().toISOString()});
  saveHistory(hist.slice(0,200)); // limite
}

// render histórico
function renderHistory(){
  const hist = getHistory();
  if(hist.length === 0){ histList.innerHTML = '<small style="color:var(--muted)">Nenhum histórico</small>'; return; }
  histList.innerHTML = '';
  hist.forEach(h=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.style.marginBottom='8px';
    el.innerHTML = `<div style="font-size:13px;color:var(--muted)">${h.tipo.toUpperCase()} • ${new Date(h.date).toLocaleString()}</div>
                    <div style="margin-top:6px;white-space:pre-wrap">${h.text}</div>`;
    histList.appendChild(el);
  });
}

// gerar lógica principal
function gerar(){
  const tema = temaInput.value.trim();
  if(!tema){ alert('Digite um tema ou palavra-chave!'); return; }

  // verifica limite diário
  if(!isPremium()){
    const d = getDaily();
    if(d.count >= LIMITE_DIARIO){ alert('Limite diário atingido! Torne-se Premium.'); return; }
    d.count++;
    saveDaily(d);
  }

  const tipo = tipoSelect.value;
  const results = [];

  if(tipo === 'thread'){
    // cria thread de 3 tweets
    const base = TEMPLATES.thread;
    const filled = base.map(s => s.replace(/\[tema\]/g, tema));
    results.push({tema, tipo:'thread', text: filled.join('\n\n')});
  } else {
    // gerar 5 variações
    const arr = TEMPLATES[tipo];
    for(let i=0;i<5;i++){
      const template = pickRandom(arr);
      const text = template.replace(/\[tema\]/g, tema);
      results.push({tema, tipo: tipo, text});
    }
  }

  renderResults(results);
  renderHistory();
  updateLimitInfo();
}

// copiar tudo
function copiarTudo(){
  const texts = Array.from(document.querySelectorAll('#resultados .card p')).map(p => p.textContent).join('\n\n');
  if(!texts) return alert('Nada para copiar!');
  navigator.clipboard.writeText(texts);
  alert('Todas as ideias copiadas!');
}

// exportar PDF (somente premium)
function exportarPDF(){
  if(!isPremium()){ return alert('Recurso premium. Compre para desbloquear.'); }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({unit:'pt', format:'a4'});
  const cards = Array.from(document.querySelectorAll('#resultados .card p')).map(p => p.textContent);
  if(cards.length === 0) return alert('Gere ideias antes!');
  let y = 40;
  doc.setFontSize(14);
  doc.text('Micro-conteúdos gerados', 40, 30);
  doc.setFontSize(11);
  cards.forEach((c, idx) => {
    const lines = doc.splitTextToSize((idx+1)+'. '+c, 500);
    doc.text(lines, 40, y);
    y += (lines.length * 14) + 10;
    if(y > 740){ doc.addPage(); y = 40; }
  });
  doc.save('micro_conteudos.pdf');
}

// limpar histórico
function limparHistorico(){
  if(!confirm('Limpar histórico local?')) return;
  localStorage.removeItem(STORAGE_PREFIX + 'history');
  renderHistory();
}

// init
window.addEventListener('load', () => {
  updateLimitInfo();
  renderHistory();

  gerarBtn.addEventListener('click', gerar);
  copiarTudoBtn.addEventListener('click', copiarTudo);
  exportarPDFBtn.addEventListener('click', exportarPDF);
  limparHistBtn.addEventListener('click', limparHistorico);

  // se premium, esconder botão comprar (opcional)
  if(isPremium()){
    const buy = document.getElementById('comprarLink');
    if(buy) buy.style.display = 'none';
  }
});
