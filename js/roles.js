document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        if (loggedInUser.role === 'admin') {
            // Mostrar funcionalidades de administrador
        } else if (loggedInUser.role === 'viewer') {
            // Mostrar funcionalidades de visualizador
        }
    }
});
