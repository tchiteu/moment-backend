const express = require('express');

// Controllers 
const UsuarioController = require('./controllers/UsuarioController');

// Rotas
const routes = express.Router();

routes.post('/cadastro', UsuarioController.cadastro);
routes.get('/', (req, res) => {
    res.send("Servidor on! 👌 ");
});

module.exports = routes;