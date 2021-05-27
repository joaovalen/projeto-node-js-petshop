const Sequelize = require('sequelize')
const instancia = require('../../../database')

// Modelo para a tabela de produtos
const colunas = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fornecedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // relacionando com a tabela de fornecedores
        references: {
            model: require('../ModeloTabelaFornecedor'),
            key: 'id'
        }
    }
}

const opcoes = {
    freezeTableName: true,
    // congela o nome da tablea
    tableName: 'produtos',
    timestamps: true,
    // Sequelize fornece colunas de data com o timestamps
    
    // alterando para portugues e ativando campos
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instancia.define('produto', colunas, opcoes)