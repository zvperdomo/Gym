document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser || loggedInUser.role !== 'admin') {
        window.location.href = 'login.html'; // Redirigir si no es administrador
        return;
    }

    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            const userTable = document.getElementById('userTable');
            userTable.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
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
            `).join('');
        });
});

function toggleUserStatus(userId) {
    fetch(`http://localhost:3000/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            const updatedUser = {
                ...user,
                active: !user.active
            };

            fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            })
            .then(response => response.json())
            .then(() => location.reload());
        });
}

function deleteUser(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE'
        })
        .then(() => location.reload());
    }
}
