const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInválido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

app.use(bodyParser.json())

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

// Criando um Meader para centralizar o tratamento de erros da nossa API
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

    res.status(status)

    res.send(
        JSON.stringify({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

// pegamos os dados atraves do arquivo config/default.json
app.listen(config.get('api.porta'), () => console.log('a Api está funcionando'))

// Módulos necessários
// npm install express body-parser sequelize mysql2 config 