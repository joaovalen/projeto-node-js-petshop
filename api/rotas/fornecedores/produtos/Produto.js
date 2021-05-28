const TabelaProduto = require('./TabelaProduto')
const Tabela = require('./TabelaProduto')
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos')
const CampoInvalido = require('../../../erros/CampoInválido')

class Produto {
    constructor ({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao}) {
        this.id = id,
        this.titulo = titulo,
        this.preco = preco,
        this.estoque = estoque,
        this.fornecedor = fornecedor,
        this.dataCriacao = dataCriacao,
        this.dataAtualizacao = dataAtualizacao,
        this.versao = versao
    }

    validar () {
        if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
            throw new CampoInvalido('titulo')
        }
        if (typeof this.preco !== 'number' || this.preco <= 0){
            throw new CampoInvalido('preco')
        }
    }

    async criar () {
        this.validar()
        const resultado = await Tabela.inserir({
             titulo: this.titulo,
             preco: this.preco,
             estoque: this.estoque, 
             fornecedor: this.fornecedor
        })

        this.id = resultado.id 
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    apagar () {
        return Tabela.remover(this.id, this.fornecedor)
    }

    async carregar () {
        const produto = await Tabela.idSearch(this.id, this.fornecedor)
        this.titulo = produto.titulo
        this.preco = produto.preco
        this.estoque = produto.estoque
        this.dataCriacao = produto.dataCriacao
        this.dataAtualizacao = produto.dataAtualizacao
        this.versao = produto.versao 
    }

    async atualizar () {
        const dadosParaAtualizar = {}

        if (typeof this.titulo === 'string' && this.titulo.length > 0){
            dadosParaAtualizar.titulo = this.titulo
        }

        if (typeof this.preco === 'number' && this.preco > 0){
            dadosParaAtualizar.preco = this.preco
        }

        if (typeof this.estoque === 'number' && this.preco >= 0){
            dadosParaAtualizar.estoque = this.estoque
        }

        if (Object.keys(dadosParaAtualizar).length === 0){
            throw new DadosNaoFornecidos()
        }
        // função que retorna lista com nome das chaves que o objeto possui
        // então com o .length podemos ver a quantidade de items da lista e se está vazia

        return Tabela.atualizar(
            {
                id: this.id,
                fornecedor: this.fornecedor
            },
            dadosParaAtualizar
        )   
    }

    sell () {
        return Tabela.subtrair(
            this.id,
            this.fornecedor,
            'estoque',
            this.estoque
        )
    }
}

module.exports = Produto