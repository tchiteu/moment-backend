const db = require('../database/connection');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

function validaPublicacao(titulo, descricao) {
  let message = "";
  if(!titulo || titulo.length > 35) {
    message = "Titulo inválido."
    return message;
  }

  if(!descricao || descricao.length > 101) {
    message = "Descrição inválida."
    return message;
  }

  return false;
}

function salvaImagem(base64, usuario_id) {
  base64 = base64.replace(/^data:image\/png;base64,/, "");
  base64 = base64.replace(/^data:image\/jpeg;base64,/, "");

  const currentDate = new Date();

  const caminho_diretorio = `${process.env.IMAGE_PATH}/${usuario_id}` 
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

  return caminho_imagem;
}

module.exports = {
  async publicar(req, res) {
    let {titulo, descricao, base64} = req.body;
    let usuario_id = req.userId;

    const caminho_imagem = salvaImagem(base64, usuario_id);

    let message = validaPublicacao(titulo, descricao);
    if(message) {
      let json = {
        message,
        erro: true
      };
      res.status(400).json(json);
    }

    await db('momentos').insert({
      titulo,
      descricao,
      caminho_imagem,
      usuario_id
    })

    return res.status(204).send();
  }
}