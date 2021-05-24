const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

class Serializador {
    json (dados) {
        return JSON.stringify(dados)
    }

    serializar (dados) {
        if (this.contentType === 'application/json') {
            return this.json(
                this.filtrar(dados)
            )
        }

        throw new ValorNaoSuportado(this.contentType)        
    }

    filtrarObjeto (dados) {
        const novoObjeto = {}

        // Separando os 3 dados públicos
        this.camposPublicos.forEach((campo) => {
            if (dados.hasOwnProperty(campo)) {
                novoObjeto[campo] = dados[campo]
            }
        })

        return novoObjeto 
    }

    filtrar (dados) {
        if (Array.isArray(dados)) {
            // Caso os dados sejam uma lista passamos o filtrar objeto em cada item
            // Passando o filtrarObjeto por cada item da nossa lista
            dados = dados.map(item => {
                return this.filtrarObjeto(item)
            })
        } else {
            dados = this.filtrarObjeto(dados)
        }

        return dados
    }
}

// Tentative method
class SerializadorFornecedor extends Serializador {
    constructor (contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'empresa',
            'categoria'
        ].concat(camposExtras || [])
    }
}

class SerializadorErro extends Serializador {
    constructor (contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'mensagem'
        ].concat(camposExtras || [])
    }
}

module.exports = {
    Serializador: Serializador, 
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    // lista com os formatos aceitos
    formatosAceitos: ['application/json']
}