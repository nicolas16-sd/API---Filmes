/******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model para o CRUD de plataformas
 * Versão: 1.0
 * Data: 03/11/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const plataformaDao = require('../../model/DAO/plataforma.js')
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

// Retorna todas as plataformas
const listarPlataformas = async function() {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));
    
    try {
        let resultPlataformas = await plataformaDao.getSelectAllPlataformas()

        if(resultPlataformas){
            if(resultPlataformas.length > 0) {
                DEFAULT_MESSAGES.DEFAULT_HEADER.status = DEFAULT_MESSAGES.SUCCESS_REQUEST.status;
                DEFAULT_MESSAGES.DEFAULT_HEADER.status_code = DEFAULT_MESSAGES.SUCCESS_REQUEST.status_code;
                DEFAULT_MESSAGES.DEFAULT_HEADER.itens.plataformas = resultPlataformas;

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
}

// Retorna plataforma pelo ID
const buscarPlataformaId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if(!isNaN(id) && id != "" && id != null && id > 0){
            let resultPlataformas = await plataformaDao.getSelectByIdPlataforma(Number(id))

            if(resultPlataformas){
                if(resultPlataformas.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                    MESSAGES.DEFAULT_HEADER.itens.plataformas = resultPlataformas;

                    return MESSAGES.DEFAULT_HEADER;
                } else {
                    return MESSAGES.ERROR_NOT_FOUND;
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += "[Id incorreto]"
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

// Inserir nova plataforma
const inserirNovaPlataforma = async function (plataforma, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDadosPlataforma(plataforma)

            if(!validar){
                let resultPlataformas = await plataformaDao.setInsertPlataforma(plataforma)

                if(resultPlataformas) {
                    let lastId = await plataformaDao.getSelectLastId()

                    if(lastId){
                        plataforma.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens = plataforma

                        return MESSAGES.DEFAULT_HEADER
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return validar
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Atualizar plataforma existente
const atualizarPlataforma = async function(plataforma, id, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
            let validar = await validarDadosPlataforma(plataforma);
        
            if (!validar) {
                let validarId = await buscarPlataformaId(id);
        
                if (validarId.status_code == 200) {
                    plataforma.id = Number(id)
                    let resultPlataformas = await plataformaDao.setUpdatePlataforma(plataforma);
        
                    if (resultPlataformas) {
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
                        MESSAGES.DEFAULT_HEADER.itens.plataforma = plataforma;
        
                        return MESSAGES.DEFAULT_HEADER; //201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
                    }
                } else {
                    return validarId // Pode retornar 400, 404 ou 500
                }
            } else {
                return validar; //400
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE; //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// Excluir plataforma
const excluirPlataforma = async function(id, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if (!contentType || String(contentType).toUpperCase() == "APPLICATION/JSON") {
            if (!isNaN(id) && id > 0) {

                let validarId = await buscarPlataformaId(id);

                if (validarId.status_code == 200) {
                    let resultPlataformas = await plataformaDao.setDeletePlataforma(id);

                    if (resultPlataformas) {
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;

                        return MESSAGES.DEFAULT_HEADER; // 201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
                    }
                } else {
                    return validarId; // Pode retornar 404, 400 ou 500
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
}

// Validação dos dados
const validarDadosPlataforma = async function(plataforma) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    if (
        plataforma.nome == "" ||
        plataforma.nome == null || 
        plataforma.nome == undefined ||
        plataforma.nome.length > 100
    ) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += "[Campo incorreto!]";
        return MESSAGES.ERROR_REQUIRED_FIELDS;
    } else {
        return false
    }
}

module.exports = {
    listarPlataformas,
    buscarPlataformaId,
    validarDadosPlataforma,
    inserirNovaPlataforma,
    atualizarPlataforma, 
    excluirPlataforma
}
