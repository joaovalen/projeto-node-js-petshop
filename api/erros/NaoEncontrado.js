class NaoEncontrado extends Error {
    constructor(nome) {
        super(`${nome} não foi encontrado`)
        this.name = 'NaoEncontrado'
        this.idErro = 0
        // super chama o construtor da classe Error
    }
}
//Error é nativa do js

module.exports = NaoEncontrado