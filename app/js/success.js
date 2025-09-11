const STORAGE_PREFIX = 'gmc_';

// Marca o usuário como Premium por 30 dias
const expires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 dias
localStorage.setItem(STORAGE_PREFIX + 'premiumData', JSON.stringify({ expires }));

// Flag adicional (opcional)
localStorage.setItem(STORAGE_PREFIX + 'premium', "true");

// Botão para ir para o app
document.getElementById("goApp").addEventListener("click", () => {
  window.location.href = "/index.html"; // página principal do app
});
