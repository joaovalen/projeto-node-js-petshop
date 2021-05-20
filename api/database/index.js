const Sequelize = require('sequelize')
const config = require('config')

// Nossa instancia de conexão com o banco, os dados vem através do config/default.json
const instancia = new Sequelize(
    config.get('mysql.database'),
    config.get('mysql.usuario'),
    config.get('mysql.senha'),
    {
        host: config.get('mysql.host'),
        dialect: 'mysql'
    }
)

module.exports = instancia

// o npm install config é usado aqui para poder acessar esses dados secretos como senha de outro arquivo