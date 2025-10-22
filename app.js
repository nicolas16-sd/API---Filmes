/******************************************************************************
 * Objetivo: Arquivo responsável peas requisições da API da locadora de filmes
 * Versão: 1.0
 * Data: 07/10/2025
 * Autor: Nicolas dos Santos Durão
 * ****************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Objeto especialista em receber conteúdos JSON (POST e PUT)
const bodyParserJSON = bodyParser.json()

const controllerFilme = require('./controller/filme/controller_filme.js')
const controllerGenero = require('./controller/genero/controller_genero.js')


const PORT = process.PORT || 8080

const app = express()

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*') 
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') 

    app.use(cors())
    next()
})

/* ENDPOINTS PARA A ROTA DE FILMES */
//Retorna a lista de todos os filmes
app.get('/v1/locadora/filme', cors(), async function(request, response) {
    //Chama a função para listar os filmes no Banco de Dados
    let filme = await controllerFilme.listarFilmes()
    response.status(filme.status_code)
    response.json(filme)
})

//Retorna o filme filtrando pelo id
app.get('/v1/locadora/filme/:id', cors(), async function(request, response){
    //Chama a função para listar os filmes no Banco de Dados
    let idFilme = request.params.id

    let filme = await controllerFilme.buscarFilmeId(idFilme)
    response.status(filme.status_code)
    response.json(filme)
})

app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function(request, response) {
    //Recebe os dados do Body da requisição (Se você utilizar o body-parser é obrigatório ter no endPoint)
    let dadosBody = request.body

    //Recebe o tipo de dados da requisição (JSON ou XML ou outros formatos)
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function(request, response) {
    //Recebe o Id do Filme
    let idFilme = request.params.id

    //Recebe os dados a serem atualizados
    let dadosBody = request.body

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.delete('/v1/locadora/filme/:id', cors(), async function(request, response) {
    let idFilme = request.params.id
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.excluirFilme(idFilme, contentType)
    response.status(filme.status_code)
    response.json(filme)
})

/* ENDPOINTS PARA AS ROTAS DE GÊNEROS */
//listarGeneros() -> Retorna a lista de todos os gêneros existentes na tabela
app.get('/v1/locadora/generos', cors(), async function (request, response) {
    let generos = await controllerGenero.listarGeneros()
    response.status(generos.status_code)
    response.json(generos)
})

//buscarGeneroId() -> Retorna um gênero baseado em seu Id
app.get('/v1/locadora/generos/:id', cors(), async function(request, response) {
    let idGenero = request.params.id
    let generos = await controllerGenero.buscarGeneroId(idGenero)

    response.status(generos.status_code)
    response.json(generos)
})

//inserirNovoGenero() -> Permite a inserção de um novo gênero
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function(request, response) {
})

app.listen(PORT, function(){
    console.log('API aguardando requisições!')
})