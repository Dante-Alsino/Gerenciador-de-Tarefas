// Referências do DOM
const listaTarefas = document.getElementById('lista-tarefas');
const mensagemVazia = document.getElementById('mensagem-vazia');

// Estado da Aplicação (Array de objetos)
let tarefas = [];

// Função de inicialização
function inicializarApp() {
    console.log("Gerenciador de Tarefas iniciado!");
    // Lógica para buscar do localStorage entrará aqui em breve
}

// Inicializa a aplicação ao carregar
document.addEventListener('DOMContentLoaded', inicializarApp);
