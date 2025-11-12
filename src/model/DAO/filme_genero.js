/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados no MySQL referente à tabela intermediária entre Filme e Gênero
 * Versão: 1.0
 * Data: 01/10/2025
 * Autor: Nicolas dos Santos Durão
 *****************************************************************************/

// Import da dependência do Prisma
const { PrismaClient } = require('../../../generated/prisma')

// Cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

// 1 - Retorna uma lista de todos os filmes e gêneros
const getSelectAllMoviesGenres = async function () {
  try {
    const sql = `SELECT * FROM tbl_filme_genero ORDER BY id_filme_genero DESC`
    const result = await prisma.$queryRawUnsafe(sql)
    return Array.isArray(result) ? result : false
  } catch {
    return false
  }
}

// 2 - Retorna um registro filtrando pelo ID
const getSelectByIdGenres = async function (id) {
  try {
    const sql = `SELECT * FROM tbl_filme_genero WHERE id_filme_genero = ${id}`
    const result = await prisma.$queryRawUnsafe(sql)
    return Array.isArray(result) ? result : false
  } catch {
    return false
  }
}

// 3 - Retorna gêneros de um filme
const getSelectGenresByIdMovies = async function (id_filme) {
  try {
    const sql = `
      SELECT g.id_genero, g.categoria
      FROM tbl_filme f
      INNER JOIN tbl_filme_genero fg ON f.id = fg.id_filme
      INNER JOIN tbl_genero g ON g.id_genero = fg.id_genero
      WHERE f.id = ${id_filme}
    `
    const result = await prisma.$queryRawUnsafe(sql)
    return Array.isArray(result) ? result : false
  } catch {
    return false
  }
}

// 4 - Retorna filmes de um gênero
const getSelectMoviesByIdGenres = async function (id_genero) {
  try {
    const sql = `
      SELECT f.id, f.nome
      FROM tbl_filme f
      INNER JOIN tbl_filme_genero fg ON f.id = fg.id_filme
      INNER JOIN tbl_genero g ON g.id_genero = fg.id_genero
      WHERE g.id_genero = ${id_genero}
    `
    const result = await prisma.$queryRawUnsafe(sql)
    return Array.isArray(result) ? result : false
  } catch {
    return false
  }
}

// 5 - Retorna o último ID inserido
const getSelectLastId = async function () {
  try {
    const sql = `SELECT id_filme_genero FROM tbl_filme_genero ORDER BY id_filme_genero DESC LIMIT 1`
    const result = await prisma.$queryRawUnsafe(sql)

    if (Array.isArray(result) && result.length > 0)
      return Number(result[0].id_filme_genero)
    else
      return false

  } catch {
    return false
  }
}

// 6 - Insere uma nova relação entre filme e gênero
const setInsertMoviesGenres = async function (filmeGenero) {
  try {
    const sql = `
      INSERT INTO tbl_filme_genero (id_filme, id_genero)
      VALUES (${filmeGenero.id_filme}, ${filmeGenero.id_genero})
    `
    const result = await prisma.$executeRawUnsafe(sql)
    return result ? true : false
  } catch {
    return false
  }
}

// 7 - Atualiza uma relação
const setUpdateMoviesGenres = async function (filmeGenero) {
  try {
    const sql = `
      UPDATE tbl_filme_genero
      SET id_filme = ${filmeGenero.id_filme},
          id_genero = ${filmeGenero.id_genero}
      WHERE id_filme_genero = ${filmeGenero.id_filme_genero}
    `
    const result = await prisma.$executeRawUnsafe(sql)
    return result ? true : false
  } catch {
    return false
  }
}

// 8 - Deleta uma relação
const setDeleteMoviesGenres = async function (id) {
  try {
    const sql = `DELETE FROM tbl_filme_genero WHERE id_filme_genero = ${id}`
    const result = await prisma.$executeRawUnsafe(sql)
    return result ? true : false
  } catch {
    return false
  }
}

module.exports = {
  getSelectAllMoviesGenres,
  getSelectByIdGenres,
  getSelectGenresByIdMovies,
  getSelectMoviesByIdGenres,
  getSelectLastId,
  setInsertMoviesGenres,
  setUpdateMoviesGenres,
  setDeleteMoviesGenres
}   
