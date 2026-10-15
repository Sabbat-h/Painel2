class Cliente {
    // Atributos privados garantem o encapsulamento dos dados
    #nome;
    #altura;
    #peso;

    constructor(nome, altura, peso) {
        this.#nome = nome;
        this.#altura = altura;
        this.#peso = peso;
    }

    // Getters para permitir a leitura controlada dos dados privados
    get nome() { return this.#nome; }
    get altura() { return this.#altura; }
    get peso() { return this.#peso; }

    // Regra de negócio isolada na classe de modelo
    calcularIMC() {
        return this.#peso / (this.#altura * this.#altura);
    }

    definirClassificacao() {
        const imc = this.calcularIMC();
        
        switch (true) {
            case (imc < 18.5):
                return "Abaixo do peso";
            case (imc >= 18.5 && imc < 25):
                return "Peso Normal";
            case (imc >= 25 && imc < 30):
                return "Sobrepeso";
            case (imc >= 30):
                return "Obesidade";
            default:
                return "Valor Inválido";
        }
    }
}

class PainelApp {
    constructor() {
        // Estrutura de dados para armazenar as instâncias de Cliente na memória
        this.clientes = [];

        // Captura dos elementos do DOM
        this.formulario = document.getElementById('form-paciente');
        this.corpoTabela = document.getElementById('tabela-resultados');

        // Inicialização dos escutadores de eventos
        this.registrarEventos();
    }

    registrarEventos() {
        // O bind(this) é necessário para que o 'this' dentro de adicionarPaciente
        // continue se referindo à classe PainelApp, e não ao elemento <form> que disparou o evento
        this.formulario.addEventListener('submit', this.adicionarPaciente.bind(this));
    }

    adicionarPaciente(event) {
        // Impede o comportamento padrão de recarregar a página ao enviar o formulário
        event.preventDefault();

        // Captura e conversão dos valores digitados pelo usuário
        const nomeInput = document.getElementById('nome').value;
        const alturaInput = parseFloat(document.getElementById('altura').value);
        const pesoInput = parseFloat(document.getElementById('peso').value);

        // Instanciação de um novo objeto da classe Cliente
        const novoCliente = new Cliente(nomeInput, alturaInput, pesoInput);

        // Adição do objeto ao array e atualização da interface
        this.clientes.push(novoCliente);
        this.atualizarTabela();

        // Limpeza do formulário para o próximo cadastro
        this.formulario.reset();
        document.getElementById('nome').focus();
    }

    atualizarTabela() {
        // Limpa as linhas antigas para evitar duplicação na renderização
        this.corpoTabela.innerHTML = '';

        // Iteração moderna utilizando forEach
        this.clientes.forEach(cliente => {
            const tr = document.createElement('tr');

            // Template Literals para injeção dinâmica dos dados encapsulados e calculados
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.altura.toFixed(2)}</td>
                <td>${cliente.peso.toFixed(1)}</td>
                <td>${cliente.calcularIMC().toFixed(2)}</td>
                <td>${cliente.definirClassificacao()}</td>
            `;

            this.corpoTabela.appendChild(tr);
        });
    }
}

// Garante que o aplicativo só seja iniciado após todo o HTML ser carregado
document.addEventListener('DOMContentLoaded', () => {
    new PainelApp();
});