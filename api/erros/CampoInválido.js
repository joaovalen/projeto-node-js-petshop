class CampoInvalido extends Error {
    // extendendo o erro base do js 
    constructor (campo) {
        // recebemos o campo inválido para o construtor
        const mensagem = `O campo '${campo}' está inválido ou vazio`
        super(mensagem)
        this.name = 'CampoInvalido'
        this.idErro = 1
    }
}

module.exports = CampoInvalido