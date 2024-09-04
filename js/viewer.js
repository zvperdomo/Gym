document.addEventListener("DOMContentLoaded", function () {
    const userId = 2; // Cambia esto para obtener dinámicamente el ID del usuario
    fetchUserData(userId);
    fetchMembershipDetails(userId);

    // Añadir eventos para cambiar de sección
    document.getElementById('accountLink').addEventListener('click', function () {
        showSection('account');
    });
    document.getElementById('subscriptionsLink').addEventListener('click', function () {
        showSection('subscriptions');
    });
});

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function fetchUserData(userId) {
    fetch(`http://localhost:3000/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
        })
        .catch(error => console.error('Error al cargar los datos del usuario:', error));
}

function fetchMembershipDetails(userId) {
    fetch(`http://localhost:3000/memberships?userId=${userId}`)
        .then(response => response.json())
        .then(memberships => {
            const membership = memberships.find(m => m.status); // Obtener la membresía activa
            const membershipDetails = document.getElementById('membershipDetails');
            
            if (membership) {
                membershipDetails.innerHTML = `
                    <p><strong>Plan:</strong> ${membership.plan}</p>
                    <p><strong>Fecha de inicio:</strong> ${membership.startDate}</p>
                    <p><strong>Fecha de finalización:</strong> ${membership.endDate}</p>
                    <p><strong>Estado:</strong> ${membership.status ? 'Activa' : 'Inactiva'}</p>
                    <button id="cancelMembership" class="btn btn-danger mt-3">Cancelar Membresía</button>
                    <button id="changeMembership" class="btn btn-warning mt-3">Cambiar Membresía</button>
                `;

                // Añadir evento de cancelar membresía
                document.getElementById('cancelMembership').addEventListener('click', function () {
                    cancelMembership(userId);
                });

                // Añadir evento de cambiar membresía
                document.getElementById('changeMembership').addEventListener('click', function () {
                    changeMembership(userId);
                });

            } else {
                membershipDetails.innerHTML = `
                    <p>No tienes ninguna membresía activa.</p>
                    <button id="newMembership" class="btn btn-primary mt-3">Contratar Membresía</button>
                `;

                document.getElementById('newMembership').addEventListener('click', function () {
                    alert('Redirigiendo a la página de selección de membresías...');
                    window.location.href = 'memberships.html'; // Redirige a la página de contratación
                });
            }
        })
        .catch(error => console.error('Error al cargar los detalles de la membresía:', error));
}

function cancelMembership(userId) {
    if (confirm('¿Estás seguro de que deseas cancelar tu membresía?')) {
        fetch(`http://localhost:3000/memberships/1`, { // ID de la membresía activa del usuario
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: false })
        })
            .then(response => response.json())
            .then(() => {
                alert('Membresía cancelada.');
                fetchMembershipDetails(userId); // Actualizar vista después de cancelar
            })
            .catch(error => console.error('Error al cancelar la membresía:', error));
    }
}

function changeMembership(userId) {
    const newPlan = prompt("Ingresa el nuevo plan: (Mensual, Trimestral, Anual)");

    if (newPlan) {
        fetch(`http://localhost:3000/memberships/1`, { // ID de la membresía activa del usuario
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plan: newPlan })
        })
            .then(response => response.json())
            .then(() => {
                alert('Membresía cambiada a ' + newPlan);
                fetchMembershipDetails(userId); // Actualizar vista después de cambiar membresía
            })
            .catch(error => console.error('Error al cambiar la membresía:', error));
    }
}

// Actualizar datos de la cuenta
document.getElementById('updateAccountForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const updatedUser = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    };

    fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => response.json())
        .then(() => {
            alert('Datos actualizados correctamente.');
        })
        .catch(error => console.error('Error al actualizar los datos:', error));
});


