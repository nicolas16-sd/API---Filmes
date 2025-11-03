/******************************************************
 * Autor: Nicolas dos Santos Durão
 * Objetivo: Arquivo responsável pelas rotas de Filmes
 * Data: 03/11/2025
 * Versão: 1.0
 *******************************************************/

const express = require('express')
const router = express.Router()

const controller_filme = require('../controller/filme/controller_filme.js')

router.get('/', async (req, res) => {
    let filme = await controller_filme.listarFilmes()
    res.status(filme.status_code).json(filme)
  })
  
  router.get('/:id', async (req, res) => {
    let filme = await controller_filme.buscarFilmeId(req.params.id)
    res.status(filme.status_code).json(filme)
  })
  
  router.post('/', async (req, res) => {
    let filme = await controller_filme.inserirFilme(req.body, req.headers['content-type'])
    res.status(filme.status_code).json(filme)
  })
  
  router.put('/:id', async (req, res) => {
    let filme = await controller_filme.atualizarFilme(req.body, req.params.id, req.headers['content-type'])
    res.status(filme.status_code).json(filme)
  })
  
  router.delete('/:id', async (req, res) => {
    let filme = await controller_filme.excluirFilme(req.params.id, req.headers['content-type'])
    res.status(filme.status_code).json(filme)
  })
  

module.exports = router