const express = require('express');

// Controllers 
const Auth = require('./controllers/Auth');
const UsuarioController = require('./controllers/UsuarioController');
const MomentoController = require('./controllers/MomentoController.js');

// Rotas
const routes = express.Router();
routes.post('/logout', Auth.logout);
routes.post('/login', Auth.login);
routes.post('/usuarios', UsuarioController.cadastrar);

// Usuários
routes.get('/usuarios', Auth.verificarToken, UsuarioController.buscar);
routes.get('/usuarios/:id', Auth.verificarToken, UsuarioController.buscarId);
routes.get('/usuarios/verificar-usuario/:usuario', UsuarioController.verificarUsuario);

// Momentos
routes.post('/momentos', Auth.verificarToken, MomentoController.publicarMomento);
routes.get('/momentos', Auth.verificarToken, MomentoController.buscarMomentos);
routes.get('/momentos/:usuario_id', Auth.verificarToken, MomentoController.buscarMomentosUsuario);

routes.get('/', Auth.verificarToken, (req, res) => {
    res.status(204).send();
});

module.exports = routes;