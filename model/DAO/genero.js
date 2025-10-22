/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente ao gênero
 * Versão: 1.0
 * Data: 22/10/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const {PrismaClient} = require('../../generated/prisma')

const prisma = new PrismaClient()

//Retorna uma lista de dados retornando todos os gêneros
const getSelectAllGenres = async function() {
    try {
        let sql = `select * from tbl_genero order by id_genero desc`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const getSelectByIdGenres = async function(id) {
    try {
        let sql = `select * from tbl_genero where id_genero=${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastId = async function() {
    try {
        let sql = `select * from tbl_genero order by id_genero desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return Number(result[0].id)
        else
            return false
    } catch (error) {
        return false
    }
}

const setInsertGenres = async function(genero) {
    try {
        let sql = `INSERT INTO tbl_genero(categoria)
                    VALUES ('${genero.categoria}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllGenres,
    getSelectByIdGenres,
    getSelectLastId,
    setInsertGenres
}