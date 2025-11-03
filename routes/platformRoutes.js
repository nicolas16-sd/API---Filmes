/******************************************************
 * Autor: Nicolas dos Santos Durão
 * Objetivo: Arquivo responsável pelas rotas de Plataformas
 * Data: 03/11/2025
 * Versão: 1.0
 *******************************************************/

const express = require('express')
const router = express.Router()

const controller_plataforma = require('../controller/plataforma/controller_plataforma.js')

// Retorna todas as plataformas
router.get('/', async (req, res) => {
    let plataforma = await controller_plataforma.listarPlataformas()
    res.status(plataforma.status_code).json(plataforma)
})

// Retorna plataforma pelo ID
router.get('/:id', async (req, res) => {
    let plataforma = await controller_plataforma.buscarPlataformaId(req.params.id)
    res.status(plataforma.status_code).json(plataforma)
})

// Insere uma nova plataforma
router.post('/', async (req, res) => {
    let plataforma = await controller_plataforma.inserirNovaPlataforma(req.body, req.headers['content-type'])
    res.status(plataforma.status_code).json(plataforma)
})

// Atualiza uma plataforma existente
router.put('/:id', async (req, res) => {
    let plataforma = await controller_plataforma.atualizarPlataforma(req.body, req.params.id, req.headers['content-type'])
    res.status(plataforma.status_code).json(plataforma)
})

// Exclui uma plataforma pelo ID
router.delete('/:id', async (req, res) => {
    let plataforma = await controller_plataforma.excluirPlataforma(req.params.id, req.headers['content-type'])
    res.status(plataforma.status_code).json(plataforma)
})

module.exports = router
