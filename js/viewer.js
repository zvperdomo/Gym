document.addEventListener("DOMContentLoaded", function () {
    // Obtener los datos del usuario logueado desde localStorage
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    // Si el usuario no está logueado, redirigir a la página de inicio de sesión
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Obtener referencia al formulario de actualización de cuenta
    const accountForm = document.getElementById("updateAccountForm");
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;

    // Manejar el envío del formulario de actualización de cuenta
    accountForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevenir el envío del formulario

        // Obtener los valores actualizados del formulario
        const updatedName = document.getElementById("name").value;
        const updatedEmail = document.getElementById("email").value;

        // Enviar una solicitud PATCH para actualizar los datos del usuario
        fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: updatedName,
                email: updatedEmail
            })
        })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(updatedUser => {
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser)); // Actualizar los datos en localStorage
            alert("Datos actualizados con éxito.");
        });
    });

    // Función para cargar los detalles de la membresía del usuario
    function loadMembershipDetails() {
        fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/memberships?userId=${user.id}`)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(memberships => {
            const activeMembership = memberships.find(m => m.status === true); // Buscar la membresía activa
            const membershipDetails = document.getElementById("membershipDetails");
            const newMembershipButton = document.getElementById("newMembership");

            if (activeMembership) {
                // Mostrar detalles de la membresía activa
                membershipDetails.innerHTML = `
                    <div>
                        <h1 class="card-title">Plan ${activeMembership.planName || "N/A"}</h1>
                        <p class="card-text"><strong>Descripción:</strong> ${activeMembership.planDescription || "N/A"}</p>
                        <p class="card-text"><strong>Precio:</strong> $${activeMembership.price || "N/A"}</p>
                        <p class="card-text"><strong>Fecha de Inicio:</strong> ${activeMembership.startDate}</p>
                        <p class="card-text"><strong>Fecha de Fin:</strong> ${activeMembership.endDate}</p>
                    </div>
                `;
                document.getElementById("cancelMembership").style.display = "inline-block";
                document.getElementById("changeMembership").style.display = "inline-block";
                newMembershipButton.style.display = "none";
            } else {
                // Mensaje cuando no hay membresía activa
                membershipDetails.innerHTML = `
                    <p>No tienes ninguna membresía activa.</p>
                `;
                document.getElementById("cancelMembership").style.display = "none";
                document.getElementById("changeMembership").style.display = "none";
                newMembershipButton.style.display = "inline-block";
            }
        });
    }

    // Función para mostrar la sección seleccionada (cuenta o suscripciones)
    function showSection(sectionToShow) {
        document.getElementById("account").style.display = sectionToShow === 'account' ? 'block' : 'none';
        document.getElementById("subscriptions").style.display = sectionToShow === 'subscriptions' ? 'block' : 'none';
    }

    // Manejar clic en el enlace de suscripciones
    document.getElementById("subscriptionsLink").addEventListener("click", function (e) {
        e.preventDefault();
        showSection('subscriptions');
        loadMembershipDetails(); // Cargar los detalles de la membresía al mostrar la sección
    });

    // Manejar clic en el enlace de cuenta
    document.getElementById("accountLink").addEventListener("click", function (e) {
        e.preventDefault();
        showSection('account'); // Mostrar la sección de cuenta
    });

    // Manejar clic en el botón de cancelar membresía
    document.getElementById("cancelMembership").addEventListener("click", function () {
        fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/memberships?userId=${user.id}&status=true`)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(memberships => {
            const activeMembership = memberships[0]; // Obtener la primera membresía activa
            if (activeMembership) {
                fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/memberships/${activeMembership.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: false // Actualizar el estado de la membresía a inactiva
                    })
                })
                .then(() => {
                    loadMembershipDetails(); // Volver a cargar los detalles de la membresía
                    alert("Membresía cancelada con éxito.");
                });
            }
        });
    });

    // Manejar clic en el botón de cambiar membresía
    document.getElementById("changeMembership").addEventListener("click", function () {
        fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/plans`)
        .then(response => response.json()) // Obtener los planes disponibles
        .then(plans => {
            const plansContainer = document.getElementById("plansContainer");
            plansContainer.innerHTML = "";

            plans.forEach(plan => {
                const planElement = document.createElement("div");
                planElement.className = "plan-item mb-3";
                planElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${plan.name}</h5>
                            <p class="card-text">${plan.description}</p>
                            <p class="card-text"><strong>Precio:</strong> $${plan.price}</p>
                            <button class="btn btn-primary" data-plan-id="${plan.id}" data-plan-name="${plan.name}" data-plan-description="${plan.description}" data-plan-price="${plan.price}" onclick="subscribeToPlan(event)">Cambiar a este plan</button>
                        </div>
                    </div>
                `;
                plansContainer.appendChild(planElement);
            });

            // Mostrar el modal de selección de membresía
            const selectMembershipModal = new bootstrap.Modal(document.getElementById('selectMembershipModal'));
            selectMembershipModal.show();
        });
    });

    // Función global para suscribirse a un plan seleccionado
    window.subscribeToPlan = function (event) {
        const button = event.target;
        const planId = button.getAttribute("data-plan-id");
        const planName = button.getAttribute("data-plan-name");
        const planDescription = button.getAttribute("data-plan-description");
        const planPrice = button.getAttribute("data-plan-price");

        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];

        fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/memberships?userId=${user.id}&status=true`)
        .then(response => response.json())
        .then(memberships => {
            const activeMembership = memberships[0]; // Obtener la membresía activa
            if (activeMembership) {
                // Actualizar la membresía existente
                fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/memberships/${activeMembership.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        planName: planName,
                        planDescription: planDescription,
                        price: planPrice,
                        startDate: startDate,
                        endDate: endDate
                    })
                })
                .then(() => {
                    loadMembershipDetails(); // Volver a cargar los detalles de la membresía
                    const selectMembershipModal = bootstrap.Modal.getInstance(document.getElementById('selectMembershipModal'));
                    selectMembershipModal.hide(); // Ocultar el modal
                    alert("Membresía actualizada con éxito.");
                });
            }
        });
    };

    // Manejar clic en el botón de nueva membresía
    document.getElementById("newMembership").addEventListener("click", function () {
        fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/plans`)
        .then(response => response.json()) // Obtener los planes disponibles
        .then(plans => {
            const plansContainer = document.getElementById("plansContainer");
            plansContainer.innerHTML = "";

            plans.forEach(plan => {
                const planElement = document.createElement("div");
                planElement.className = "plan-item mb-3";
                planElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${plan.name}</h5>
                            <p class="card-text">${plan.description}</p>
                            <p class="card-text"><strong>Precio:</strong> $${plan.price}</p>
                            <button class="btn btn-primary" data-plan-id="${plan.id}" data-plan-name="${plan.name}" data-plan-description="${plan.description}" data-plan-price="${plan.price}" onclick="subscribeToNewPlan(event)">Contratar este plan</button>
                        </div>
                    </div>
                `;
                plansContainer.appendChild(planElement);
            });

            // Mostrar el modal de selección de membresía
            const selectMembershipModal = new bootstrap.Modal(document.getElementById('selectMembershipModal'));
            selectMembershipModal.show();
        });
    });

    // Función global para contratar un nuevo plan
    window.subscribeToNewPlan = function (event) {
        const button = event.target;
        const planId = button.getAttribute("data-plan-id");
        const planName = button.getAttribute("data-plan-name");
        const planDescription = button.getAttribute("data-plan-description");
        const planPrice = button.getAttribute("data-plan-price");

        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];

        fetch(`https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/memberships`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                status: true,
                planName: planName,
                planDescription: planDescription,
                price: planPrice,
                startDate: startDate,
                endDate: endDate
            })
        })
        .then(() => {
            loadMembershipDetails(); // Volver a cargar los detalles de la membresía
            const selectMembershipModal = bootstrap.Modal.getInstance(document.getElementById('selectMembershipModal'));
            selectMembershipModal.hide(); // Ocultar el modal
            alert("Membresía contratada con éxito.");
        });
    };

    // Inicializar mostrando la sección de cuenta
    showSection('account');
});

