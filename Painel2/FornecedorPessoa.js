//importar fornecedor
import Fornecedor from './Fornecedor.js'

//criando a classe
class FornecedorPessoa extends Fornecedor{

    construtor(nome = "Sem nome", fone = "(00)0000-0000", rg = " ", cpf = " "){
        super(nome, fonte);
        this.#rg = rg;
        this.#cpf = cpf;
    }
}