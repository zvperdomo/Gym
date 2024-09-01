document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Verificar si el usuario está logueado y es un administrador
    if (!loggedInUser || loggedInUser.role !== 'admin') {
        window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión si no es administrador
        return;
    }

    const userTable = document.getElementById('userTable');

    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            userTable.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <select class="form-select" data-id="${user.id}" data-role="${user.role}">
                            <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>Visualizador</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-${user.active ? 'success' : 'secondary'}" data-id="${user.id}" data-action="${user.active ? 'deactivate' : 'activate'}">
                            ${user.active ? 'Activo' : 'Inactivo'}
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-danger" data-id="${user.id}" data-action="delete">Eliminar</button>
                    </td>
                </tr>
            `).join('');

            userTable.addEventListener('click', (e) => {
                const button = e.target;
                if (button.dataset.action) {
                    const userId = button.dataset.id;
                    switch (button.dataset.action) {
                        case 'activate':
                            updateUserStatus(userId, true);
                            break;
                        case 'deactivate':
                            updateUserStatus(userId, false);
                            break;
                        case 'delete':
                            deleteUser(userId);
                            break;
                    }
                }
            });

            userTable.addEventListener('change', (e) => {
                if (e.target.tagName === 'SELECT') {
                    const userId = e.target.dataset.id;
                    const newRole = e.target.value;
                    updateUserRole(userId, newRole);
                }
            });
        });

    function updateUserStatus(id, active) {
        fetch(`http://localhost:3000/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ active: active })
        })
        .then(() => location.reload());
    }

    function deleteUser(id) {
        fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE'
        })
        .then(() => location.reload());
    }

    function updateUserRole(id, role) {
        fetch(`http://localhost:3000/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: role })
        });
    }
});
