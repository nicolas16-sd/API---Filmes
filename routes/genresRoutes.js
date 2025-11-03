/******************************************************
 * Autor: Nicolas dos Santos Durão
 * Objetivo: Arquivo responsável pelas rotas de Gêneros
 * Data: 03/11/2025
 * Versão: 1.0
 ******************************************************/

const express = require('express')
const router = express.Router()

const controller_genero = require('../controller/genero/controller_genero.js')

router.get('/', async (req, res) => {
    let genero = await controller_genero.listarGeneros()
    res.status(genero.status_code).json(genero)
})

router.get('/:id', async(req, res) => {
    let genero = await controller_genero.buscarGeneroId(req.params.id)
    res.status(genero.status_code).json(genero)
})

router.post('/', async(req, res) => {
    let genero = await controller_genero.inserirNovoGenero(req.body, req.headers['content-type'])
    res.status(genero.status_code).json(genero)
})

router.put('/:id', async(req, res) => {
    let genero = await controller_genero.atualizarGenero(req.body, req.params.id, req.headers['content-type'])
    res.status(genero.status_code).json(genero)
})

router.delete('/:id', async(req, res) => {
    let genero = await controller_genero.excluirGenero(req.params.id, req.headers['content-type'])
    res.status(genero.status_code).json(genero)
})

module.exports = router