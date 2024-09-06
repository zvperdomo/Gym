// Escucha el evento 'DOMContentLoaded', asegurando que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene los formularios de inicio de sesión y registro por sus ID
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Si el formulario de inicio de sesión está presente en la página
    if (loginForm) {
        // Añade un listener para el evento 'submit' del formulario de inicio de sesión
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita el comportamiento por defecto del formulario

            // Obtiene los valores de los campos de correo electrónico y contraseña
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Realiza una solicitud GET al servidor local para obtener la lista de usuarios
            fetch('http://localhost:3000/users')
                .then(response => response.json()) // Convierte la respuesta en un objeto JSON
                .then(users => {
                    // Busca un usuario que coincida con el correo electrónico y contraseña proporcionados
                    const user = users.find(user => user.email === email && user.password === password);

                    if (user) {
                        // Si el usuario es encontrado, almacena la información del usuario en el localStorage
                        localStorage.setItem('loggedInUser', JSON.stringify(user));

                        // Redirige según el rol del usuario (admin o visualizador)
                        if (user.role === 'admin') {
                            window.location.href = 'admin.html'; // Redirigir al panel de administración
                        } else {
                            window.location.href = 'viewer.html'; // Redirigir a la vista de perfil del usuario
                        }
                    } else {
                        // Si el usuario no es encontrado, muestra un mensaje de error
                        alert('Correo electrónico o contraseña incorrectos.');
                    }
                });
        });
    }

    // Si el formulario de registro está presente en la página
    if (registerForm) {
        // Añade un listener para el evento 'submit' del formulario de registro
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita el comportamiento por defecto del formulario

            // Obtiene los valores de los campos de nombre, correo electrónico y contraseña
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Crea un nuevo objeto de usuario con los datos proporcionados y asigna el rol de 'visualizador'
            const newUser = {
                id: Date.now().toString(), // Genera un ID único basado en la hora actual
                name,
                email,
                password,
                role: 'viewer', // Asigna el rol predeterminado de 'visualizador'
                active: true // Establece el estado activo del usuario
            };

            // Realiza una solicitud POST para registrar el nuevo usuario en el servidor local
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Define el tipo de contenido como JSON
                },
                body: JSON.stringify(newUser) // Envía el nuevo usuario como un objeto JSON
            })
            .then(response => {
                // Si la respuesta del servidor es exitosa
                if (response.ok) {
                    alert('Registro exitoso. Ahora puedes iniciar sesión.'); // Muestra un mensaje de éxito
                    registerForm.reset(); // Limpia el formulario después de un registro exitoso
                } else {
                    // Si la respuesta no es exitosa, muestra un mensaje de error
                    alert('Error en el registro. Inténtalo de nuevo.');
                }
            });
        });
    }
});
