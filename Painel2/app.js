
class Cliente {
    // Atributos privados
    #nome;
    #altura;
    #peso;

    constructor(nome, altura, peso) {
        this.#nome = nome;
        this.#altura = altura;
        this.#peso = peso;
    }

    // Getters
    get nome() {
        return this.#nome;
    }

    get altura() {
        return this.#altura;
    }

    get peso() {
        return this.#peso;
    }

    // Calcula o IMC
    calcularIMC() {
        return this.#peso / (this.#altura * this.#altura);
    }

    // Define a classificação de saúde
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


class ManipuladorDOM {
    constructor() {
        // Captura os elementos do HTML
        this.formulario = document.getElementById("form-paciente");
        this.corpoTabela = document.getElementById("tabela-resultados");

        this.nomeInput = document.getElementById("nome");
        this.alturaInput = document.getElementById("altura");
        this.pesoInput = document.getElementById("peso");
    }

    // Captura os dados digitados no formulário
    capturarDados() {
        const nome = this.nomeInput.value.trim();
        const altura = parseFloat(this.alturaInput.value);
        const peso = parseFloat(this.pesoInput.value);

        return { nome, altura, peso };
    }

    // Valida os dados do paciente
    validarDados(nome, altura, peso) {
        if (
            nome === "" ||
            !Number.isFinite(altura) ||
            !Number.isFinite(peso) ||
            altura <= 0 ||
            peso <= 0
        ) {
            alert("Preencha todos os campos com valores válidos!");
            return false;
        }

        return true;
    }

    // Limpa as linhas da tabela
    limparTabela() {
        this.corpoTabela.innerHTML = "";
    }

    // Adiciona um paciente à tabela
    adicionarLinha(cliente) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;

        // Insere os dados nas células
        tr.cells[0].textContent = cliente.nome;
        tr.cells[1].textContent = cliente.altura.toFixed(2);
        tr.cells[2].textContent = cliente.peso.toFixed(1);
        tr.cells[3].textContent = cliente.calcularIMC().toFixed(2);
        tr.cells[4].textContent = cliente.definirClassificacao();

        this.corpoTabela.appendChild(tr);
    }

    // Limpa o formulário após o cadastro
    limparFormulario() {
        this.formulario.reset();
        this.nomeInput.focus();
    }
}


class PainelApp {
    constructor() {
        // Array que armazena os objetos Cliente
        this.clientes = [];

        // Instancia o manipulador do DOM
        this.dom = new ManipuladorDOM();

        // Registra os eventos
        this.registrarEventos();
    }

    // Registra o evento de envio do formulário
    registrarEventos() {
        this.dom.formulario.addEventListener(
            "submit",
            this.adicionarPaciente.bind(this)
        );
    }

    // Cadastra um novo paciente
    adicionarPaciente(event) {
        // Impede o recarregamento da página
        event.preventDefault();

        // Captura os dados do formulário
        const dados = this.dom.capturarDados();

        // Verifica se os dados são válidos
        if (
            !this.dom.validarDados(
                dados.nome,
                dados.altura,
                dados.peso
            )
        ) {
            return;
        }

        // Cria um novo objeto Cliente
        const novoCliente = new Cliente(
            dados.nome,
            dados.altura,
            dados.peso
        );

        // Armazena o objeto no array
        this.clientes.push(novoCliente);

        // Atualiza a tabela
        this.atualizarTabela();

        // Limpa o formulário
        this.dom.limparFormulario();
    }

    // Atualiza o relatório de pacientes
    atualizarTabela() {
        this.dom.limparTabela();

        this.clientes.forEach(cliente => {
            this.dom.adicionarLinha(cliente);
        });
    }
}


// Inicia a aplicação após o carregamento do HTML
document.addEventListener("DOMContentLoaded", () => {
    new PainelApp();
});
