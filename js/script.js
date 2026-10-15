/**
 * Gerenciador de Tarefas - Kanban Minimalista
 * Implementação: 
 * - Fase 2: Lógica Base
 * - Fase 3: Interatividade (Concluir, Desfazer, Excluir)
 * - Fase 4: Indicadores (Dashboard) e Filtros (Situação e Categoria)
 */

// --- 1. Estado da Aplicação (State) ---
let tasks = [];

// Estado ativo dos filtros (visualização não destrutiva)
const currentFilters = {
    status: 'todas',
    category: 'todas'
};

// --- 2. Elementos do DOM em Cache ---
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
    },
    stats: {
        total: document.getElementById('stat-total'),
        pending: document.getElementById('stat-pending'),
        done: document.getElementById('stat-done')
    },
    filters: {
        status: document.getElementById('filter-status'),
        category: document.getElementById('filter-category')
    }
};

// --- 3. Inicialização e Atualizações Gerais ---

/**
 * Atualiza os contadores numéricos do Dashboard no Header.
 * Os indicadores sempre representam a base total de dados armazenados.
 */
function updateDashboard() {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'concluida').length;
    const pending = total - done;

    DOM.stats.total.textContent = total;
    DOM.stats.pending.textContent = pending;
    DOM.stats.done.textContent = done;
}

/**
 * Atualiza dinamicamente as opções do seletor de Categoria com base
 * nas categorias reais presentes nas tarefas cadastradas.
 */
function updateCategoryFilterOptions() {
    const categories = [...new Set(tasks.map(t => t.categoria.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const previousSelection = DOM.filters.category.value;

    DOM.filters.category.innerHTML = '<option value="todas">Todas</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        DOM.filters.category.appendChild(option);
    });

    // Mantém a categoria selecionada se ela ainda existir no cadastro
    if (categories.includes(previousSelection)) {
        DOM.filters.category.value = previousSelection;
        currentFilters.category = previousSelection;
    } else {
        DOM.filters.category.value = 'todas';
        currentFilters.category = 'todas';
    }
}

// --- 4. Submissão de Nova Tarefa ---
DOM.form.addEventListener('submit', function(event) {
    event.preventDefault();

    const descricao = DOM.inputs.desc.value.trim();
    const categoria = DOM.inputs.category.value.trim();
    const dificuldade = DOM.inputs.difficulty.value;
    const data = DOM.inputs.date.value;

    if (!descricao || !categoria || !dificuldade || !data) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const newTask = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        descricao: descricao,
        categoria: categoria,
        dificuldade: dificuldade,
        data: data,
        status: 'pendente'
    };

    tasks.push(newTask);

    DOM.form.reset();
    DOM.inputs.desc.focus();

    // Sincroniza indicadores, opções de filtro e redesenha a tela
    updateDashboard();
    updateCategoryFilterOptions();
    renderBoard();
});

// --- 5. Interatividade (Concluir, Desfazer e Excluir) ---

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.status = task.status === 'pendente' ? 'concluida' : 'pendente';

    updateDashboard();
    renderBoard();
}

function deleteTask(id) {
    const confirmed = window.confirm('Tem certeza de que deseja excluir esta tarefa permanentemente?');
    if (!confirmed) return;

    tasks = tasks.filter(t => t.id !== id);

    updateDashboard();
    updateCategoryFilterOptions();
    renderBoard();
}

// Event Delegation para botões de ação nos cards
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

// --- 6. Eventos dos Filtros ---
DOM.filters.status.addEventListener('change', function(event) {
    currentFilters.status = event.target.value;
    renderBoard();
});

DOM.filters.category.addEventListener('change', function(event) {
    currentFilters.category = event.target.value;
    renderBoard();
});

// --- 7. Renderização com Pipeline de Filtragem ---
function renderBoard() {
    // 1. Limpa todas as colunas
    Object.values(DOM.columns).forEach(column => {
        column.innerHTML = '';
    });

    // 2. Aplica os filtros ativos sem mutar o array tasks original
    const filteredTasks = tasks.filter(task => {
        const matchesStatus =
            currentFilters.status === 'todas' ||
            (currentFilters.status === 'pendente' && task.status === 'pendente') ||
            (currentFilters.status === 'concluida' && task.status === 'concluida');

        const matchesCategory =
            currentFilters.category === 'todas' ||
            task.categoria.toLowerCase() === currentFilters.category.toLowerCase();

        return matchesStatus && matchesCategory;
    });

    // 3. Monta e distribui os cards filtrados
    filteredTasks.forEach(task => {
        const isDone = task.status === 'concluida';
        const card = document.createElement('article');
        card.className = `card ${task.dificuldade} ${isDone ? 'concluida' : ''}`;

        const dateParts = task.data.split('-');
        const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : task.data;

        const toggleButtonHtml = isDone
            ? `<button class="btn-action btn-undo" data-action="toggle-status" data-id="${task.id}" title="Retornar para pendente">↺ Desfazer</button>`
            : `<button class="btn-action btn-complete" data-action="toggle-status" data-id="${task.id}" title="Marcar como concluída">✔ Concluir</button>`;

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

        card.querySelector('.card-title').textContent = task.descricao;
        card.querySelector('.card-category').textContent = task.categoria;

        if (isDone) {
            DOM.columns.concluido.appendChild(card);
        } else {
            const columnId = task.dificuldade;
            if (DOM.columns[columnId]) {
                DOM.columns[columnId].appendChild(card);
            }
        }
    });
}

// Inicia os contadores zerados
updateDashboard();
