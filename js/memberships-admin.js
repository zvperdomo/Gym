document.addEventListener('DOMContentLoaded', () => {
    // Función para mostrar el modal de agregar membresía
    function showAddMembershipModal() {
        const modal = new bootstrap.Modal(document.getElementById('membershipModal'));
        document.getElementById('membershipForm').reset(); // Resetea el formulario
        document.getElementById('editMembershipId').value = ''; // Borra el ID oculto (usado solo para editar)
        document.getElementById('membershipModalLabel').innerText = 'Agregar Membresía'; // Cambia el título del modal
        modal.show(); // Muestra el modal
    }

    // Función para mostrar el modal de edición con datos actuales de la membresía
    function showEditMembershipModal(plan) {
        const modal = new bootstrap.Modal(document.getElementById('membershipModal'));
        // Asigna los valores actuales del plan al formulario
        document.getElementById('name').value = plan.name;
        document.getElementById('description').value = plan.description;
        document.getElementById('price').value = plan.price;
        document.getElementById('editMembershipId').value = plan.id; // Asigna el ID del plan
        document.getElementById('membershipModalLabel').innerText = 'Editar Membresía'; // Cambia el título del modal
        modal.show(); // Muestra el modal
    }

    // Manejo del envío del formulario de membresía
    document.getElementById('membershipForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del formulario

        // Obtiene los valores del formulario
        const id = document.getElementById('editMembershipId').value;
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;

        // Determina si es una actualización (PUT) o una creación (POST)
        const method = id ? 'PUT' : 'POST';
        const url = id ? `https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/plans/${id}` : 'https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/plans';

        // Envía los datos al servidor
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price }) // Convierte los datos a formato JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar la membresía'); // Maneja errores de respuesta
            }
            return response.json();
        })
        .then(() => {
            loadMemberships(); // Recarga la lista de membresías
            const modal = bootstrap.Modal.getInstance(document.getElementById('membershipModal'));
            modal.hide(); // Cierra el modal después de guardar
        })
        .catch(error => console.error('Error al guardar la membresía:', error)); // Maneja errores
    });

    // Mostrar modal al hacer clic en Agregar Membresía
    document.getElementById('addMembershipBtn').addEventListener('click', showAddMembershipModal);

    // Función para cargar las membresías disponibles
    function loadMemberships() {
        fetch('https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/plans')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar las membresías'); // Maneja errores de respuesta
                }
                return response.json();
            })
            .then(data => {
                const membershipTable = document.getElementById('membershipTable');
                if (data.length === 0) {
                    membershipTable.innerHTML = '<tr><td colspan="5">No hay membresías disponibles</td></tr>';
                } else {
                    membershipTable.innerHTML = data.map(plan => `
                        <tr>
                            <td>${plan.name}</td>
                            <td>${plan.description}</td>
                            <td>$${plan.price}</td>
                            <td>
                                <button class="btn btn-primary btn-sm editMembershipBtn" data-id="${plan.id}">Editar</button>
                                <button class="btn btn-danger btn-sm deleteMembershipBtn" data-id="${plan.id}">Eliminar</button>
                            </td>
                        </tr>
                    `).join(''); // Muestra las membresías en una tabla

                    // Agrega eventos de edición a los botones de cada membresía
                    document.querySelectorAll('.editMembershipBtn').forEach(btn => {
                        btn.addEventListener('click', event => {
                            const membershipId = event.target.getAttribute('data-id');
                            fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/plans/${membershipId}`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Error al cargar los datos de la membresía');
                                    }
                                    return response.json();
                                })
                                .then(plan => showEditMembershipModal(plan)) // Muestra el modal con los datos cargados
                                .catch(error => console.error('Error al cargar los datos de la membresía:', error));
                        });
                    });

                    // Agrega eventos de eliminación a los botones de cada membresía
                    document.querySelectorAll('.deleteMembershipBtn').forEach(btn => {
                        btn.addEventListener('click', event => {
                            const membershipId = event.target.getAttribute('data-id');
                            if (confirm('¿Estás seguro de que quieres eliminar esta membresía?')) {
                                fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/plans/${membershipId}`, { method: 'DELETE' })
                                    .then(() => loadMemberships()) // Recarga la lista después de eliminar
                                    .catch(error => console.error('Error al eliminar la membresía:', error));
                            }
                        });
                    });
                }
            })
            .catch(error => console.error('Error al cargar las membresías:', error)); // Manejo de errores
    }

    // Cargar la lista de membresías cuando se cargue la página
    loadMemberships();

    // Cargar las membresías adquiridas por los clientes
    fetch('https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/memberships')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar las membresías adquiridas'); // Maneja errores de respuesta
            }
            return response.json();
        })
        .then(membershipsData => {
            // Cargar los usuarios para vincularlos a sus membresías adquiridas
            fetch('https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/users')
                .then(response => response.json())
                .then(usersData => {
                    const acquiredMembershipsTable = document.getElementById('acquiredMembershipsTable');
                    if (membershipsData.length === 0) {
                        acquiredMembershipsTable.innerHTML = '<tr><td colspan="6">No hay membresías adquiridas</td></tr>';
                    } else {
                        acquiredMembershipsTable.innerHTML = membershipsData.map(membership => {
                            const user = usersData.find(user => user.id == membership.userId); // Asocia usuario con membresía
                            return `
                                <tr>
                                    <td>${user ? user.name : 'Usuario no encontrado'}</td>
                                    <td>${membership.planName}</td>
                                    <td>${membership.status ? 'Activo' : 'Inactivo'}</td>
                                    <td>${membership.startDate}</td>
                                    <td>${membership.endDate}</td>
                                </tr>
                            `;
                        }).join(''); // Muestra las membresías adquiridas en una tabla
                    }
                })
                .catch(error => console.error('Error al cargar los usuarios:', error)); // Maneja errores de usuarios
        })
        .catch(error => console.error('Error al cargar las membresías adquiridas:', error)); // Manejo de errores
});


