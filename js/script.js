/**
 * Gerenciador de Tarefas - Kanban Minimalista
 * Implementação: Fase 2 (Lógica Base) & Fase 3 (Interatividade das Tarefas)
 */

// --- 1. Estado da Aplicação (State) ---
// Array central em memória que atua como fonte da verdade dos dados
let tasks = [];

// --- 2. Elementos do DOM (Cache) ---
const DOM = {
    form: document.getElementById('task-form'),
    board: document.querySelector('.kanban-board'),
    inputs: {
        desc: document.getElementById('task-desc'),
        category: document.getElementById('task-category'),
        difficulty: document.getElementById('task-difficulty'),
        date: document.getElementById('task-date')
    },
    columns: {
        facil: document.getElementById('col-facil'),
        moderado: document.getElementById('col-moderado'),
        dificil: document.getElementById('col-dificil'),
        concluido: document.getElementById('col-concluido')
    }
};

// --- 3. Manipulação de Eventos do Formulário ---
DOM.form.addEventListener('submit', function(event) {
    // Evita recarregamento da página (SPA)
    event.preventDefault();

    const descricao = DOM.inputs.desc.value.trim();
    const categoria = DOM.inputs.category.value.trim();
    const dificuldade = DOM.inputs.difficulty.value;
    const data = DOM.inputs.date.value;

    if (!descricao || !categoria || !dificuldade || !data) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Criação do objeto com ID único obrigatório para a Fase 3
    const newTask = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        descricao: descricao,
        categoria: categoria,
        dificuldade: dificuldade,
        data: data,
        status: 'pendente'
    };

    tasks.push(newTask);

    // Reseta o formulário e foca novamente no campo de descrição
    DOM.form.reset();
    DOM.inputs.desc.focus();

    // Redesenha o quadro
    renderBoard();
});

// --- 4. Interatividade: Lógica de Conclusão e Exclusão (Fase 3) ---

/**
 * Alterna o status da tarefa entre 'pendente' e 'concluida'
 * @param {string} id - Identificador único da tarefa
 */
function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Inverte o estado
    task.status = task.status === 'pendente' ? 'concluida' : 'pendente';
    
    // Atualiza a visualização no DOM
    renderBoard();
}

/**
 * Remove a tarefa do array após confirmação explícita do usuário
 * @param {string} id - Identificador único da tarefa
 */
function deleteTask(id) {
    const confirmed = window.confirm('Tem certeza de que deseja excluir esta tarefa permanentemente?');
    if (!confirmed) return;

    // Filtra removendo a tarefa com o ID correspondente
    tasks = tasks.filter(t => t.id !== id);

    // Atualiza a visualização no DOM
    renderBoard();
}

// --- 5. Delegação de Eventos (Event Delegation) ---
// Único ouvinte no elemento pai para responder a cliques em botões de ação
DOM.board.addEventListener('click', function(event) {
    const actionButton = event.target.closest('button[data-action]');
    if (!actionButton) return;

    const action = actionButton.dataset.action;
    const id = actionButton.dataset.id;

    if (action === 'toggle-status') {
        toggleTaskStatus(id);
    } else if (action === 'delete-task') {
        deleteTask(id);
    }
});

// --- 6. Renderização Dinâmica no DOM ---
function renderBoard() {
    // Limpa todas as colunas antes de desenhar
    Object.values(DOM.columns).forEach(column => {
        column.innerHTML = '';
    });

    tasks.forEach(task => {
        const isDone = task.status === 'concluida';
        const card = document.createElement('article');
        
        // Classes de estilo: dificuldade e estado de concluída
        card.className = `card ${task.dificuldade} ${isDone ? 'concluida' : ''}`;

        // Formatação amigável de data (DD/MM/AAAA)
        const dateParts = task.data.split('-');
        const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : task.data;

        // Botão de alternância dinâmico (Concluir vs Desfazer)
        const toggleButtonHtml = isDone
            ? `<button class="btn-action btn-undo" data-action="toggle-status" data-id="${task.id}" title="Retornar para pendente">↺ Desfazer</button>`
            : `<button class="btn-action btn-complete" data-action="toggle-status" data-id="${task.id}" title="Marcar como concluída">✔ Concluir</button>`;

        // Estrutura HTML do card
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title"></h3>
                <span class="card-category"></span>
            </div>
            <div class="card-meta">
                <span class="card-date">📅 ${formattedDate}</span>
            </div>
            <div class="card-actions">
                ${toggleButtonHtml}
                <button class="btn-action btn-delete" data-action="delete-task" data-id="${task.id}" title="Excluir tarefa">🗑 Excluir</button>
            </div>
        `;

        // Prevenção contra injeção XSS: valores em texto puro
        card.querySelector('.card-title').textContent = task.descricao;
        card.querySelector('.card-category').textContent = task.categoria;

        // Distribuição dos cards pelas colunas
        if (isDone) {
            DOM.columns.concluido.appendChild(card);
        } else {
            const columnId = task.dificuldade; // 'facil', 'moderado' ou 'dificil'
            if (DOM.columns[columnId]) {
                DOM.columns[columnId].appendChild(card);
            }
        }
    });
}
