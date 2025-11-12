/******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model 
 *            para o CRUD de Classificação Indicativa
 * Versão: 1.0
 * Data: 03/11/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const classificacaoDao = require('../../../src/model/DAO/classificacao_indicativa.js')
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

// Lista todas as classificações
const listarClassificacoes = async function() {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));
    
    try {
        let resultClass = await classificacaoDao.getSelectAllClassifications();

        if (resultClass) {
            if (resultClass.length > 0) {
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                MESSAGES.DEFAULT_HEADER.itens.classificacoes = resultClass;

                return MESSAGES.DEFAULT_HEADER; //200
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

// Busca uma classificação pelo ID
const buscarClassificacaoId = async function(id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if (!isNaN(id) && id != "" && id != null && id > 0) {
            let resultClass = await classificacaoDao.getSelectByIdClassification(Number(id));

            if (resultClass) {
                if (resultClass.length > 0) {
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                    MESSAGES.DEFAULT_HEADER.itens.classificacoes = resultClass;

                    return MESSAGES.DEFAULT_HEADER;
                } else {
                    return MESSAGES.ERROR_NOT_FOUND;
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += " [Id incorreto]";
            return MESSAGES.ERROR_REQUIRED_FIELDS; //400
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
    }
}

// Insere uma nova classificação
const inserirNovaClassificacao = async function(classificacao, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDadosClassificacao(classificacao);

            if (!validar) {
                let resultClass = await classificacaoDao.setInsertClassification(classificacao);

                if (resultClass) {
                    let lastId = await classificacaoDao.getSelectLastId();

                    if (lastId) {
                        classificacao.id = lastId;

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
                        MESSAGES.DEFAULT_HEADER.itens = classificacao;

                        return MESSAGES.DEFAULT_HEADER; //201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
                    }
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
                }
            } else {
                return validar;
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE; //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// Atualiza uma classificação
const atualizarClassificacao = async function(classificacao, id, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if (String(contentType).toUpperCase() == "APPLICATION/JSON") {
            let validar = await validarDadosClassificacao(classificacao);

            if (!validar) {
                let validarId = await buscarClassificacaoId(id);

                if (validarId.status_code == 200) {
                    classificacao.id = Number(id);
                    let resultClass = await classificacaoDao.setUpdateClassification(classificacao);

                    if (resultClass) {
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
                        MESSAGES.DEFAULT_HEADER.itens.classificacao = classificacao;

                        return MESSAGES.DEFAULT_HEADER; //201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
                    }
                } else {
                    return validarId; // 404, 400 ou 500
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

// Exclui uma classificação pelo ID
const excluirClassificacao = async function(id, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if (!contentType || String(contentType).toUpperCase() == "APPLICATION/JSON") {
            if (!isNaN(id) && id > 0) {
                let validarId = await buscarClassificacaoId(id);

                if (validarId.status_code == 200) {
                    let resultClass = await classificacaoDao.setDeleteClassification(id);

                    if (resultClass) {
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status;
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code;
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message;

                        return MESSAGES.DEFAULT_HEADER; //201
                    } else {
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
                    }
                } else {
                    return validarId; 
                }
            } else {
                MESSAGES.ERROR_REQUIRED_FIELDS.message += " [Id incorreto]";
                return MESSAGES.ERROR_REQUIRED_FIELDS;
            }
        } else {
            return MESSAGES.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// Validação dos dados da classificação
const validarDadosClassificacao = async function(classificacao) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    if (
        classificacao.nome == "" ||
        classificacao.nome == null ||
        classificacao.nome == undefined ||
        classificacao.nome.length > 10
    ) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += " [Campo nome incorreto!]";
        return MESSAGES.ERROR_REQUIRED_FIELDS; //400
    } else {
        return false;
    }
}

module.exports = {
    listarClassificacoes,
    buscarClassificacaoId,
    validarDadosClassificacao,
    inserirNovaClassificacao,
    atualizarClassificacao,
    excluirClassificacao
}
