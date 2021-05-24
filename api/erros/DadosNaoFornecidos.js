class DadosNaoFornecidos extends Error {
    constructor () {
        // super chama o construtor da classe erro
        super('Não foram fornecidos dados para atualizar')
        this.name = 'DadosNaoFornecidos'
        this.idErro = 2
    }    
}

module.exports = DadosNaoFornecidos