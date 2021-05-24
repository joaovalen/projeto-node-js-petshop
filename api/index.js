// Módulos necessários
// npm install express body-parser sequelize mysql2 config 

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInválido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

app.use(bodyParser.json())

// Middleware
app.use((req, res, proximo) => {
    let formatoRequisitado = req.header('Accept')

    if (formatoRequisitado === '*/*'){
        formatoRequisitado = 'application/json'
    }

    // testando se aceitamos o formato
    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406)
        res.end()
        return 
    }

    res.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

// Criando um MiddleWare para centralizar o tratamento de erros da nossa API
// COMO ISSO FUNCIONA COMO QUE VEM PARAR AQUI?
app.use((erro, req, res, proximo) => {
    let status = 500

    if (erro instanceof NaoEncontrado) {
        status = 404
        // Caso não encontrado
    } 

    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }

    if (erro instanceof ValorNaoSuportado) {
        status = 406
    }

    const serializador = new SerializadorErro(
        res.getHeader('Content-Type')
    )

    res.status(status)
    res.send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

app.listen(config.get('api.porta'), () => console.log('a Api está funcionando'))

