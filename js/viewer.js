document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Verificar si el usuario está autenticado y es un visualizador
    if (!loggedInUser || loggedInUser.role !== 'viewer') {
        window.location.href = 'login.html'; // Redirigir si no es visualizador
        return;
    }

    // Cargar información de la membresía y perfil
    fetch(`http://localhost:3000/users/${loggedInUser.id}`)
        .then(response => response.json())
        .then(user => {
            // Mostrar información de la membresía
            document.getElementById('membershipInfo').innerHTML = `
                <h2>Mi Membresía</h2>
                <p>Plan: ${user.membershipPlan || 'No asignado'}</p>
                <button class="btn btn-${user.active ? 'danger' : 'success'}" id="membershipToggle">
                    ${user.active ? 'Cancelar Membresía' : 'Activar Membresía'}
                </button>
            `;

            // Configuración inicial del formulario
            document.getElementById('profileEmail').value = user.email;
            document.getElementById('profileName').value = user.name;

            // Manejar el cambio de estado de la membresía
            document.getElementById('membershipToggle').addEventListener('click', () => {
                updateMembershipStatus(!user.active);
            });

            // Manejar la actualización del perfil
            document.getElementById('profileForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const updatedUser = {
                    name: document.getElementById('profileName').value,
                    email: document.getElementById('profileEmail').value,
                    // Para la foto de perfil, necesitarías una funcionalidad adicional para manejar archivos
                };
                updateUserProfile(updatedUser);
            });
        })
        .catch(error => console.error('Error:', error));

    function updateMembershipStatus(active) {
        fetch(`http://localhost:3000/users/${loggedInUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ active: active })
        })
        .then(() => location.reload());
    }

    function updateUserProfile(updatedUser) {
        fetch(`http://localhost:3000/users/${loggedInUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(() => alert('Perfil actualizado con éxito.'));
    }
});

