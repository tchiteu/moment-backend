const express = require('express');

// Controllers 
const Auth = require('./controllers/Auth');
const UsuarioController = require('./controllers/UsuarioController');

// Rotas
const routes = express.Router();

routes.post('/cadastro', UsuarioController.cadastro);
routes.post('/login', Auth.login);

routes.get('/', Auth.verificaToken, (req, res) => {
    res.status(204).send();
});

module.exports = routes;