document.addEventListener('DOMContentLoaded', () => {
    // Obtener el usuario actualmente logueado desde el almacenamiento local
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Verificar si el usuario está logueado
    if (loggedInUser) {
        // Comprobar el rol del usuario para mostrar funcionalidades específicas
        if (loggedInUser.role === 'admin') {
            // Si el usuario es administrador, mostrar las funcionalidades de administrador
            // Aquí puedes agregar el código para mostrar elementos específicos para el administrador
            console.log('Mostrar funcionalidades de administrador');
        } else if (loggedInUser.role === 'viewer') {
            // Si el usuario es visualizador, mostrar las funcionalidades de visualizador
            // Aquí puedes agregar el código para mostrar elementos específicos para el visualizador
            console.log('Mostrar funcionalidades de visualizador');
        }
    }
});

