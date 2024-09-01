document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Enviar los datos del formulario (simulado)
        alert(`Gracias ${name}, hemos recibido tu mensaje. Nos pondremos en contacto contigo a través de ${email}.`);

        // Limpiar el formulario
        contactForm.reset();
    });
});
