const Modelo = require('./ModeloTabelaFornecedor')

module.exports = {
    // retornando os dados do banco de dados da nossa api
    listar () {
        return Modelo.findAll() // método do sequelize para listar
    },

    inserir (fornecedor) {
        return Modelo.create(fornecedor)
    },

    async idSearch (id) {
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        })

        if (!encontrado) {
            throw new Error('Fornecedor não encontrado')
        }

        return encontrado
    },

    atualizar (id, dadosParaAtualizar) {
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: { id: id }
            }
        )
    },
    // primeiro parametro são os dados para atualizar e o segundo um objeto com as instruções para encontrar a linha da tabela

    remover (id) {
        return Modelo.destroy({
            where: {id: id}
        })
    }
}