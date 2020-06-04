const connection = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require ('bcrypt')

module.exports = {
  async cadastro(req, res) {
    const { nome, sobrenome, email, pais, senha } = req.body;
    
    const id = crypto.randomBytes(4).toString('HEX');
    const codigo = Math.floor(Math.random() * 9999);
    
    // Encriptando senha com bcrypt
    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(senha, salt);

    await connection('usuarios').insert({
      id,
      nome,
      sobrenome,
      email,
      pais,
      senha: senhaHash,
      codigo
    });

    return res.json({ codigo });
  }
}