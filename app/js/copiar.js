/******************************************************
 * Função: copiarTudo
 * Descrição: Copia todos os textos dos cards gerados
 * somente para usuários premium. Exibe notificações
 * de aviso ou sucesso usando showToast.
 ******************************************************/
export function copiarTudo(resultadosEl, showToast, isPremium) {
  // Verifica se o usuário é premium
  if (!isPremium()) {
    // Usuário não é premium, mostra aviso e encerra
    showToast('Recurso premium. Compre para desbloquear.', 'warning');
    return;
  }

  // Seleciona todos os elementos <p> dentro dos cards
  const texts = Array.from(resultadosEl.querySelectorAll('.card p'))
    // Extrai apenas o texto de cada <p>
    .map(p => p.textContent)
    // Junta todos os textos em uma única string separada por duas linhas
    .join('\n\n');

  // Verifica se há algum texto para copiar
  if (!texts) {
    // Nenhum texto encontrado, exibe aviso e encerra
    showToast('Nada para copiar!', 'warning');
    return;
  }

  // Copia o texto completo para a área de transferência
  navigator.clipboard.writeText(texts);

  // Exibe notificação de sucesso
  showToast('Todas as ideias copiadas!', 'success');
}
