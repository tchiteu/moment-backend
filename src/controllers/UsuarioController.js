const db = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require ('bcrypt')

module.exports = {
  async cadastro(req, res) {
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