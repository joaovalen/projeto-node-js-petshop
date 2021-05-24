const Modelo = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')
// Setando um erro
// cada .. sobe um nível, primeiro para a pasta api, depois para a principal

module.exports = {
    // retornando os dados do banco de dados da nossa api
    listar () {
        return Modelo.findAll({raw: true}) // método do sequelize para listar
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
            throw new NaoEncontrado()
            // lançando o erro "Não encontrado" que será capturado no catch do index caso ocorra 
            // fazemos isso quando temos mais de um tipo de erro possível em uma execução 
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