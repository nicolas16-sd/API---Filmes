/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente ao país
 * Versão: 1.0
 * Data: 03/11/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

// Retorna todos os países
const getSelectAllCountries = async function () {
  try {
    let sql = `SELECT * FROM tbl_pais ORDER BY id_pais DESC`;

    let result = await prisma.$queryRawUnsafe(sql);

    if (Array.isArray(result))
      return result;
    else
      return false;

  } catch (error) {
    console.log(error);
    return false;
  }
};

// Retorna país pelo ID
const getSelectByIdCountry = async function (id) {
  try {
    let sql = `SELECT * FROM tbl_pais WHERE id_pais = ${id}`;

    let result = await prisma.$queryRawUnsafe(sql);

    if (Array.isArray(result))
      return result;
    else
      return false;

  } catch (error) {
    return false;
  }
};

// Retorna o último país cadastrado (para pegar o ID gerado)
const getSelectLastId = async function () {
  try {
    let sql = `SELECT * FROM tbl_pais ORDER BY id_pais DESC LIMIT 1`;

    let result = await prisma.$queryRawUnsafe(sql);

    if (Array.isArray(result))
      return Number(result[0].id_pais);
    else
      return false;

  } catch (error) {
    return false;
  }
};

// Insere um novo país
const setInsertCountry = async function (pais) {
  try {
    let sql = `INSERT INTO tbl_pais (nome)
               VALUES ('${pais.nome}')`;

    let result = await prisma.$executeRawUnsafe(sql);

    if (result)
      return true;
    else
      return false;

  } catch (error) {
    console.log(error);
    return false;
  }
};

// Atualiza um país existente
const setUpdateCountry = async function (pais) {
  try {
    let sql = `UPDATE tbl_pais 
               SET nome = '${pais.nome}'
               WHERE id_pais = ${pais.id}`;

    let result = await prisma.$executeRawUnsafe(sql);

    if (result)
      return true;
    else
      return false;

  } catch (error) {
    console.log(error);
    return false;
  }
};

// Exclui um país
const setDeleteCountry = async function (id) {
  try {
    let sql = `DELETE FROM tbl_pais WHERE id_pais = ${id}`;

    let result = await prisma.$executeRawUnsafe(sql);

    if (result)
      return true;
    else
      return false;

  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getSelectAllCountries,
  getSelectByIdCountry,
  getSelectLastId,
  setInsertCountry,
  setUpdateCountry,
  setDeleteCountry
};
