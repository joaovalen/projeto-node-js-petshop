const Modelo = require('./ModeloTabelaFornecedor')

module.exports = {
    // retornando os dados do banco de dados da nossa api
    listar() {
        return Modelo.findAll() // método do sequelize para listar
    }
}