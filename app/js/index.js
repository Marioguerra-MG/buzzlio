import { TEMPLATES } from './templetes/start.js';
import { gerar } from './gerar.js';
import { copiarTudo } from './copiar.js';
import { exportarPDF } from './exportar-pdf.js';
import { showToast } from './toast.js';
import * as premium from './premium.js';
import * as daily from './dailyLimit.js';
import { renderHistory, limparHistorico } from './history.js';

// ===== ELEMENTOS DO DOM =====
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

function updateLimitInfo() {
  if (premium.isPremium()) {
    const rest = premium.getPremiumRemaining();
    limiteInfo.textContent = rest
      ? `✅ Premium ativo • expira em ${rest.dias}d ${rest.horas}h`
      : "⏳ Premium expirado";
  } else {
    const dailyData = daily.getDailyByCategory();
    const catCount = dailyData.categories[categoriaSelect.value] || 0;
    limiteInfo.textContent = `Grátis: ${catCount}/1 geração hoje para ${categoriaSelect.value}`;
  }
}

// ===== INIT =====
window.addEventListener('load', () => {
  updateLimitInfo();
  renderHistory(histList, showToast);

  gerarBtn.addEventListener('click', () => gerar({
    TEMPLATES,
    temaInput,
    tipoSelect,
    categoriaSelect,
    resultadosEl,
    showToast,
    isPremium: premium.isPremium,
    getDailyByCategory: daily.getDailyByCategory,
    saveDailyByCategory: daily.saveDailyByCategory,
    renderHistory: () => renderHistory(histList, showToast),
    updateLimitInfo
  }));

  copiarTudoBtn.addEventListener('click', () => copiarTudo(resultadosEl, showToast, premium.isPremium));
  exportarPDFBtn.addEventListener('click', () => exportarPDF(resultadosEl, showToast, premium.isPremium));
  limparHistBtn.addEventListener('click', () => limparHistorico(histList, showToast));

  if (premium.isPremium()) {
    const buy = document.getElementById('comprarLink');
    if (buy) buy.style.display = 'none';
  }
});
