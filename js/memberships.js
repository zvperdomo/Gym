document.addEventListener('DOMContentLoaded', () => {
    const membershipContainer = document.getElementById('membershipContainer');

    // Realiza una solicitud para obtener los planes de membresía desde la base de datos
    fetch('https://gymapp-eab6efeffcbsc9b5.westeurope-01.azurewebsites.net/api/plans')
        .then(response => response.json()) // Convierte la respuesta en formato JSON
        .then(plans => {
            // Limpia el contenedor en caso de que tenga contenido existente
            membershipContainer.innerHTML = '';

            // Recorre cada plan y genera la estructura HTML correspondiente
            plans.forEach(plan => {
                const planCard = document.createElement('div'); // Crea un nuevo div para la tarjeta del plan
                planCard.className = 'col-md-4 mb-4'; // Asigna clases de Bootstrap para diseño

                // Estructura HTML de cada tarjeta de membresía
                planCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column">
                            <h1 class="card-title">${plan.name}</h1> <!-- Título del plan -->
                            <p class="card-text">${plan.description}</p> <!-- Descripción del plan -->
                            <h1 class="card-text text-center">${plan.price}</h1> <!-- Precio del plan -->
                            <div class="mt-auto text-center">
                                <button class="btn btn-primary" onclick="contratarMembresia(${plan.id})">Contratar</button> <!-- Botón para contratar el plan -->
                            </div>
                        </div>
                    </div>
                `;

                // Agrega la tarjeta al contenedor de membresías
                membershipContainer.appendChild(planCard);
            });
        })
        .catch(error => console.error('Error fetching membership plans:', error)); // Muestra un error si la solicitud falla
});

// Función que redirige al usuario a la página de inicio de sesión al seleccionar una membresía
function contratarMembresia(planId) {
    // Al hacer clic en "Contratar", se redirige a la página de login
    window.location.href = 'login.html';
}


