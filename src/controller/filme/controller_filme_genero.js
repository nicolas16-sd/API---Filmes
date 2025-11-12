/********************************************************************************
 * Objetivo: Arquivo responsável pela tabela intermediária entre filme e gênero
 * Autor: Nicolas dos Santos Durão
 * Data: 11/11/2025
 ********************************************************************************/

// Import da model do DAO do filme

const filmeGeneroDAO = require("../../../src/model/DAO/filme_genero.js");

// Import do arquivo de mensagens padronizadas

const DEFAULT_MESSAGES = require("../modulo/config_messages.js");

// 1- Retorna uma lista de todos os filmes

const listarFilmesGeneros = async function () {
  // Criando um objeto novo para as mensagens

  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    // Chama a função do DAO que irá retornar todos os filmes do BD

    let resultFilmesGeneros = await filmeGeneroDAO.getSelectAllmoviesGenres();

    if (resultFilmesGeneros) {
      if (resultFilmesGeneros.length > 0) {
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;

        MESSAGES.DEFAULT_HEADER.status_code =
          MESSAGES.SUCCESS_REQUEST.status_code;

        MESSAGES.DEFAULT_HEADER.items.filmes_generos = resultFilmesGeneros;

        return MESSAGES.DEFAULT_HEADER; // 200
      } else {
        return MESSAGES.ERROR_NOT_FOUND; // 404
      }
    } else {
      return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
    }
  } catch (error) {
    return DEFAULT_MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// 2- Retorna um filme filtrando pelo ID

const buscarFilmeGeneroID = async function (id) {
  // Criando um objeto novo para as mensagens

  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    // Validação da chegada do ID

    if (!isNaN(id) && id != "" && id != null && id > 0) {
      // Chama função DAO

      let resultFilmesGeneros = await filmeGeneroDAO.getSelectMoviesByIdGenres(
        Number(id)
      );

      if (resultFilmesGeneros) {
        if (resultFilmes.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;

          MESSAGES.DEFAULT_HEADER.status_code =
            MESSAGES.SUCCESS_REQUEST.status_code;

          MESSAGES.DEFAULT_HEADER.items.filmes_generos = resultFilmesGeneros;

          return MESSAGES.DEFAULT_HEADER; // 200
        } else {
          return MESSAGES.ERROR_NOT_FOUND; // 404
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]";

      return MESSAGES.ERROR_REQUIRED_FIELDS; // 400 - referente ao ID
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// 3- Retorna um gênero filtrando pelo ID do filme

const listarGenerosIdFilme = async function (idFilme) {
  // Criando um objeto novo para as mensagens

  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    // Validação da chegada do ID

    if (!isNaN(idFilme) && idFilme != "" && idFilme != null && idFilme > 0) {
      // Chama função DAO

      let resultFilmesGeneros = await filmeGeneroDAO.getSelectGenresByIdMovies(
        Number(idFilme)
      );

      if (resultFilmesGeneros) {
        if (resultFilmes.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;

          MESSAGES.DEFAULT_HEADER.status_code =
            MESSAGES.SUCCESS_REQUEST.status_code;

          MESSAGES.DEFAULT_HEADER.items.filmes_generos = resultFilmesGeneros;

          return MESSAGES.DEFAULT_HEADER; // 200
        } else {
          return MESSAGES.ERROR_NOT_FOUND; // 404
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]";

      return MESSAGES.ERROR_REQUIRED_FIELDS; // 400 - referente ao ID
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// 4- Retorna um filme filtrando pelo ID do gênero

const listarFilmeIdGeneros = async function (idGenero) {
  // Criando um objeto novo para as mensagens

  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    // Validação da chegada do ID

    if (
      !isNaN(idGenero) &&
      idGenero != "" &&
      idGenero != null &&
      idGenero > 0
    ) {
      // Chama função DAO

      let resultFilmesGeneros = await filmeGeneroDAO.getSelectMoviesByIdGenres(
        Number(idGenero)
      );

      if (resultFilmesGeneros) {
        if (resultFilmes.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;

          MESSAGES.DEFAULT_HEADER.status_code =
            MESSAGES.SUCCESS_REQUEST.status_code;

          MESSAGES.DEFAULT_HEADER.items.filmes_generos = resultFilmesGeneros;

          return MESSAGES.DEFAULT_HEADER; // 200
        } else {
          return MESSAGES.ERROR_NOT_FOUND; // 404
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]";

      return MESSAGES.ERROR_REQUIRED_FIELDS; // 400 - referente ao ID
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// 3- Insere um filme

const inserirFilmeGenero = async function (filmeGenero, contentType) {
  // Criando um objeto novo para as mensagens

  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    // Validação do tipo de conteúdo da requisição (obrigatório por ser um Json)

    if (String(contentType).toLocaleUpperCase() == "APPLICATION/JSON") {
      // Chama a função de validar todos os dados do filme

      let validar = await validarDadosFilmeGenero(filmeGenero);

      if (!validar) {
        // Chama a função para inserir um novo filme no banco de dados

        let resultFilmesGeneros = await filmeGeneroDAO.setInsertMoviesGenres(
          filmeGenero
        );

        if (resultFilmesGeneros) {
          // Chama  a função para recebr o ID gerado no BD

          let lastID = await filmeGeneroDAO.getSelectLastId();

          if (lastID) {
            // Adiciona o ID no Json com os dados do filme

            filmeGenero.id = lastID;

            MESSAGES.DEFAULT_HEADER.status =
              MESSAGES.SUCCESS_CREATED_ITEM.status;

            MESSAGES.DEFAULT_HEADER.status_code =
              MESSAGES.SUCCESS_CREATED_ITEM.status_code;

            MESSAGES.DEFAULT_HEADER.message =
              MESSAGES.SUCCESS_CREATED_ITEM.message;

            MESSAGES.DEFAULT_HEADER.items = filmeGenero;
          } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
          }

          return MESSAGES.DEFAULT_HEADER; // 201
        } else {
          return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
        }
      } else {
        return validar; // 400
      }
    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; // 415
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// 4- Atualiza um filme buscando pelo ID

const atualizarFilmeGenero = async function (filmeGenero, id, contentType) {
  // Criando um objeto novo para as mensagens

  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    // Validação do tipo de conteúdo da requisição (obrigatório por ser um Json)

    if (String(contentType).toLocaleUpperCase() == "APPLICATION/JSON") {
      // Chama a função de validar todos os dados do filme

      let validar = await validarDadosFilmeGenero(filmeGenero);

      if (!validar) {
        // Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o mesmo

        let validarID = await buscarFilmeGeneroID(id);

        if (validarID.status_code == 200) {
          // Adiciona o ID do filme no Json dados para ser encaminhado ao DAO

          filmeGenero.id = Number(id);

          // Processamento

          // Chama a função para inserir um novo filme no BD

          let resultFilmesGeneros = await filmeGeneroDAO.setUpdateMoviesGenres(
            filmeGenero
          );

          if (resultFilmesGeneros) {
            MESSAGES.DEFAULT_HEADER.status =
              MESSAGES.SUCCESS_CREATED_ITEM.status;

            MESSAGES.DEFAULT_HEADER.status_code =
              MESSAGES.SUCCESS_CREATED_ITEM.status_code;

            MESSAGES.DEFAULT_HEADER.message =
              MESSAGES.SUCCESS_CREATED_ITEM.message;

            MESSAGES.DEFAULT_HEADER.items.filmes_generos = filmeGenero;

            return MESSAGES.DEFAULT_HEADER; // 201
          } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
          }
        } else {
          return validarID; // A função buscar poderá retornar (400, 404 ou 500)
        }
      } else {
        return validar; // 400 referente a validação dos dados
      }
    } else {
      return MESSAGES.ERROR_CONTENT_TYPE; // 415
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// 5- Exclui um filme buscando pelo ID

const excluirFilmeGenero = async function (id) {
  // Criando um objeto novo para as mensagens

  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    // Validação da chegada do ID

    if (!isNaN(id) && id != "" && id != null && id > 0) {
      // Chama função DAO

      let resultFilmesGeneros = await filmeGeneroDAO.setDeleteMoviesGenres(
        Number(id)
      );

      if (resultFilmesGeneros) {
        if (resultFilmesGeneros.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;

          MESSAGES.DEFAULT_HEADER.status_code =
            MESSAGES.SUCCESS_REQUEST.status_code;

          MESSAGES.DEFAULT_HEADER.items.filmes_generos = resultFilmesGeneros;

          return MESSAGES.DEFAULT_HEADER; // 200
        } else {
          return MESSAGES.ERROR_NOT_FOUND; // 404
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[ID incorreto]";

      return MESSAGES.ERROR_REQUIRED_FIELDS; // 400 - referente ao ID
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// Validação dos dados de cadastro e atualização de um filme

const validarDadosFilmeGenero = async function (filmeGenero) {
  // Criando um objeto novo para as mensagens

  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  // Validação de todas as entradas de dados

  if (
    filmeGenero.id_filme <= 0 ||
    isNaN(filmeGenero.id_filme) ||
    filmeGenero.id_filme == "" ||
    filmeGenero.id_filme == undefined ||
    filmeGenero.id_filme == null
  ) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "[id_filme incorreto]";

    return MESSAGES.ERROR_REQUIRED_FIELDS; // 400
  } else if (
    filmeGenero.id_genero <= 0 ||
    isNaN(filmeGenero.id_genero) ||
    filmeGenero.id_genero == "" ||
    filmeGenero.id_genero == undefined ||
    filmeGenero.id_genero == null
  ) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "[id_filme incorreto]";
  } else {
    return false;
  }
};

module.exports = {
  listarFilmesGeneros,
  buscarFilmeGeneroID,
  inserirFilmeGenero,
  atualizarFilmeGenero,
  excluirFilmeGenero,
  listarGenerosIdFilme,
  listarFilmeIdGeneros,
};
