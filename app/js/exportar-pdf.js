/******************************************************
 * Função: exportarPDF
 * Descrição: Gera um arquivo PDF com todos os textos
 * dos cards exibidos na tela. Funciona apenas para 
 * usuários premium e exibe notificações usando showToast.
 ******************************************************/
export function exportarPDF(resultadosEl, showToast, isPremium) {
  // Verifica se o usuário é premium
  if (!isPremium()) { 
    showToast('Recurso premium. Compre para desbloquear.', 'warning'); 
    return; 
  }

  // Cria uma nova instância do jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  // Seleciona todos os textos dos cards
  const cards = Array.from(resultadosEl.querySelectorAll('.card p'))
    .map(p => p.textContent);

  if (!cards.length) {
    // Se não houver cards, exibe aviso
    return showToast('Gere ideias antes!', 'warning');
  }

  // ===== TÍTULO PRINCIPAL =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40); // cinza escuro
  doc.text("Micro-conteúdos Gerados", 300, 40, { align: "center" });

  let y = 80; // posição inicial Y para os cards

  cards.forEach((c, idx) => {
    // ==== CARTÃO =====
    const cardWidth = 515;
    const cardHeight = 80;
    const x = 40;

    // Fundo do cartão (cinza clarinho)
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(x, y-20, cardWidth, cardHeight, 8, 8, "F");

    // Borda do cartão
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y-20, cardWidth, cardHeight, 8, 8, "S");

    // Texto do cartão
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50);
    const lines = doc.splitTextToSize((idx + 1) + ". " + c, cardWidth - 20);
    doc.text(lines, x + 10, y);

    y += cardHeight + 20; // espaço entre cartões

    // Quebra de página se necessário
    if (y + cardHeight > 800) { 
      doc.addPage(); 
      y = 80; 
    }
  });

  // ===== RODAPÉ =====
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++){
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount}`, 300, 820, { align: "center" });
  }

  // Salva o PDF
  doc.save("micro_conteudos.pdf");
  showToast('PDF gerado com sucesso!', 'success');
}
