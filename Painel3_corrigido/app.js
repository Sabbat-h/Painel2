
"use strict";

// ======================================================
// ARQUIVO: app.js
// PROJETO: PAINEL DE SAÚDE DA CLÍNICA
//
// Este arquivo controla as principais funcionalidades:
// 1. Cadastro de pacientes.
// 2. Consulta de CEP utilizando a API ViaCEP.
// 3. Validação dos dados do formulário.
// 4. Armazenamento dos pacientes no navegador.
// 5. Exibição dos pacientes na tabela.
// 6. Exclusão individual ou de todos os pacientes.
// ======================================================


// ======================================================
// 1. CLASSE PRINCIPAL DO SISTEMA
// ======================================================

// A classe PainelApp organiza as funcionalidades
// e controla a interação entre HTML e JavaScript.

class PainelApp {

    // O constructor é executado automaticamente
    // quando um objeto PainelApp é criado.

    constructor() {

        // Busca os elementos do HTML pelos seus IDs.
        // Assim, o JavaScript consegue acessar e
        // modificar os elementos da página.

        // Formulário utilizado para cadastrar pacientes.
        this.formulario = document.getElementById("form-paciente");

        // Corpo da tabela onde os pacientes aparecem.
        this.corpoTabela = document.getElementById("tabela-resultados");

        // Campo para digitar o nome do paciente.
        this.nomeInput = document.getElementById("nome");

        // Campo para informar a altura.
        this.alturaInput = document.getElementById("altura");

        // Campo para informar o peso.
        this.pesoInput = document.getElementById("peso");

        // Seleção entre paciente particular ou convênio.
        this.tipoInput = document.getElementById("tipo-paciente");

        // Campo para o número da carteirinha.
        this.carteirinhaInput = document.getElementById("carteirinha");

        // Campo utilizado para informar o CEP.
        this.cepInput = document.getElementById("cep");

        // Campo preenchido com cidade e estado.
        this.cidadeInput = document.getElementById("cidade");

        // Elemento utilizado para mostrar mensagens.
        this.mensagem = document.getElementById("mensagem");

        // Botão responsável por excluir todos os pacientes.
        this.botaoLimpar = document.getElementById("limpar-todos");

        // Nome da chave utilizada para armazenar
        // os pacientes no localStorage do navegador.
        this.chaveStorage = "painelSaudePacientes";

        // Recupera os pacientes salvos anteriormente.
        this.pacientes = this.carregarPacientes();

        // Configura os eventos do formulário e dos botões.
        this.registrarEventos();

        // Verifica se o campo carteirinha deve estar ativo.
        this.atualizarCampoCarteirinha();

        // Mostra os pacientes cadastrados na tabela.
        this.atualizarTabela();
    }


    // ==================================================
    // 2. REGISTRO DOS EVENTOS
    // ==================================================

    // Eventos são ações realizadas pelo usuário,
    // como clicar, digitar ou enviar um formulário.

    registrarEventos() {

        // Quando o formulário é enviado,
        // executa o método adicionarPaciente().
        this.formulario.addEventListener("submit", (event) =>
            this.adicionarPaciente(event)
        );

        // Quando o tipo de atendimento é alterado,
        // verifica se a carteirinha será necessária.
        this.tipoInput.addEventListener("change", () =>
            this.atualizarCampoCarteirinha()
        );

        // Quando o usuário sai do campo CEP,
        // executa a consulta na API ViaCEP.
        this.cepInput.addEventListener("blur", () =>
            this.buscarCEP()
        );

        // Executa enquanto o usuário digita o CEP.
        this.cepInput.addEventListener("input", () => {

            // Remove caracteres que não sejam números.
            // \D representa qualquer caractere não numérico.
            // slice(0, 8) limita o CEP a oito números.
            const numeros = this.cepInput.value
                .replace(/\D/g, "")
                .slice(0, 8);

            // Adiciona automaticamente o hífen
            // depois dos cinco primeiros números.
            // Exemplo: 01001000 -> 01001-000.
            this.cepInput.value = numeros.length > 5
                ? numeros.slice(0, 5) + "-" + numeros.slice(5)
                : numeros;

            // Limpa a cidade quando o CEP é modificado.
            // Isso evita manter informações de outro CEP.
            this.cidadeInput.value = "";
        });

        // Quando o botão "Limpar todos" é clicado,
        // executa o método limparTodos().
        this.botaoLimpar.addEventListener("click", () =>
            this.limparTodos()
        );
    }


    // ==================================================
    // 3. EXIBIÇÃO DE MENSAGENS
    // ==================================================

    mostrarMensagem(texto, tipo = "info") {

        // Insere o texto da mensagem no HTML.
        this.mensagem.textContent = texto;

        // Define a classe CSS conforme o tipo.
        // Exemplos: info, erro ou sucesso.
        this.mensagem.className = "mensagem " + tipo;
    }


    // ==================================================
    // 4. CONTROLE DO CAMPO CARTEIRINHA
    // ==================================================

    atualizarCampoCarteirinha() {

        // Verifica se o usuário selecionou "convênio".
        // O resultado será true ou false.
        const usaConvenio = this.tipoInput.value === "convenio";

        // Se for convênio, habilita a carteirinha.
        // Se for particular, desabilita o campo.
        this.carteirinhaInput.disabled = !usaConvenio;

        // Torna o preenchimento obrigatório
        // somente para pacientes de convênio.
        this.carteirinhaInput.required = usaConvenio;

        // Se o paciente for particular,
        // remove qualquer número digitado anteriormente.
        if (!usaConvenio) {
            this.carteirinhaInput.value = "";
        }
    }


    // ==================================================
    // 5. CONSULTA DO CEP COM A API VIACEP
    // ==================================================

    // A palavra async indica que esta função
    // executa operações assíncronas.
    //
    // Isso permite consultar informações na internet
    // sem precisar recarregar a página.
    //
    // A API ViaCEP retorna informações em formato JSON.

    async buscarCEP() {

        // Captura o CEP digitado pelo usuário.
        // Remove o hífen e outros caracteres.
        const cep = this.cepInput.value.replace(/\D/g, "");

        // Verifica se o campo está vazio.
        if (!cep) {

            // Limpa a cidade.
            this.cidadeInput.value = "";

            // Encerra a execução do método.
            return;
        }

        // Verifica se o CEP possui exatamente 8 números.
        // ^ indica o início do texto.
        // \d{8} representa oito dígitos.
        // $ indica o final do texto.
        if (!/^\d{8}$/.test(cep)) {

            this.cidadeInput.value = "";

            // Mostra uma mensagem de erro.
            this.mostrarMensagem(
                "CEP inválido. Digite os 8 números.",
                "erro"
            );

            return;
        }

        // Informa que a consulta está sendo realizada.
        this.mostrarMensagem("Consultando CEP...", "info");

        // Desabilita temporariamente o campo CEP
        // para evitar alterações durante a consulta.
        this.cepInput.disabled = true;

        // O try executa o código que pode gerar erros.
        try {

            // ==========================================
            // ETAPA 1: REQUISIÇÃO COM FETCH()
            // ==========================================

            // fetch() realiza uma requisição HTTP
            // para buscar informações na internet.
            //
            // O endereço é formado pelo CEP digitado.
            //
            // Exemplo:
            // https://viacep.com.br/ws/01001000/json/
            //
            // await aguarda a resposta da requisição
            // antes de continuar a execução da função.

            const resposta = await fetch(
                "https://viacep.com.br/ws/" + cep + "/json/"
            );

            // Verifica se a resposta HTTP foi bem-sucedida.
            // Caso contrário, gera um erro.
            if (!resposta.ok) {
                throw new Error("Falha na consulta");
            }


            // ==========================================
            // ETAPA 2: CONVERSÃO DA RESPOSTA JSON
            // ==========================================

            // A API retorna dados no formato JSON.
            //
            // JSON significa JavaScript Object Notation.
            // É um formato de troca de informações
            // organizado em pares de chave e valor.
            //
            // Exemplo:
            // {
            //     "localidade": "São Paulo",
            //     "uf": "SP"
            // }
            //
            // O método .json() interpreta o conteúdo
            // recebido e produz um objeto JavaScript.
            //
            // O await aguarda essa conversão.

            const dados = await resposta.json();


            // ==========================================
            // ETAPA 3: VERIFICAÇÃO DO CEP
            // ==========================================

            // O ViaCEP pode retornar a propriedade
            // "erro" quando o CEP não é encontrado.
            if (dados.erro) {

                // Limpa o campo cidade.
                this.cidadeInput.value = "";

                // Informa que o CEP não foi localizado.
                this.mostrarMensagem(
                    "CEP não encontrado. Confira o número digitado.",
                    "erro"
                );

                return;
            }


            // ==========================================
            // ETAPA 4: UTILIZAÇÃO DOS DADOS RECEBIDOS
            // ==========================================

            // Acessa as propriedades do objeto JavaScript:
            //
            // dados.localidade -> nome da cidade.
            // dados.uf -> sigla do estado.
            //
            // Preenche automaticamente o campo do HTML.
            //
            // Exemplo: São Paulo / SP.

            this.cidadeInput.value =
                dados.localidade + " / " + dados.uf;

            // Informa que a consulta funcionou.
            this.mostrarMensagem(
                "CEP localizado com sucesso.",
                "sucesso"
            );

        } catch (erro) {

            // ==========================================
            // ETAPA 5: TRATAMENTO DE ERROS
            // ==========================================

            // O catch é executado quando ocorre
            // algum erro durante a consulta.
            //
            // Exemplos:
            // - Falta de conexão com a internet.
            // - Falha no servidor da API.
            // - Problema na resposta recebida.

            // Mostra o erro no console do navegador.
            console.error(erro);

            // Limpa o campo cidade.
            this.cidadeInput.value = "";

            // Mostra uma mensagem para o usuário.
            this.mostrarMensagem(
                "Não foi possível consultar o CEP. Verifique sua conexão com a internet.",
                "erro"
            );

        } finally {

            // O finally é executado independentemente
            // de a consulta ter funcionado ou falhado.
            //
            // Habilita novamente o campo CEP.
            this.cepInput.disabled = false;
        }
    }


    // ==================================================
    // 6. CAPTURA DOS DADOS DO FORMULÁRIO
    // ==================================================

    capturarDados() {

        // Retorna um objeto com os dados preenchidos.
        //
        // Cada informação é armazenada em um par
        // de chave e valor.
        //
        // trim() remove espaços desnecessários.
        // Number() converte textos em números.

        return {

            // Nome informado pelo usuário.
            nome: this.nomeInput.value.trim(),

            // Altura convertida para número.
            altura: Number(this.alturaInput.value),

            // Peso convertido para número.
            peso: Number(this.pesoInput.value),

            // Tipo de atendimento.
            tipo: this.tipoInput.value,

            // Número da carteirinha.
            carteirinha: this.carteirinhaInput.value.trim(),

            // Cidade e estado encontrados pelo ViaCEP.
            cidade: this.cidadeInput.value.trim()
        };
    }


    // ==================================================
    // 7. VALIDAÇÃO DOS DADOS
    // ==================================================

    validarDados(dados) {

        // Verifica se:
        // - O nome foi preenchido.
        // - A altura e o peso são números válidos.
        // - A altura é maior que zero e até 2,8 m.
        // - O peso é maior que zero e até 500 kg.

        if (
            !dados.nome ||
            !Number.isFinite(dados.altura) ||
            !Number.isFinite(dados.peso) ||
            dados.altura <= 0 ||
            dados.altura > 2.8 ||
            dados.peso <= 0 ||
            dados.peso > 500
        ) {

            // Exibe uma mensagem caso algum dado seja inválido.
            this.mostrarMensagem(
                "Preencha nome, altura e peso com valores válidos.",
                "erro"
            );

            // false indica que a validação falhou.
            return false;
        }

        // Verifica se a cidade foi preenchida pelo ViaCEP.
        if (!dados.cidade) {

            this.mostrarMensagem(
                "Consulte um CEP válido antes de cadastrar o paciente.",
                "erro"
            );

            // Coloca o cursor no campo CEP.
            this.cepInput.focus();

            return false;
        }

        // Verifica se o paciente é de convênio
        // e se a carteirinha foi preenchida.
        if (
            dados.tipo === "convenio" &&
            !dados.carteirinha
        ) {

            this.mostrarMensagem(
                "Informe o número da carteirinha do convênio.",
                "erro"
            );

            this.carteirinhaInput.focus();

            return false;
        }

        // Se todas as verificações passaram,
        // retorna true e permite o cadastro.
        return true;
    }


    // ==================================================
    // 8. CADASTRO DE UM NOVO PACIENTE
    // ==================================================

    adicionarPaciente(event) {

        // Impede que o formulário recarregue a página
        // quando o botão de cadastro é pressionado.
        event.preventDefault();

        // Captura os dados digitados no formulário.
        const dados = this.capturarDados();

        // Verifica se os dados são válidos.
        // Se houver algum erro, interrompe o cadastro.
        if (!this.validarDados(dados)) {
            return;
        }

        // Cria um identificador único para o paciente.
        //
        // crypto.randomUUID() gera um ID aleatório.
        //
        // Caso essa função não esteja disponível,
        // utiliza data, horário e número aleatório.
        const id = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : String(Date.now()) + Math.random().toString(16).slice(2);


        // ==============================================
        // CRIAÇÃO DO OBJETO PACIENTE
        // ==============================================

        // Verifica o tipo de atendimento.
        //
        // Se for convênio, cria um objeto
        // da classe PacienteConvenio.
        //
        // Caso contrário, cria um objeto
        // da classe Paciente.
        //
        // Isso demonstra o uso de herança
        // e programação orientada a objetos.

        const paciente = dados.tipo === "convenio"
            ? new PacienteConvenio(
                dados.nome,
                dados.altura,
                dados.peso,
                dados.cidade,
                dados.carteirinha
            )
            : new Paciente(
                dados.nome,
                dados.altura,
                dados.peso,
                dados.cidade
            );


        // ==============================================
        // ADICIONA O PACIENTE À LISTA
        // ==============================================

        // push() adiciona um novo elemento ao array.
        //
        // Os métodos getNome(), getAltura(), getPeso()
        // e getCidade() recuperam os dados do objeto.

        this.pacientes.push({

            id: id,

            nome: paciente.getNome(),

            altura: paciente.getAltura(),

            peso: paciente.getPeso(),

            cidade: paciente.getCidade(),

            tipo: dados.tipo,

            // Guarda a carteirinha somente
            // quando o paciente possui convênio.
            carteirinha: dados.tipo === "convenio"
                ? paciente.getCarteirinha()
                : ""
        });


        // Salva a lista atualizada no navegador.
        this.salvarPacientes();

        // Atualiza a tabela com o novo paciente.
        this.atualizarTabela();

        // Limpa os campos do formulário.
        this.formulario.reset();

        // Atualiza a situação do campo carteirinha.
        this.atualizarCampoCarteirinha();

        // Limpa a cidade.
        this.cidadeInput.value = "";

        // Informa que o cadastro foi realizado.
        this.mostrarMensagem(
            "Paciente cadastrado com sucesso.",
            "sucesso"
        );

        // Coloca o cursor no campo nome
        // para facilitar um novo cadastro.
        this.nomeInput.focus();
    }


    // ==================================================
    // 9. SALVAMENTO DOS PACIENTES NO LOCALSTORAGE
    // ==================================================

    salvarPacientes() {

        // localStorage é um recurso do navegador
        // que permite armazenar informações localmente.
        //
        // Os dados permanecem salvos mesmo depois
        // que a página é fechada.
        //
        // O localStorage armazena valores como texto.
        //
        // Por isso, JSON.stringify() transforma
        // o array de pacientes em uma string JSON.

        try {

            localStorage.setItem(
                this.chaveStorage,
                JSON.stringify(this.pacientes)
            );

        } catch (erro) {

            // Caso ocorra algum erro no armazenamento,
            // registra o problema no console.
            console.error(erro);

            this.mostrarMensagem(
                "Não foi possível salvar os dados neste navegador.",
                "erro"
            );
        }
    }


    // ==================================================
    // 10. RECUPERAÇÃO DOS PACIENTES SALVOS
    // ==================================================

    carregarPacientes() {

        try {

            // localStorage.getItem() recupera
            // os dados armazenados anteriormente.
            //
            // Se não houver dados, utiliza "[]",
            // que representa um array vazio.
            //
            // JSON.parse() converte o texto JSON
            // novamente em um valor JavaScript.

            const dados = JSON.parse(
                localStorage.getItem(this.chaveStorage) || "[]"
            );

            // Verifica se os dados recuperados
            // realmente formam um array.
            //
            // Se forem válidos, retorna os pacientes.
            // Caso contrário, retorna um array vazio.

            return Array.isArray(dados) ? dados : [];

        } catch (erro) {

            // Se o JSON estiver inválido ou ocorrer
            // algum erro, registra no console.
            console.error(erro);

            // Retorna uma lista vazia para evitar
            // que o sistema pare de funcionar.
            return [];
        }
    }


    // ==================================================
    // 11. CRIAÇÃO DAS CÉLULAS DA TABELA
    // ==================================================

    criarCelula(linha, valor) {

        // document.createElement() cria
        // um novo elemento HTML pelo JavaScript.
        //
        // Neste caso, cria uma célula <td>.
        const celula = document.createElement("td");

        // Insere o valor dentro da célula.
        //
        // textContent adiciona o conteúdo como texto,
        // evitando interpretar códigos HTML digitados.
        celula.textContent = valor;

        // Adiciona a célula à linha da tabela.
        linha.appendChild(celula);
    }


    // ==================================================
    // 12. ATUALIZAÇÃO DA TABELA DE PACIENTES
    // ==================================================

    atualizarTabela() {

        // Limpa o conteúdo atual da tabela
        // antes de mostrar os dados atualizados.
        this.corpoTabela.innerHTML = "";

        // Verifica se não existem pacientes cadastrados.
        if (this.pacientes.length === 0) {

            // Cria uma nova linha da tabela.
            const linha = document.createElement("tr");

            // Cria uma célula.
            const celula = document.createElement("td");

            // Faz a célula ocupar as nove colunas.
            celula.colSpan = 9;

            // Define a classe CSS para a mensagem.
            celula.className = "vazio";

            // Mostra a mensagem na tabela.
            celula.textContent = "Nenhum paciente cadastrado.";

            // Adiciona a célula à linha.
            linha.appendChild(celula);

            // Adiciona a linha à tabela.
            this.corpoTabela.appendChild(linha);

            // Encerra o método.
            return;
        }


        // ==============================================
        // PERCORRE A LISTA DE PACIENTES
        // ==============================================

        // forEach() percorre todos os elementos
        // do array de pacientes.
        //
        // Para cada paciente, cria uma linha na tabela.

        this.pacientes.forEach((dados) => {

            // Recria o objeto de acordo com
            // o tipo de atendimento.
            const paciente = dados.tipo === "convenio"
                ? new PacienteConvenio(
                    dados.nome,
                    dados.altura,
                    dados.peso,
                    dados.cidade,
                    dados.carteirinha
                )
                : new Paciente(
                    dados.nome,
                    dados.altura,
                    dados.peso,
                    dados.cidade
                );

            // Cria uma nova linha HTML.
            const linha = document.createElement("tr");


            // ==========================================
            // ORGANIZA OS VALORES DA TABELA
            // ==========================================

            // Os dados são organizados em um array
            // na mesma ordem das colunas do HTML.

            const valores = [

                // Nome do paciente.
                paciente.getNome(),

                // Tipo de atendimento.
                dados.tipo === "convenio"
                    ? "Convênio"
                    : "Particular",

                // Carteirinha ou traço se não houver.
                dados.carteirinha || "—",

                // Cidade e estado.
                paciente.getCidade(),

                // Altura com duas casas decimais.
                paciente.getAltura().toFixed(2),

                // Peso com uma casa decimal.
                paciente.getPeso().toFixed(1),

                // Calcula o Índice de Massa Corporal.
                //
                // A fórmula utilizada pela classe é:
                // IMC = peso / (altura * altura)
                //
                // toFixed(2) exibe duas casas decimais.
                paciente.calcularIMC().toFixed(2),

                // Obtém a classificação do IMC
                // definida na classe Paciente.
                paciente.definirClassificacao()
            ];


            // ==========================================
            // ADICIONA OS DADOS NA LINHA
            // ==========================================

            // Percorre cada valor do array
            // e cria uma célula correspondente.
            valores.forEach((valor) =>
                this.criarCelula(linha, valor)
            );


            // ==========================================
            // CRIA O BOTÃO EXCLUIR
            // ==========================================

            // Cria a célula da coluna "Ação".
            const celulaAcao = document.createElement("td");

            // Cria um botão HTML.
            const botao = document.createElement("button");

            // Define que o botão não envia formulários.
            botao.type = "button";

            // Aplica a classe CSS do botão.
            botao.className = "botao-excluir";

            // Define o texto exibido.
            botao.textContent = "Excluir";

            // Adiciona uma descrição acessível
            // para leitores de tela.
            botao.setAttribute(
                "aria-label",
                "Excluir " + paciente.getNome()
            );

            // Quando o botão é clicado,
            // exclui o paciente correspondente ao ID.
            botao.addEventListener("click", () =>
                this.excluirPaciente(dados.id)
            );

            // Adiciona o botão à célula.
            celulaAcao.appendChild(botao);

            // Adiciona a célula à linha.
            linha.appendChild(celulaAcao);

            // Adiciona a linha completa à tabela.
            this.corpoTabela.appendChild(linha);
        });
    }


    // ==================================================
    // 13. EXCLUSÃO INDIVIDUAL DE PACIENTES
    // ==================================================

    excluirPaciente(id) {

        // filter() cria um novo array contendo
        // apenas os pacientes que atendem à condição.
        //
        // Neste caso, mantém todos os pacientes
        // cujo ID seja diferente do ID selecionado.
        //
        // Assim, o paciente escolhido é removido.

        this.pacientes = this.pacientes.filter(
            (paciente) => paciente.id !== id
        );

        // Salva a lista após a exclusão.
        this.salvarPacientes();

        // Atualiza a tabela.
        this.atualizarTabela();

        // Mostra a confirmação.
        this.mostrarMensagem(
            "Paciente excluído.",
            "sucesso"
        );
    }


    // ==================================================
    // 14. EXCLUSÃO DE TODOS OS PACIENTES
    // ==================================================

    limparTodos() {

        // Verifica se a lista está vazia.
        if (this.pacientes.length === 0) {

            this.mostrarMensagem(
                "Não há pacientes para excluir.",
                "info"
            );

            return;
        }

        // window.confirm() abre uma janela
        // solicitando confirmação do usuário.
        //
        // Se o usuário clicar em "Cancelar",
        // a função é encerrada.

        if (!window.confirm(
            "Tem certeza de que deseja excluir todos os pacientes salvos?"
        )) {
            return;
        }

        // Substitui a lista por um array vazio.
        this.pacientes = [];

        // Salva a lista vazia no localStorage.
        this.salvarPacientes();

        // Atualiza a tabela para mostrar
        // que não existem pacientes cadastrados.
        this.atualizarTabela();

        // Exibe a mensagem de confirmação.
        this.mostrarMensagem(
            "Todos os cadastros foram removidos.",
            "sucesso"
        );
    }
}


// ======================================================
// 15. INICIALIZAÇÃO DO SISTEMA
// ======================================================

// DOMContentLoaded é um evento disparado
// quando o navegador termina de carregar
// e interpretar a estrutura HTML.
//
// Isso garante que os elementos do formulário
// já existam antes de o JavaScript acessá-los.

document.addEventListener("DOMContentLoaded", () => {

    // Cria um objeto da classe PainelApp.
    //
    // Ao criar o objeto, o constructor é executado,
    // iniciando todas as funcionalidades do sistema.

    new PainelApp();
});

// ======================================================
// FIM DO ARQUIVO app.js
// ======================================================
