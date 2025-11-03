/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente à plataforma
 * Versão: 1.0
 * Data: 03/11/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

// Retorna todas as plataformas
const getSelectAllPlataformas = async function() {
    try {
        let sql = `SELECT * FROM tbl_plataforma ORDER BY id_plataforma DESC`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

// Retorna plataforma por ID
const getSelectByIdPlataforma = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_plataforma WHERE id_plataforma = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

// Retorna último ID inserido
const getSelectLastId = async function() {
    try {
        let sql = `SELECT * FROM tbl_plataforma ORDER BY id_plataforma DESC LIMIT 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return Number(result[0].id_plataforma)
        else
            return false
    } catch (error) {
        return false
    }
}

// Insere uma nova plataforma
const setInsertPlataforma = async function(plataforma) {
    try {
        let sql = `INSERT INTO tbl_plataforma(nome)
                   VALUES ('${plataforma.nome}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

// Atualiza uma plataforma existente
const setUpdatePlataforma = async function(plataforma) {
    try {
        let sql = `UPDATE tbl_plataforma SET 
                       nome = '${plataforma.nome}'
                   WHERE id_plataforma = ${plataforma.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

// Exclui uma plataforma
const setDeletePlataforma = async function(id) {
    try {
        let sql = `DELETE FROM tbl_plataforma WHERE id_plataforma = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllPlataformas,
    getSelectByIdPlataforma,
    getSelectLastId,
    setInsertPlataforma,
    setUpdatePlataforma,
    setDeletePlataforma
}
