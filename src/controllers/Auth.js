const jwt = require('jsonwebtoken');

module.exports = {
  async login(req, res) {
    const { email, senha } = req.body; 

    //verificação do login
    if(email && senha) {
      const id = 1; // id do usuario logado
      
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 14400 // Expira em 4 horas
      });
      
      const json = {
        token: token,
        message: "Logado com sucesso!"
      }

      res.status(200).send(json);
    }
  },

  async logout(req, res) {
    res.status(200).send({ message: "Deslogado com sucesso!", token: null });
  },

  async verificaToken(req, res, next) {
    const token = req.headers['authorization'];

    if(!token) return res.status(401).send({ message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if(err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      req.userId = decoded.id;
      next();
    });
  }
}