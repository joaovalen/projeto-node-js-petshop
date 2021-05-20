const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')

// como vamos nos comunicar com o banco, um serviço externo, é melhor usar promessas passando o async
roteador.use('/', async (req,res) => {
    const resultados = await TabelaFornecedor.listar()
    res.send(
        JSON.stringify(resultados)
    )
})

module.exports = roteador

// Roteador de fornecedores