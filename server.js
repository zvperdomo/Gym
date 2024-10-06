const express = require('express');
const path = require('path');
const jsonServer = require('json-server');

const app = express();

// Servir archivos estáticos desde la carpeta raíz
app.use(express.static(__dirname));

// Configurar JSON Server para manejar las solicitudes a la API
const router = jsonServer.router('db.json'); // Archivo de base de datos JSON
const middlewares = jsonServer.defaults();
app.use('/api', middlewares, router);

// Configurar el puerto para Azure App Service o usar el puerto 8080 localmente
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});

