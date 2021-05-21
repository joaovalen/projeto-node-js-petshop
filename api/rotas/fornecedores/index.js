const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

// como vamos nos comunicar com o banco, um serviço externo, é melhor usar promessas passando o async
// Rota para Listar Fornecedores
// GET
roteador.get('/', async (req,res) => {
    const resultados = await TabelaFornecedor.listar()
    res.send(
        JSON.stringify(resultados)
    )
})

// Rota para criar fornecedor
// POST
roteador.post('/', async (req, res) => {
    const receivedData = req.body
    const fornecedor = new Fornecedor(receivedData)
    await fornecedor.criar()
    res.send(
        JSON.stringify(fornecedor)
    )
})

// Busca por ID
roteador.get('/:idFornecedor', async (req,res) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id})
        await fornecedor.carregar()
        res.send(JSON.stringify(fornecedor))
    } catch (erro) {
        res.send(JSON.stringify({mensagem: erro.message}))
    }
})

roteador.put('/:idFornecedor', async (req, res) => {
    try {
        const id = req.params.idFornecedor
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, { id: id})
        // função do js para juntar objetos
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.end()
    } catch (erro) {
        res.send(
            JSON.stringify({
                mensagem: erro.message
            })
        )
    }
})

module.exports = roteador

// Roteador de fornecedores