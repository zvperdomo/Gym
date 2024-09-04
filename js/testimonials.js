document.addEventListener('DOMContentLoaded', () => {
    const testimonialsList = document.getElementById('testimonials-list');
    const testimonialForm = document.getElementById('testimonial-form');
    const successMessage = document.getElementById('success-message');

    // Ruta de la imagen predeterminada en la carpeta img
    const defaultAvatarUrl = 'img/imgtestimonios.png';

    // Función para cargar testimonios desde la base de datos
    function loadTestimonials() {
        fetch('http://localhost:3000/testimonials') // URL del servidor JSON
            .then(response => response.json())
            .then(data => {
                testimonialsList.innerHTML = ''; // Limpiar la lista antes de cargar nuevos datos
                data.forEach(testimonial => {
                    const testimonialDiv = document.createElement('div');
                    testimonialDiv.classList.add('testimonial-item');
                    testimonialDiv.innerHTML = `
                        <img src="${testimonial.photo || defaultAvatarUrl}" alt="${testimonial.name}" style="width: 150px; height: 150px; border-radius: 50%;">
                        <div class="info">
                            <h5 class="mb-1">${testimonial.name}</h5>
                            <p class="mb-1">"${testimonial.review}"</p>
                            <small>${testimonial.date || 'Nuevo miembro'}</small>
                        </div>
                    `;
                    testimonialsList.appendChild(testimonialDiv);
                });
            })
            .catch(error => console.error('Error loading testimonials:', error));
    }

    // Enviar un nuevo testimonio
    testimonialForm.addEventListener('submit', event => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const photo = document.getElementById('photo').value.trim();
        const review = document.getElementById('review').value;

        const newTestimonial = {
            name: name,
            photo: photo || defaultAvatarUrl, // Establecer la foto predeterminada si no se proporciona una
            review: review,
            date: new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
        };

        fetch('http://localhost:3000/testimonials', { // URL del servidor JSON
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTestimonial)
        })
        .then(response => response.json())
        .then(data => {
            if (data) { // JSON Server devuelve el objeto recién creado
                successMessage.classList.remove('d-none');
                testimonialForm.reset(); // Limpiar el formulario
                loadTestimonials(); // Volver a cargar los testimonios para incluir el nuevo
                setTimeout(() => {
                    successMessage.classList.add('d-none');
                }, 3000); // Ocultar el mensaje después de 3 segundos
            } else {
                console.error('Error adding testimonial:', data);
            }
        })
        .catch(error => console.error('Error adding testimonial:', error));
    });

    // Inicializar la página cargando los testimonios
    loadTestimonials();
});
