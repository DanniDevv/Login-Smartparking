// index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware para servir archivos estáticos desde la carpeta "assets"
app.use('/assets', express.static('assets'));
app.use('/css', express.static('assets/css'));

// Ruta de inicio
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta de login
app.post('/login', async (req, res) => {
    try {
        // Hacer solicitud a tu API de login
        const response = await axios.post('http://localhost:9000/api/login', {
            usuario: req.body.usuario,
            password: req.body.password,
        });

        const { success, empresa } = response.data;

        if (success === 'Login correcto' && empresa) {
            // Redirigir a la ruta /home con el ID de la empresa
            res.redirect(`/home/${empresa}`);
        } else {
            // Otro tipo de lógica de respuesta
            res.render('login-error');
        }
    } catch (error) {
        console.error(error);
        res.render('login-error');
    }
});

// Ruta para mostrar detalles de la empresa en /home
app.get('/home/:id', async (req, res) => {
    try {
        // Hacer solicitud a tu API de empresa con la ID proporcionada
        const empresaResponse = await axios.get(`http://localhost:9000/api/empresa/${req.params.id}`);

        // Modificar la URL de la imagen para incluir el host
        const empresaDetails = {
            ...empresaResponse.data,
            imagen: 'http://localhost:9000/' + empresaResponse.data.imagen,
        };

        // Renderizar vista de éxito con detalles de la empresa
        res.render('home', { empresaDetails });
    } catch (error) {
        console.error(error);
        res.render('login-error');
    }
});

// Ruta para parking
app.get('/parking', (req, res) => {
    res.render('parking');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
