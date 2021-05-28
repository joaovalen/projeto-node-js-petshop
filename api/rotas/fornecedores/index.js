// rotas dos fornecedores
const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

// OPTIONS
roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

// como vamos nos comunicar com o banco, um serviço externo, é melhor usar promessas passando o async
// Rota para Listar Fornecedores
// GET
roteador.get('/', async (req,res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type'), ('empresa')
    )
    res.send(
        serializador.serializar(resultados)
    )
})

// Rota para criar fornecedor
// POST
// DUVIDA COMO QUE O Middleware FUNCIONA COM ESSE PROXIMO?
roteador.post('/', async (req, res, proximo) => {
    try {
        const receivedData = req.body
        const fornecedor = new Fornecedor(receivedData)
        await fornecedor.criar()
        res.status(201)
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'), ('empresa')
        )
        res.send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        // DUVIDA DE ONDE VEM A VARIÁVEL ERRO? É A QUE JOGAMOS NO THROW?
        proximo(erro)
    }
})

roteador.options('/:idFornecedor', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET', 'PUT', 'DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

// Busca por ID
roteador.get('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id})
        await fornecedor.carregar()
        res.status(200)
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            // Pedindo os campos extras (sensitive info)
            ['email','empresa','dataCriacao','dataAtualizacao','versao']
        )
        res.send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})

// PUT
// DUVIDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// Toda função que gera a resposta da requisição também recebe um terceiro parâmetro, o 
// próximo middleware que vai ser executado
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

// Rota de produtosm
const roteadorProdutos = require('./produtos')

const verificarFornecedor = async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id})
        await fornecedor.carregar()
        req.fornecedor = fornecedor
        next()
    } catch (erro) {
        next(erro)
    }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)
// joga lá pro index de produtos e então pega as rotas get post etc de lá 

module.exports = roteador

// Roteador de fornecedores