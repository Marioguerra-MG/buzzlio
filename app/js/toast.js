/******************************************************
 * Função: showToast
 * Mostra uma notificação temporária (toast) na tela
 *
 * Parâmetros:
 *  msg  - mensagem que será exibida
 *  type - tipo da mensagem: 'info' (padrão), 'success', 'error', 'warning'
 ******************************************************/
export function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container'); // container onde os toasts vão aparecer
  if (!container) return; // se não existir, sai da função

  // Cria o elemento do toast
  const toast = document.createElement('div');
  toast.className = 'toast';  // classe padrão para estilização via CSS
  toast.textContent = msg;     // define a mensagem

  // Define cores de fundo conforme tipo
  if (type === 'success') toast.style.backgroundColor = '#4CAF50'; // verde
  if (type === 'error') toast.style.backgroundColor = '#f44336';   // vermelho
  if (type === 'warning') toast.style.backgroundColor = '#ff9800'; // laranja

  // Adiciona o toast no container
  container.appendChild(toast);

  // Remove automaticamente após 4 segundos
  setTimeout(() => {
    container.removeChild(toast);
  }, 4000);
}
