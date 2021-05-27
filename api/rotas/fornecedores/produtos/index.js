// o index é o arquivo de rotas, nesse caso dos produtos
const roteador = require('express').Router({mergeParams: true})
// merge params para ter acesso a variáveis do escopo acima
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

// GET FULL 
roteador.get('/', async (req, res) => {
    const produtos = await Tabela.listar(req.fornecedor.id)
    const serializador = new Serializador(
        res.getHeader('Content-Type')
    )
    // podemos acessar fornecedor direto pois enviamos na requisição do index das rotas anterior
    res.send(
        serializador.serializar(produtos)
    )
})

// POST
roteador.post('/', async (req, res, proximo) => {
    try {
        const idFornecedor = req.fornecedor.id
        const corpo = req.body
        // juntando essas duas variáveis em uma só para mandar para o constructor do Produto  
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor})
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new Serializador(
            res.getHeader('Content-Type')
        )
        res.status(201)
        res.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
    
})

// DELETE
roteador.delete('/:id', async (req,res) => {
    const dados = {
        id: req.params.id,
        fornecedor: req.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.apagar()
    res.status(204)
    res.end()
})

// GET ID
roteador.get('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
        // instanciando o serializador
        const serializador = new Serializador(
            res.getHeader('Content-Type'),
            // queremos todos os dados não só id e título (isso é enviado no parametro campoExtra)
            ['preco','estoque','fornecedor','dataCriacao','dataAtualizacao','versao']
        )
        res.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        next(erro)
    }
})

// PUT
roteador.put('/:id', async (req, res, next) => {  
   try {
        const dados = Object.assign(
            {},
            req.body, 
            {
                id: req.params.id,
                fornecedor: req.fornecedor.id
            }
        )

        const produto = new Produto(dados)
        await produto.atualizar()
        res.status(204)
        res.end()
    } catch (erro) {
        next(erro)
    }
    
})

// SELL POST
roteador.post('/:id/sell', async (req, res, next) => {
    try {
        const produto = new Produto({
            id: req.params.id,
            fornecedor: req.fornecedor.id
        })

        await produto.carregar()
        produto.estoque = produto.estoque - req.body.quantidade
        await produto.sell()
        res.status(204)
        res.end()
    } catch (erro) {
        next(erro)
    }
})

module.exports = roteador