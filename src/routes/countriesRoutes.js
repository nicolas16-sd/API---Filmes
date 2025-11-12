/******************************************************
 * Autor: Nicolas dos Santos Durão
 * Objetivo: Arquivo responsável pelas rotas de Países
 * Data: 03/11/2025
 * Versão: 1.0
 ******************************************************/

const express = require('express')
const router = express.Router()

const controller_pais = require('../controller/pais/controller_pais.js')

router.get('/', async(req, res) => {
    let pais = await controller_pais.listarPaises()
    res.status(pais.status_code).json(pais)
})

router.get('/:id', async(req, res) => {
    let pais = await controller_pais.buscarPaisId(req.params.id)
    res.status(pais.status_code).json(pais)
})

router.post('/', async(req, res) => {
    let pais = await controller_pais.inserirPais(req.body, req.headers['content-type'])
    res.status(pais.status_code).json(pais)
})

router.put('/:id', async(req, res) => {
    let pais = await controller_pais.atualizarPais(req.body, req.params.id, req.headers['content-type'])
    res.status(pais.status_code).json(pais)
})

router.delete('/:id', async(req, res) => {
    let pais = await controller_pais.excluirPais(req.params.id, req.headers['content-type'])
    res.status(pais.status_code).json(pais)
})

module.exports = router