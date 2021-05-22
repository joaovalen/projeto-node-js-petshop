const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')

app.use(bodyParser.json())

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

// Criando um Meader para centralizar o tratamento de erros da nossa API
app.use((erro, req, res, proximo) => {
    if (erro instanceof NaoEncontrado) {
        res.status(404)
        // Caso não encontrado
    } else {
        res.status(400)
        // Caso bad request
    }
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