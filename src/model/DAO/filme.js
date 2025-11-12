/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUDde dados no MySQL referente ao filme
 * Versão: 1.0
 * Data: 01/10/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

/*********************************************************************************************
 * Exemplos de dependências para conexão com Banco de Dados:
 * Bancos de Dados relacionais
 *      Sequelize -> Foi utilizado em muitos projetos desde o início do Node (Limitações técnicas)
 *      Prisma -> É uma dependência atual que trabalha com Banco de Dados (MySQL, PostgreSQL ou ORM...)
 *      Knet -> É uma dependência que trabalha com MySQL
 *
 * Bancos de Dados NÃO relacional:
 *      Mongoose -> É uma dependência para o Mongo DB (Não relacional)
 *
 *      npx prisma migrate dev -> Realiza o sincronismo entre o prisma e o BD (Cuidado), nesse processo você poderá perder dados reais do banco, pois ele pega as tabelas programadas no ORM schema.prisma
 *      npx prisma generate     -> Apenas realiza os sincronismo entre o prisma e o banco, geralmente usamos para rodar o projeto em um PC novo
 *********************************************************************************************/

//Import da dependência da Prisma que permite a execução de Script SQL no Banco de Dados
const { PrismaClient } = require("../../../generated/prisma");

//Cria um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient();

//Rodando um script de select
//Retorna uma lista de todos os filmes do banco de dados
const getSelectAllMovies = async function () {
  try {
    //Script SQL
    let sql = `select * from tbl_filme order by id desc`;

    //$queryRawUnsafe() -> permite executar um script SQL de uma variável e que retorna valores do Banco (SELECT)
    //$executeRawUnsafe() -> permite executar um script SQL de uma variável e que NÃO retorna dados do Banco (INSERT, UPDATE E DELETE)
    //%queryRaw() -> permite executar um script SQL SEM estar em uma variável e que retorna valores do Banco (SELECT) e faz tratamentos de segurança contra SQL Injection
    //$executeRaw() -> permite executar um script SQL SEM estar em uma variável e que NÃO retorna dados do Banco (INSERT, UPDATE E DELETE) e faz tratamentos de segurança contra SQL Injection

    //Encaminha para o Banco de Dados o Script SQL
    let result = await prisma.$queryRawUnsafe(sql);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    //console.log(error)
    return false;
  }
};

//Retorna um filme filtrando pelo Id do Banco de Dados
const getSelectByIdMovies = async function (id) {
  try {
    let sql = `select * from tbl_filme where id=${id}`;

    let result = await prisma.$queryRawUnsafe(sql);

    if (Array.isArray(result)) return result;
    else return false;
  } catch (error) {
    //console.log(error)
    return false;
  }
};

//Retorna o último Id gerado no Banco de Dados
const getSelectLastId = async function() {
  try {
    let sql = `select id from tbl_filme order by id desc limit 1`

    let result = await prisma.$queryRawUnsafe(sql)

    if (Array.isArray(result)) 
      return Number(result[0].id);
    else 
      return false;
  } catch (error) {
    return false
  }
}

//Rodando um script de insert
//Rodando um filme novo no Banco de Dados
const setInsertMovies = async function (filme) {
  try {

    let sql = `INSERT INTO tbl_filme (nome, sinopse, data_lancamento, duracao, orcamento, trailer, capa)
                VALUES ('${filme.nome}',
		                    '${filme.sinopse}',
		                    '${filme.data_lancamento}',
		                    '${filme.duracao}',
		                    '${filme.orcamento}',
		                    '${filme.trailer}',
		                    '${filme.capa}'
		                    )`;

  let result = await prisma.$executeRawUnsafe(sql)
  

  if(result)
    return true
  else
    return false

  } catch (error) {
    return false;
  }

};

//Altera um filme no Banco de Dados
const setUpdateMovies = async function (filme) {
  try {
    let sql = `UPDATE tbl_filme set 
    nome =              '${filme.nome}', 
    sinopse =           '${filme.sinopse}', 
    data_lancamento =   '${filme.data_lancamento}', 
    duracao =           '${filme.duracao}', 
    orcamento =         '${filme.orcamento}', 
    trailer =           '${filme.trailer}', 
    capa =              '${filme.capa}'
    
    where id = ${filme.id}`

    let result = await prisma.$executeRawUnsafe(sql)

    if(result)
      return true
    else
      return false

  } catch (error) {
    //console.log(error)
    return false
  }

};

//Exclui um filme pelo id no Banco de Dados
const setDeleteMovies = async function (id) {
  try {
    let sql = `DELETE from tbl_filme where id = ${id}`

    let result = await prisma.$executeRawUnsafe(sql)

    if(result)
      return true
    else
      return false
  } catch (error) {
    return false
  }
};

module.exports = {
  getSelectAllMovies,
  getSelectByIdMovies,
  getSelectLastId,
  setInsertMovies,
  setUpdateMovies,
  setDeleteMovies
};
