const db = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require ('bcrypt')

module.exports = {
  async cadastro(req, res) {
    const { nome, usuario, email, pais, senha } = req.body;

    db('usuarios').select('id').where('email', email).orWhere('');
    
    const id = crypto.randomBytes(4).toString('HEX');
    const codigo = Math.floor(Math.random() * 9999);
    
    // Encriptando senha com bcrypt
    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(senha, salt);

    await db('usuarios').insert({
      id,
      nome,
      usuario,
      email,
      pais,
      senha: senhaHash,
      codigo
    });

    return res.json({ codigo });
  }
}