// Modal Premium
const modal = document.getElementById('modalPlanos');
const btnComprar = document.getElementById('comprarLink');
const btnFechar = document.getElementById('closeModalPlanos');
if (btnComprar) {
    btnComprar.addEventListener('click', (e) => {
        e.preventDefault(); // evita ir direto pro link
        modal.style.display = 'flex'; // use 'flex' se seu modal é flex
    });
}

if (btnFechar) {
    btnFechar.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
