// o index é o arquivo de rotas, nesse caso dos produtos
const roteador = require('express').Router({mergeParams: true})
// merge params para ter acesso a variáveis do escopo acima
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

// OPTIONS indica o que o usuário pode fazer estando nessa rota (GET, POST, ETC...) 
// Serve para quando recebemos solicitações de sites externos e etc
roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

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

        // Enriquecendo nossa resposta com mais informações 
        // Versão do documento
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)

        res.status(201)
        res.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro)
    }
    
})

// OPTIONS
roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'DELETE', 'GET', 'HEAD', 'PUT')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
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

        // Enriquecendo nossa resposta com mais informações 
        // Versão do documento
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)

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
    
        await produto.carregar()
        // Enriquecendo nossa resposta com mais informações 
        // Versão do documento
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)

        res.status(204)
        res.end()
    } catch (erro) {
        next(erro)
    }
    
})

roteador.head('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()

        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(200)
        res.end()

    } catch (erro) {
        next(erro)
    }
})

// OPTIONS
roteador.options('/:ID/sell', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
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

        // carregando pra pegar os dados atualizados para a resposta
        await produto.carregar()
        // Enriquecendo nossa resposta com mais informações 
        // Versão do documento
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)

        res.status(204)
        res.end()
    } catch (erro) {
        next(erro)
    }
})

module.exports = roteador