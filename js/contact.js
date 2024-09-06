// Escucha el evento 'DOMContentLoaded' para asegurarse de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

    // Obtiene el formulario de contacto a través de su ID
    const contactForm = document.getElementById('contactForm');

    // Agrega un evento de envío al formulario
    contactForm.addEventListener('submit', function(e) {
        // Evita el comportamiento predeterminado del formulario (recargar la página al enviarlo)
        e.preventDefault();

        // Captura los valores de los campos del formulario (nombre, correo electrónico y mensaje)
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Realiza una solicitud POST para enviar los datos del formulario al servidor
        fetch('http://localhost:3000/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Define que el contenido es JSON
            },
            // Convierte los datos del formulario en un JSON y los envía en el cuerpo de la solicitud
            body: JSON.stringify({ name, email, message }),
        })
        // Convierte la respuesta del servidor a un objeto JSON
        .then(response => response.json())
        .then(data => {
            // Muestra una alerta confirmando que el mensaje ha sido enviado correctamente
            alert('Tu mensaje ha sido enviado exitosamente.');
            // Limpia los campos del formulario después del envío exitoso
            contactForm.reset();
        })
        // Captura errores si la solicitud falla y muestra un mensaje de error en la consola y en una alerta
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            alert('Hubo un problema al enviar el formulario. Inténtalo de nuevo.');
        });
    });
});
