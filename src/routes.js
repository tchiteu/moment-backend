const express = require('express');

// Controllers 
const Auth = require('./controllers/Auth');
const UsuarioController = require('./controllers/UsuarioController');

// Rotas
const routes = express.Router();
routes.post('/logout', Auth.logout);
routes.post('/login', Auth.login);

routes.post('/usuarios', UsuarioController.cadastro);
routes.get('/usuarios', Auth.verificaToken, UsuarioController.busca);
routes.get('/usuarios/:id', Auth.verificaToken, UsuarioController.buscaId);

routes.get('/', Auth.verificaToken, (req, res) => {
    res.status(204).send();
});

module.exports = routes;