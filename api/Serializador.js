const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const jsontoxml = require('jsontoxml')

class Serializador {
    json (dados) {
        return JSON.stringify(dados)
    }

    xml (dados) {
        let tag = this.tagSingular

        // Checking if is a get request with multiple anwsers
        if (Array.isArray(dados)){
            tag = this.tagPlural
            dados = dados.map((item) => {
                return {
                    [this.tagSingular]: item
                }
            })
        }

        // XML é tipo HTML então precisa de uma tag para agrupar os dados 
        // <fornecedor>
        //     <id>6</id>
        //     <empresa>rações do seu zé</empresa>
        //     <categoria>ração</categoria>
        // </fornecedor>
        return jsontoxml({ [tag] : dados})
    }
    // npm install jsontoxml
    
    serializar (dados) {
        dados = this.filtrar(dados)

        if (this.contentType === 'application/json') {
            return this.json(dados)
        }

        if (this.contentType === 'application/xml') {
            return this.xml(dados)
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
            'categoria'
        ].concat(camposExtras || [])
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializadorProduto extends Serializador {
    constructor (contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'titulo'
        ].concat(camposExtras || [])
        this.tagSingular = 'produto'
        this.tagPlural = 'produtos'
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
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

module.exports = {
    Serializador: Serializador, 
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    SerializadorProduto: SerializadorProduto,
    // lista com os formatos aceitos
    formatosAceitos: ['application/json', 'application/xml']
}