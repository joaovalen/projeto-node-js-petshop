const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')

app.use(bodyParser.json())

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

// pegamos os dados atraves do arquivo config/default.json
app.listen(config.get('api.porta'), () => console.log('a Api está funcionando'))

// Módulos necessários
// npm install express body-parser sequelize mysql2 config 