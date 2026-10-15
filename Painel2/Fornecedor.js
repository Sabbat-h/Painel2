//criando a classe fornecedor
class Fornecedor {

    //criando os atributos
    #nome;
    #fone;


    //criando construtor
construtor(){
    this.#nome="Sem nome";
    this.#fone = "(00)0000-0000";
}

construtor(nome, fone){
    this.#nome = nome;
    this.#fone = fone;
}

//criando os metodos setters
setNome(nome){
    this.#nome = nome;

}

setFone(fone){
    this.#fone = fone;

}

//criando os metodos getters
getNome(){
    return this.#nome;
}

getFone(){
    return this.#fone;
}

export default Fornecedor;
}