const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const bcrypt = require ('bcrypt');

module.exports = {
  async login(req, res) {
    const { email, senha } = req.body; 

    if(email && senha) {
      const resultado = await db('usuarios').select('*')
        .where('email', email);
      
      if(!resultado[0]) {
        return res.status(401).json({
          message: "E-mail não encontrado.",
          error: true
        })
      } 

      bcrypt.compare(senha, resultado[0].senha, (err, result) => {
        if(result) {
          const id = resultado[0].id;
          const token = jwt.sign( { id } , process.env.SECRET, {
            expiresIn: 14400 // Expira em 4 horas
          });

          res.status(200).json({
            token: token,
            message: "Logado com sucesso!",
            error: false
          });          
        } else {
          return res.status(401).json({
            message: "Senha incorreta.",
            error: true
          })
        }
      })

    } else {
      res.status(401).json({
        error: true,
        message: "Usuario ou senha não informados."
      })
    }
  },

  async logout(req, res) {
    res.status(200).json({
      message: "Deslogado com sucesso!", 
      token: null
    });
  },

  async verificaToken(req, res, next) {
    const token = req.headers['authorization'];

    if(!token) return res.status(401).send({ message: 'Nenhum token enviado.' });

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if(err) return res.status(500).json({
        auth: false,
        message: 'Falha ao autenticar o token.'
      });
      
      req.userId = decoded.id;
      next();
    });
  }
}