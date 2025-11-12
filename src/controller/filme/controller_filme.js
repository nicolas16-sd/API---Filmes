/******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model para o CRUD de filmes
 * Versão: 1.0
 * Data: 07/10/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const filmeDAO = require("../../model/DAO/filme.js");
const controllerFilmeGenero = require('../../controller/filme/controller_filme_genero.js')
const DEFAULT_MESSAGES = require("../modulo/config_messages.js");

//Retorna uma lista de todos os filmes
const listarFilmes = async function () {
  //Criando um objeto novo para as mensagens
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //Chama a função do DAO para retornar a lista de filmes do Banco de Dados
    let resultFilmes = await filmeDAO.getSelectAllMovies();

    if (resultFilmes) {
      if (resultFilmes.length > 0) {
        //Pegando o status code da requisição de sucesso
        DEFAULT_MESSAGES.DEFAULT_HEADER.status =
          DEFAULT_MESSAGES.SUCCESS_REQUEST.status;
        DEFAULT_MESSAGES.DEFAULT_HEADER.status_code =
          DEFAULT_MESSAGES.SUCCESS_REQUEST.status_code;
        DEFAULT_MESSAGES.DEFAULT_HEADER.itens.filme = resultFilmes;

        return DEFAULT_MESSAGES.DEFAULT_HEADER; //200
      } else {
        return MESSAGES.ERROR_NOT_FOUND; //404
      }
    } else {
      return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

//Retorna um filme filtrando pelo ud
const buscarFilmeId = async function (id) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    if (!isNaN(id) && id != "" && id != null && id > 0) {
      let resultFilmes = await filmeDAO.getSelectByIdMovies(Number(id));

      if (resultFilmes) {
        if (resultFilmes.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
          MESSAGES.DEFAULT_HEADER.itens.filme = resultFilmes;

          return MESSAGES.DEFAULT_HEADER; //200
        } else {
          return MESSAGES.ERROR_NOT_FOUND;
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[Id incorreto]";
      return MESSAGES.ERROR_REQUIRED_FIELDS; //400
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

//Insere um filme
const inserirFilme = async function (filme, contentType) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //Validção do tipo de conteúdo da requisição (Obrigatório ser um JSON )
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //Chama a função de validar todos os dados do filme
      let validar = await validarDadosFilme(filme);

      if (!validar) {
        //Chama a função para inserir um novo filme no Banco de Dados
        let resultFilmes = await filmeDAO.setInsertMovies(filme);

        if (resultFilmes) {
          //Chama a função para receber o ID gerado no Banco de Dados
          let lastId = await filmeDAO.getSelectLastId()

          if(lastId) {

            for (genero of filme.genero) {
              let filmeGenero = {id_filme: lastId, id_genero: genero.id}

              let resultFilmesGenero = await controllerFilmeGenero.inserirFilmeGenero(filmeGenero, contentType)

              if(resultFilmesGenero.status_code != 201)
                return MESSAGES.ERROR_RELATIONAL_INSERTION //500 Problema de tabela de relação
            }

            //Adiciona o ID no JSON com os dados do filme
            filme.id = lastId 

            MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
            MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
            MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;

            //Adicionar no JSON dados do gênero
            delete filme.genero

            //Pesquisa no BD todos os gêneros que foram associados ao filme
            let resultDadosGenero = await controllerFilmeGenero.listarGenerosIdFilme(lastId)

            //Cria novamente o atributo gênero e coloca o resultado do BD com os gêneros
            filme.genero = resultDadosGenero.itens.filme_genero

            MESSAGES.DEFAULT_HEADER.itens = filme

            return MESSAGES.DEFAULT_HEADER; //201
          } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
          }
        } else {
          return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }
      } else {
        return validar; //400
      }
    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

//Atualiza um filme buscando pelo Id
const atualizarFilme = async function (filme, id, contentType) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    //Validção do tipo de conteúdo da requisição (Obrigatório ser um JSON )
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      //Chama a função de validar todos os dados do filme
      let validar = await validarDadosFilme(filme);

      if (!validar) {
        //Validação do Id, se existe no Banco de Dados
        //Validação do Id válido, chama a função da controller que verifica no Banco de Dados se o Id existe e valida o Id
        let validarId = await buscarFilmeId(id);

        if (validarId.status_code == 200) {

          //Adiciona o Id do filme no JSON de dados para ser encaminhado no DAO
          filme.id = Number(id)
          //Chama a função para inserir um novo filme no Banco de Dados
          let resultFilmes = await filmeDAO.setUpdateMovies(filme);

          if (resultFilmes) {
            MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
            MESSAGES.DEFAULT_HEADER.status_code =MESSAGES.SUCCESS_CREATED_ITEM.status_code;
            MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
            MESSAGES.DEFAULT_HEADER.itens.filme = filme;

            return MESSAGES.DEFAULT_HEADER; //201
          } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
          }
        } else {
          return validarId // A função buscar poderá retornar (400, 404 ou 500)
        }
      } else {
        return validar; //400 -> Referente a validação dos dados
      }
    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; //415
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
  }
};

// Exclui um filme buscando pelo id
const excluirFilme = async function (id, contentType) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    // Permite requisições sem content-type ou com JSON
    if (!contentType || String(contentType).toUpperCase() == "APPLICATION/JSON") {
      
      // Valida se o id é válido
      if (!isNaN(id) && id > 0) {

        // Verifica se o filme existe antes de excluir
        let validarId = await buscarFilmeId(id);

        if (validarId.status_code == 200) {
          // Executa exclusão no banco
          let resultFilmes = await filmeDAO.setDeleteMovies(id);

          if (resultFilmes) {
            MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
            MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
            MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;

            return MESSAGES.DEFAULT_HEADER; // 201
          } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500 - erro no DAO
          }
        } else {
          return validarId; // Pode retornar 404, 400 ou 500 da função buscarFilmeId
        }

      } else {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += " [Id incorreto]";
        return MESSAGES.ERROR_REQUIRED_FIELDS; // 400
      }

    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; // 415
    }

  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

//Validação dos dados de cadastro e atualização do filme
const validarDadosFilme = async function (filme) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  if (
    filme.nome == "" ||
    filme.nome == undefined ||
    filme.nome == null ||
    filme.nome.length > 100
  ) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "{Nome incorreto}";
    return MESSAGES.ERROR_REQUIRED_FIELDS;  
  } else if (filme.sinopse == undefined) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "{Sinopse incorreta}";
    return MESSAGES.ERROR_REQUIRED_FIELDS;
  } else if (
    filme.data_lancamento == undefined ||
    filme.data_lancamento.length != 10
  ) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "{Data Lançamento incorreto}";
    return MESSAGES.ERROR_REQUIRED_FIELDS;
  } else if (
    filme.duracao == "" ||
    filme.duracao == undefined ||
    filme.duracao == null ||
    filme.duracao.length > 8
  ) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "{Duração incorreto}";
    return MESSAGES.ERROR_REQUIRED_FIELDS;
  } else if (
    filme.orcamento == "" ||
    filme.orcamento == undefined ||
    filme.orcamento == null ||
    filme.orcamento.length > 100 ||
    typeof filme.orcamento != "number"
  ) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "{Orçamento incorreto}";
    return MESSAGES.ERROR_REQUIRED_FIELDS;
  } else if (filme.trailer == undefined || filme.trailer.length >= 200) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "{Trailer incorreto}";
    return MESSAGES.ERROR_REQUIRED_FIELDS;
  } else if (
    filme.capa == "" ||
    filme.capa == undefined ||
    filme.capa == null ||
    filme.capa.length > 200
  ) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "{Capa incorreto}";
    return MESSAGES.ERROR_REQUIRED_FIELDS;
  } else {
    //Isso significa que o código não teve erros
    return false;
  }
};

module.exports = {
  listarFilmes,
  buscarFilmeId,
  inserirFilme,
  atualizarFilme,
  excluirFilme
};
