document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser || loggedInUser.role !== 'admin') {
        window.location.href = 'login.html'; // Redirigir si no es administrador
        return;
    }

    Promise.all([
        fetch('http://localhost:3000/memberships').then(response => response.json()),
        fetch('http://localhost:3000/users').then(response => response.json())
    ])
    .then(([memberships, users]) => {
        const membershipList = document.getElementById('membershipList');
        const userMap = users.reduce((map, user) => {
            map[user.id] = user.name;
            return map;
        }, {});

        membershipList.innerHTML = memberships.map(membership => `
            <tr>
                <td>${membership.id}</td>
                <td>${userMap[membership.userId]}</td>
                <td>${membership.status ? 'Activo' : 'Inactivo'}</td>
                <td>${membership.plan}</td>
                <td>${membership.startDate}</td>
                <td>${membership.endDate}</td>
            </tr>
        `).join('');
    })
    .catch(error => {
        console.error('Error al cargar las membresías:', error);
    });
});


