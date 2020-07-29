const db = require('../database/connection');
const bcrypt = require ('bcrypt');

const fields = ['id', 'verificado', 'usuario', 'email', 'pais', 'codigo'];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  async cadastrar(req, res) {
    const { nome, usuario, email, pais, senha } = req.body;

    // Verifica se existe
    const resultado = await db('usuarios').select('usuario', 'email')
      .where('email', email)
      .orWhere('usuario', usuario);

    if(resultado[0] && resultado[0].usuario == usuario) {
      return res.status(409).json({
        message: "Nome de usuário já existe",
        error: true
      }); 
    } 
    else if(resultado[0] && resultado[0].email == email) {
      return res.status(409).json({
        message: "E-mail já cadastrado",
        error: true
      }); 
    }
    
    const codigo = getRandomInt(1000,9999);
    
    // Encriptando senha com bcrypt
    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(senha, salt);

    await db('usuarios').insert({
      nome,
      usuario, 
      email,
      pais,
      senha: senhaHash,
      codigo
    });

    return res.json({ codigo });
  },

  async buscarId(req, res) {
    const { id } = req.params;
    
    if(id) {
      const usuario = await db('usuarios').select(fields).where({ id });

      if(usuario[0]) {
        res.json(usuario);
      } else {
        res.status(204).send();
      };
    } 
  },

  async buscar(req, res) {
    const { usuario } = req.query;
    
    if(usuario) { 
      var usuarios = await db('usuarios').select(fields).where({ usuario });
    } else {
      var usuarios = await db('usuarios').select(fields);
    }

    if(usuarios[0]) {
      res.json(usuarios);
    } else {
      res.status(204).send();
    };
  },

  async verificarUsuario(req, res) {
    const { usuario } = req.params;

    const usuarios = await db('usuarios').select('usuario').where({ usuario });

    if(usuarios[0]) {
      res.json({
        existe: true
      });
    } else {
      res.json({
        existe: false
      });
    }
  }
}