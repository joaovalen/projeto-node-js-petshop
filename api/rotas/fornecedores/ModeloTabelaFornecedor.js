const Sequelize = require('sequelize')
const instancia = require('../../database')
// Pegando a instancia setada na database

// cada chave do objeto é o nome de uma coluna 
const colunas = {
    empresa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.ENUM('ração','brinquedos'),
        // ENUM numera o que a gente pode aceitar nesse campo
        allowNull: false
    }
}

const opcoes = {
    freezeTableName: true,
    // congela o nome da tablea
    tableName: 'fornecedores',
    timestamps: true,
    // Sequelize fornece colunas de data com o timestamps
    
    // alterando para portugues
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instancia.define('fornecedores', colunas, opcoes)
// instancia.define(nome da tabela, colunas, opcoes)