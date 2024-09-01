document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:3000/users')
                .then(response => response.json())
                .then(users => {
                    const user = users.find(user => user.email === email && user.password === password);
                    if (user) {
                        localStorage.setItem('loggedInUser', JSON.stringify(user));
                        if (user.role === 'admin') {
                            window.location.href = 'admin.html'; // Redirigir al panel de administración
                        } else {
                            window.location.href = 'viewer.html'; // Redirigir a la vista de perfil
                        }
                    } else {
                        alert('Correo electrónico o contraseña incorrectos.');
                    }
                });
        });
    }
});



