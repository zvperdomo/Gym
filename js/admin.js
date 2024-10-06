// Escucha el evento 'DOMContentLoaded', que asegura que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    
    // Recupera el usuario actualmente logueado desde localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    /* 
        Verifica si no hay un usuario logueado o si el usuario no tiene el rol de 'admin'.
        Si alguna de estas condiciones es verdadera, redirige a la página de inicio de sesión ('login.html').
    */
    if (!loggedInUser || loggedInUser.role !== 'admin') {
        window.location.href = 'login.html'; // Redirigir si no es administrador
        return; // Detiene la ejecución del resto del código si no es administrador
    }

    /*
        Realiza una solicitud GET a un servidor local para obtener la lista de usuarios.
        La respuesta se convierte a formato JSON y se procesa para llenar una tabla HTML.
    */
    fetch('https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/users')
        .then(response => response.json()) // Convierte la respuesta a JSON
        .then(users => {
            // Selecciona el elemento de la tabla donde se mostrarán los usuarios
            const userTable = document.getElementById('userTable');
            
            /* 
                Mapea sobre los usuarios obtenidos del servidor para generar filas de tabla (tr).
                Cada fila incluye los datos del usuario, como nombre, correo electrónico, rol y estado (activo o inactivo).
                También se agregan botones para activar/desactivar al usuario y para eliminarlo.
            */
            userTable.innerHTML = users.map(user => `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.active ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <button class="btn btn-${user.active ? 'warning' : 'success'} btn-sm" onclick="toggleUserStatus(${user.id})">
                            ${user.active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Eliminar</button>
                    </td>
                </tr>
            `).join(''); // Une todas las filas en un solo string y lo inserta en el HTML
        });
});

/* 
    Función para alternar el estado de activación de un usuario.
    Se hace una solicitud GET para obtener los datos actuales del usuario.
    Luego se crea un nuevo objeto de usuario con el estado 'active' invertido.
    Finalmente, se envía una solicitud PUT al servidor para actualizar al usuario.
*/
function toggleUserStatus(userId) {
    fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/users/${userId}`)
        .then(response => response.json()) // Obtiene los datos del usuario como JSON
        .then(user => {
            // Crea una copia del usuario con el campo 'active' invertido
            const updatedUser = {
                ...user,
                active: !user.active
            };

            // Envía una solicitud PUT para actualizar el estado del usuario en el servidor
            fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser) // Envía los datos actualizados del usuario
            })
            .then(response => response.json()) // Espera la respuesta del servidor
            .then(() => location.reload()); // Recarga la página para reflejar los cambios
        });
}

/* 
    Función para eliminar un usuario.
    Se solicita confirmación al usuario antes de proceder con la eliminación.
    Si se confirma, se envía una solicitud DELETE al servidor.
    Tras eliminar, se recarga la página.
*/
function deleteUser(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/users/${userId}`, {
            method: 'DELETE' // Solicitud DELETE para eliminar el usuario
        })
        .then(() => location.reload()); // Recarga la página después de eliminar al usuario
    }
}
