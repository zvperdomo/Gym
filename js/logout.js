document.addEventListener('DOMContentLoaded', () => {
    // Eliminar los datos de sesión del usuario
    localStorage.removeItem('loggedInUser');
    // Redirigir al usuario a la página de inicio
    window.location.href = 'index.html'; // Redirige a la página de inicio
});

