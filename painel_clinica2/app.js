//Criando as classes de acordo com o diagrama 
//de Diagrama de classe - Dominio
class Cliente {
    //criando atributos
    #nome;
    #altura;
    #peso;
    
    //método construtor padrão
    construtor(nome, peso, altura){
        //atributo = conteúdo do parâmetro
        this.#nome = nome;
        this.#peso = number(peso);
        this.#altura = number(altura);
    }

    //métodos Getters: provedor de acesso somente para leitura
    getNome(){
        return this.#nome;
    }
    getAltura(){
        return this.#altura;
    }
    getPeso(){
        return this.#peso;
    }

    //regra de negócio: Calcular o indice de massa corporal IMC
    //fórmula -> peso/(altura*altura)
    //.toFixed(2)
    calcularIMC(){
        const imc = this.#peso/(this.#altura*this.#altura);
        return Number(imc.toFixed(2));
    }

    //criar o método definirClassificacao()
    definirClassificacao(){
        const imc = this.calcularIMC();

    switch (true){
        case (imc < 18.5):
            return 'Abaixo do peso';
        case (imc >= 25.0 && imc <= 29.9):
            return 'Peso normal';
        case (imc >=30.0 && imc>=34.9):
            return 'Obesidade grau I';
        case (imc >= 35.0 && imc <= 39.9):
            return 'Obesidade grau II';
        default:
            return 'Obesidade grau III'; //qualquer valor acima de 40


    }
    }
    
}

//criando a classe PainelApp
//responsabilidade: trabalhar / orquestrar a interface gráfica (GUI),
//Gerenciar a lista de clientes da memória, coordenar as entradas 

//criar classe 
class PainelApp{

    //criando as propriedades/atributos privados de
    //estado e DOM
    #clientes =[]; //array que armazena as instâncias 
    #form;         //refência ao elemento <form>
    #tabelaCorpo;  //refêrencia o elemento <tbody> da tabela 
    
    // //criando o método construtor
construtor(){
    this.#form = document.getElementById('form-paciente');
    this.#tabelaCorpo = document.getElementById('tabela-pacientes-corpo');
}

}
