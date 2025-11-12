/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente à classificação indicativa
 * Versão: 1.0
 * Data: 03/11/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const { PrismaClient } = require('../../../generated/prisma')

const prisma = new PrismaClient()

// Retorna todos os registros da tabela de classificações indicativas
const getSelectAllClassifications = async function () {
  try {
    let sql = `SELECT * FROM tbl_classificacao_indicativa ORDER BY id_classificacao_indicativa DESC`

    let result = await prisma.$queryRawUnsafe(sql)

    if (Array.isArray(result))
      return result
    else
      return false
  } catch (error) {
    return false
  }
}

// Retorna uma classificação indicativa pelo ID
const getSelectByIdClassification = async function (id) {
  try {
    let sql = `SELECT * FROM tbl_classificacao_indicativa WHERE id_classificacao_indicativa = ${id}`

    let result = await prisma.$queryRawUnsafe(sql)

    if (Array.isArray(result))
      return result
    else
      return false
  } catch (error) {
    return false
  }
}

// Retorna o último ID inserido
const getSelectLastId = async function () {
  try {
    let sql = `SELECT * FROM tbl_classificacao_indicativa ORDER BY id_classificacao_indicativa DESC LIMIT 1`

    let result = await prisma.$queryRawUnsafe(sql)

    if (Array.isArray(result))
      return Number(result[0].id_classificacao_indicativa)
    else
      return false
  } catch (error) {
    return false
  }
}

// Insere uma nova classificação indicativa
const setInsertClassification = async function (classificacao) {
  try {
    let sql = `INSERT INTO tbl_classificacao_indicativa (nome)
               VALUES ('${classificacao.nome}')`

    let result = await prisma.$executeRawUnsafe(sql)

    if (result)
      return true
    else
      return false
  } catch (error) {
    return false
  }
}

// Atualiza uma classificação indicativa existente
const setUpdateClassification = async function (classificacao) {
  try {
    let sql = `UPDATE tbl_classificacao_indicativa SET 
                nome = '${classificacao.nome}'
               WHERE id_classificacao_indicativa = ${classificacao.id}`

    let result = await prisma.$executeRawUnsafe(sql)

    if (result)
      return true
    else
      return false
  } catch (error) {
    return false
  }
}

// Deleta uma classificação indicativa pelo ID
const setDeleteClassification = async function (id) {
  try {
    let sql = `DELETE FROM tbl_classificacao_indicativa WHERE id_classificacao_indicativa = ${id}`

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
  getSelectAllClassifications,
  getSelectByIdClassification,
  getSelectLastId,
  setInsertClassification,
  setUpdateClassification,
  setDeleteClassification
}
