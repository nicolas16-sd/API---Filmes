/***************************************************************************
 * Autor: Nicolas dos Santos Durõa
 * Objetivo: Arquivo responsável pelas rotas de Classificações Indicativas
 * Data: 12/11/2025
 ***************************************************************************/

const express = require('express')
const router = express.Router()
const controller_classificacao_indicativa = require('../../src/controller/classificacao_indicativa/controller_classificacao_indicativa.js')

router.get('/', async(req, res) => {
    let classificacao = await controller_classificacao_indicativa.listarClassificacoes()
    res.status(classificacao.status_code).json(classificacao)
})

router.get('/:id', async(req, res) => {
    let classificacao = await controller_classificacao_indicativa.buscarClassificacaoId(req.params.id)
    res.status(classificacao.status_code).json(classificacao)
})

router.post('/', async(req, res) =>  {
    let classificacao = await controller_classificacao_indicativa.inserirNovaClassificacao(req.body, req.headers['content-type'])
    res.status(classificacao.status_code).json(classificacao)
})

router.put('/:id', async(req, res) => {
    let classificacao = await controller_classificacao_indicativa.atualizarClassificacao(req.body, req.params.id, req.headers['content-type'])
    res.status(classificacao.status_code).json(classificacao)
})

router.delete('/:id', async(req, res) => {
    let classificacao = await controller_classificacao_indicativa.excluirClassificacao(req.params.id)
    res.status(classificacao.status_code).json(classificacao)
})

module.exports = router