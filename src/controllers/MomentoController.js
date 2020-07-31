const db = require('../database/connection');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

function validaPublicacao(titulo, descricao, caminho_imagem) {
  if(titulo || titulo.length > 28) {

  }


}

module.exports = {
  async publicar(req, res) {
    let {titulo, descricao, base64} = req.body;
    
    base64 = base64.replace(/^data:image\/png;base64,/, "");
    base64 = base64.replace(/^data:image\/jpeg;base64,/, "");

    const currentDate = new Date();

    const caminho_diretorio = `${process.env.IMAGE_PATH}/${req.userId}` 
    const nome_imagem = `${currentDate.getTime()}.png`;
    const caminho_imagem = caminho_diretorio + nome_imagem;
    
    fs.mkdir(caminho_diretorio, {recursive: true}, (err) => {
      if(err) {
        console.log(err);
      } else {
        fs.writeFile(caminho_imagem, base64, 'base64', (err) => {
          if(err) {
            console.log(err);
          }
        });
      }
    });

    // validaPublicacao(titulo, descricao, usuario_id); 
    await db('momentos').insert({
      titulo,
      descricao,
      caminho_imagem,
      usuario_id: req.userId
    })

    return res.status(204).send();
  }
}