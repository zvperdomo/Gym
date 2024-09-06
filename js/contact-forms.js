// Escucha el evento 'DOMContentLoaded', asegurando que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {
    
    // Realiza una solicitud GET al servidor local para obtener los formularios de contacto enviados
    fetch('http://localhost:3000/contacts')  // Asegúrate de que la URL es la correcta
        .then(response => {
            // Verifica que la respuesta del servidor es correcta
            if (!response.ok) {
                throw new Error('Error en la respuesta de formularios de contacto');
            }
            // Convierte la respuesta a un objeto JSON
            return response.json();
        })
        .then(data => {
            // Muestra los datos en la consola para verificar que se están recibiendo correctamente
            console.log('Formularios de contacto:', data);
            
            // Obtiene la tabla donde se mostrarán los formularios de contacto
            const contactTable = document.getElementById('contactTable');
            
            // Si no hay formularios de contacto enviados, muestra un mensaje en la tabla
            if (data.length === 0) {
                contactTable.innerHTML = '<tr><td colspan="4">No hay formularios enviados</td></tr>';
            } else {
                // Si hay formularios, genera una fila para cada uno y los inserta en la tabla
                contactTable.innerHTML = data.map(contact => `
                    <tr>
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.message}</td>
                    </tr>
                `).join('');  // .join('') para evitar comas entre las filas generadas
            }
        })
        .catch(error => {
            // Muestra un mensaje de error en la consola si la solicitud falla
            console.error('Error al cargar los formularios de contacto:', error);
        });
});



