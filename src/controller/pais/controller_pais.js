/******************************************************************************
 * Objetivo: Controller responsável pela manipulação de dados entre o App e a Model para o CRUD de países
 * Versão: 1.0
 * Data: 03/11/2025
 * Autor: Nicolas dos Santos Durão
 *****************************************************************************/

const paisDAO = require("../../model/DAO/pais.js");
const DEFAULT_MESSAGES = require("../modulo/config_messages.js");

// Retorna todos os países
const listarPaises = async function () {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    let resultPaises = await paisDAO.getSelectAllCountries();

    if (resultPaises) {
      if (resultPaises.length > 0) {
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
        MESSAGES.DEFAULT_HEADER.itens.paises = resultPaises;

        return MESSAGES.DEFAULT_HEADER; // 200
      } else {
        return MESSAGES.ERROR_NOT_FOUND; // 404
      }
    } else {
      return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// Retorna um país pelo ID
const buscarPaisId = async function (id) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    if (!isNaN(id) && id > 0) {
      let resultPais = await paisDAO.getSelectByIdCountry(Number(id));

      if (resultPais) {
        if (resultPais.length > 0) {
          MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
          MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
          MESSAGES.DEFAULT_HEADER.itens.pais = resultPais;

          return MESSAGES.DEFAULT_HEADER; // 200
        } else {
          return MESSAGES.ERROR_NOT_FOUND; // 404
        }
      } else {
        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
      }
    } else {
      MESSAGES.ERROR_REQUIRED_FIELDS.message += "[Id incorreto]";
      return MESSAGES.ERROR_REQUIRED_FIELDS; // 400
    }
  } catch (error) {
    return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; // 500
  }
};

// Insere um novo país
const inserirPais = async function (pais, contentType) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validar = await validarDadosPais(pais);

      if (!validar) {
        let resultPais = await paisDAO.setInsertCountry(pais);

        if (resultPais) {
          let lastId = await paisDAO.getSelectLastId();

          if (lastId) {
            pais.id = lastId;

            MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
            MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
            MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
            MESSAGES.DEFAULT_HEADER.itens = pais;

            return MESSAGES.DEFAULT_HEADER; // 201
          } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
          }
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

// Atualiza um país pelo ID
const atualizarPais = async function (pais, id, contentType) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
      let validar = await validarDadosPais(pais);

      if (!validar) {
        let validarId = await buscarPaisId(id);

        if (validarId.status_code == 200) {
          pais.id = Number(id);

          let resultPais = await paisDAO.setUpdateCountry(pais);

          if (resultPais) {
            MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
            MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
            MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
            MESSAGES.DEFAULT_HEADER.itens.pais = pais;

            return MESSAGES.DEFAULT_HEADER; // 201
          } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
          }
        } else {
          return validarId; // pode retornar 400, 404, 500
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

// Exclui um país pelo ID
const excluirPais = async function (id, contentType) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  try {
    if (!contentType || String(contentType).toUpperCase() == "APPLICATION/JSON") {
      if (!isNaN(id) && id > 0) {
        let validarId = await buscarPaisId(id);

        if (validarId.status_code == 200) {
          let resultPais = await paisDAO.setDeleteCountry(id);

          if (resultPais) {
            MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
            MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
            MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;

            return MESSAGES.DEFAULT_HEADER; // 201
          } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
          }
        } else {
          return validarId; // 400, 404 ou 500
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

// Validação de dados de país
const validarDadosPais = async function (pais) {
  let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

  if (!pais.nome || pais.nome.length > 200) {
    MESSAGES.ERROR_REQUIRED_FIELDS.message += "{Nome incorreto}";
    return MESSAGES.ERROR_REQUIRED_FIELDS;
  } else {
    return false; // válido
  }
};

module.exports = {
  listarPaises,
  buscarPaisId,
  inserirPais,
  atualizarPais,
  excluirPais,
};