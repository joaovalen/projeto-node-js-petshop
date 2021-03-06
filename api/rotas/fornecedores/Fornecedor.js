const TabelaFornecedor = require('./TabelaFornecedor')
const CampoInvalido = require('../../erros/CampoInválido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')

class Fornecedor {
    constructor ({ id, empresa, email, categoria, dataCriacao, dataAtualizacao}) {
        this.id = id
        this.empresa = empresa
        this.email = email
        this.categoria = categoria
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
    }

    async criar () {
        this.validar()
        const resultado = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    // Busca por ID
    async carregar () {
        const fornecedorEncontrado = await TabelaFornecedor.idSearch(this.id)
        this.empresa = fornecedorEncontrado.empresa
        this.email = fornecedorEncontrado.email
        this.categoria = fornecedorEncontrado.categoria
        this.dataCriacao = fornecedorEncontrado.dataCriacao
        this.dataAtualizacao = fornecedorEncontrado.dataAtualizacao
        this.versao = fornecedorEncontrado.versao
    }

    async atualizar () {
        await TabelaFornecedor.idSearch(this.id)
        // checando se existe
        const campos = ['empresa','email','categoria']
        // criando uma lista com os campos que vamos alterar 
        // agora precisamos verificar se foram fornecidos e se estão válidos
        const dadosParaAtualizar = {}

        campos.forEach((campo) => {
            const valor = this[campo]
            if (typeof valor === 'string' && valor.length > 0){
                dadosParaAtualizar[campo] = valor
            }
        })

        if (Object.keys(dadosParaAtualizar).length === 0){
            throw new DadosNaoFornecidos()
        }
        // função que retorna lista com nome das chaves que o objeto possui
        // então com o .length podemos ver a quantidade de items da lista e se está vazia

        await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar)
    }

    remover () {
        return TabelaFornecedor.remover(this.id)
    }

    // validando campos que recebemos do usuário para o post
    validar () {
        const campos = ['empresa','email','categoria']

        campos.forEach(campo => {
            const valor = this[campo]

            // || OU
            if (typeof valor !== 'string' || valor.lenght === 0) {
                // Aqui usamos nossa classe de erro para tratamento
                throw new CampoInvalido(campo)
            }
        })
    }

}

module.exports = Fornecedor