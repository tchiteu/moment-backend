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
    const token = req.headers['authorization'];
    if(!token) return res.status(401).send({ 
      message: 'Nenhum token enviado.' 
    });

    const blacklist_token = await db('blacklist').select('token').where('token', token);
    if(blacklist_token[0]) return res.status(401).send({
      message: 'Token inválido.'
    })

    jwt.verify(token, process.env.SECRET, async function(err, decoded) {
      if(err) return res.status(500).json({
        auth: false,
        message: 'Falha ao autenticar o token.'
      });
      
      const usuario_id = decoded.id;

      // Salva o token na Blacklist
      await db('blacklist').insert({
        token,
        usuario_id
      })
    });
    
    res.status(200).json({
      message: "Deslogado com sucesso!", 
      token: null
    });
  },

  async verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).send({ 
      auth: false,
      message: 'Nenhum token enviado.'
    });

    const blacklist_token = await db('blacklist').select('token').where('token', token);
    if(blacklist_token[0]) return res.status(401).send({ 
      auth: false,
      message: 'Token inválido.'
    });

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if(err) return res.status(401).json({
        auth: false,
        message: 'Token inválido.'
      });
      
      let retorno = await db('usuarios').select('usuario').where( 'id', decoded.id );

      if(!retorno[0]) {
        return res.status(401).send({
          auth: false,
          message: 'Token inválido.'
        });
      }    

      req.usuario = retorno[0].usuario;
      req.usuario_id = decoded.id;

      next();
    });
  }
}