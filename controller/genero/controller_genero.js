/******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model para o CRUD de gêneros
 * Versão: 1.0
 * Data: 22/10/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const generoDao = require('../../model/DAO/genero.js')
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

const listarGeneros = async function() {
     let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));
     
     try {
        let resultGenres = await generoDao.getSelectAllGenres()

        if(resultGenres){
            if(resultGenres.length > 0) {
                DEFAULT_MESSAGES.DEFAULT_HEADER.status = DEFAULT_MESSAGES.SUCCESS_REQUEST.status;
                DEFAULT_MESSAGES.DEFAULT_HEADER.status_code = DEFAULT_MESSAGES.SUCCESS_REQUEST.status_code;
                DEFAULT_MESSAGES.DEFAULT_HEADER.itens.generos = resultGenres;

                return DEFAULT_MESSAGES.DEFAULT_HEADER; //200
            } else {
                return MESSAGES.ERROR_NOT_FOUND; //4040
            }
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; //500
        }
     } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER; //500
     }
}

const buscarGeneroId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if(!isNaN(id) && id != "" && id != null && id > 0){
            let resultGenres = await generoDao.getSelectByIdGenres(Number(id))

            if(resultGenres){
                if(resultGenres.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status;
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code;
                    MESSAGES.DEFAULT_HEADER.itens.generos = resultGenres;

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

const inserirNovoGenero = async function (genero, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDadosGenero(genero)

            if(!validar){
                let resultGenres = await generoDao.setInsertGenres(genero)

                if(resultGenres) {
                    let lastId = await generoDao.getSelectLastId()

                    if(lastId){
                        genero.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens = genero

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

const validarDadosGenero = async function(genero) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    if (
        genero.categoria == "" ||
        genero.categoria == null || 
        genero.categoria == undefined ||
        genero.categoria.length > 200
    ) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += "[Campo incorreto!]"
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}

module.exports = {
    listarGeneros,
    buscarGeneroId,
    validarDadosGenero,
    inserirNovoGenero
}