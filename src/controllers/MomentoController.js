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
  const caminho_imagem = `${caminho_diretorio}/${nome_imagem}`;
  
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

function imagemToBase64(caminho) {
  try {
    var bitmap = fs.readFileSync(caminho);
  } catch(err) {
    return false;
  }

  return new Buffer.from(bitmap).toString('base64');
}

function preparaMomentos(momentos) {
  if(momentos[0]) {
    var i = momentos.length;

    while (i--) {
      let momento = momentos[i];

      let base64 = imagemToBase64(momento.caminho_imagem);
      
      if(base64) {
        base64 = `data:image/png;base64,${base64}`;

        momentos[i] = {
          id: momento.id,
          titulo: momento.titulo,
          descricao: momento.descricao,
          curtidas: momento.curtidas,
          usuario_id: momento.usuario_id,
          base64
        }
      } 
      else {
        momentos.splice(i, 1);
      }
    }

    return momentos;
  }
}

module.exports = {
  async publicarMomento(req, res) {
    let {titulo, descricao, base64} = req.body;
    let usuario_id = req.userId;

    let caminho_imagem = salvaImagem(base64, usuario_id);
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
  },

  async buscarMomentos(req, res) {
    let momentos = await db('momentos').select();
    momentos = preparaMomentos(momentos);

    if(momentos && momentos[0]) {
      res.json(momentos);
    } else {
      res.status(204).send();
    }
  },

  async buscarMomentosUsuario(req, res) {
    const { usuario_id } = req.params;

    let momentos = await db('momentos').select().where({ usuario_id });
    momentos = preparaMomentos(momentos);
    
    if(momentos && momentos[0]) {
      res.json(momentos);
    } else {
      res.status(204).send();
    }
  }
}