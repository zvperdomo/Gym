// Escucha el evento 'DOMContentLoaded' para asegurarse de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Elimina los datos de sesión del usuario almacenados en el localStorage
    localStorage.removeItem('loggedInUser');
    
    // Redirige al usuario a la página de inicio (index.html)
    window.location.href = 'index.html';
});


