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

const moviesRoutes = require('./src/routes/moviesRoutes.js')
const genresRoutes = require('./src/routes/genresRoutes.js')
const countriesRoutes = require('./src/routes/countriesRoutes.js')
const platformRoutes = require('./src/routes/platformRoutes.js')
const classificationRoutes = require('./src/routes/classificationsRoutes.js')


const PORT = process.env.PORT || 8080

const app = express()
app.use(bodyParserJSON)

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*') 
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') 

    app.use(cors())
    next()
})

app.listen(PORT, function(){
    console.log('API aguardando requisições!')
})

app.use('/v1/locadora/filme', moviesRoutes)
app.use('/v1/locadora/genero', genresRoutes)
app.use('/v1/locadora/pais', countriesRoutes)
app.use('/v1/locadora/plataforma', platformRoutes)
app.use('/v1/locadora/classificacao', classificationRoutes)