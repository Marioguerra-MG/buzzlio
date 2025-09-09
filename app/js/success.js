// Marca o usuário como Premium
localStorage.setItem("premium", "true");

// Botão para ir para o app
document.getElementById("goApp").addEventListener("click", () => {
  window.location.href = "/index.html"; // sua aplicação principal
});
