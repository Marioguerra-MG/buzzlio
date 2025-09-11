/******************************************************
 * Modal Premium
 * Controle de exibição do modal que oferece a compra
 * de planos premium.
 ******************************************************/

// Seleciona elementos do modal
const modal = document.getElementById('modalPlanos');     // o container do modal
const btnComprar = document.getElementById('comprarLink'); // botão que abre o modal
const btnFechar = document.getElementById('closeModalPlanos'); // botão de fechar modal

// ===== Evento: Abrir modal ao clicar em "Comprar" =====
if (btnComprar) {
    btnComprar.addEventListener('click', (e) => {
        e.preventDefault();           // evita que o link abra uma nova página
        modal.style.display = 'flex'; // mostra o modal (flex se estiver usando display flex)
    });
}

// ===== Evento: Fechar modal ao clicar no "X" =====
if (btnFechar) {
    btnFechar.addEventListener('click', () => {
        modal.style.display = 'none'; // esconde o modal
    });
}

// ===== Evento: Fechar modal ao clicar fora do conteúdo =====
window.addEventListener('click', (e) => {
    if (e.target === modal) {       // se o clique for no fundo do modal
        modal.style.display = 'none'; // fecha o modal
    }
});
