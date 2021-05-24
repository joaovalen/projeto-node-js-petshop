const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

// como vamos nos comunicar com o banco, um serviço externo, é melhor usar promessas passando o async
// Rota para Listar Fornecedores
// GET
roteador.get('/', async (req,res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    res.send(
        JSON.stringify(resultados)
    )
})

// Rota para criar fornecedor
// POST
// DUVIDA COMO QUE O MEADER FUNCIONA COM ESSE PROXIMO?
roteador.post('/', async (req, res, proximo) => {
    try {
        const receivedData = req.body
        const fornecedor = new Fornecedor(receivedData)
        await fornecedor.criar()
        res.status(201)
        res.send(JSON.stringify(fornecedor))
    } catch (erro) {
        // DUVIDA DE ONDE VEM A VARIÁVEL ERRO? É A QUE JOGAMOS NO THROW?
        proximo(erro)
    }
})

// Busca por ID
roteador.get('/:idFornecedor', async (req,res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id})
        await fornecedor.carregar()
        res.status(200)
        res.send(JSON.stringify(fornecedor))
    } catch (erro) {
        proximo(erro)
    }
})

// PUT
// DUVIDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// Toda função que gera a resposta da requisição também recebe um terceiro parâmetro, o 
// próximo meader que vai ser executado
roteador.put('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, { id: id})
        // função do js para juntar objetos
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204)
        // Sucesso mas não vamos dar nenhum conteúdo pro usuário
        res.end()
        // Tratando 2 erros diferentes em uma mesma requisição =>
    } catch (erro) {
        proximo(erro)
    }
})

// DELETE
roteador.delete('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({id: id})
        // Verificando se existe um fornecedor com esse id 
        await fornecedor.carregar()
        await fornecedor.remover()
        res.status(204)
        res.end()
    } catch (erro) {
        proximo(erro)
    }
})

module.exports = roteador

// Roteador de fornecedores