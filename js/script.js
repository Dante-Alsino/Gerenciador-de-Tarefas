/**
 * Gerenciador de Tarefas - Kanban Minimalista
 * Implementação Completa:
 * - Fase 2: Lógica Base
 * - Fase 3: Interatividade (Concluir, Desfazer, Excluir)
 * - Fase 4: Indicadores (Dashboard) e Filtros (Situação e Categoria)
 * - Fase 5: Persistência de Dados (Local Storage) e Situação Inicial
 */

// Chave para armazenamento no LocalStorage do navegador
const STORAGE_KEY = 'kanban_tasks_app';

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
    emptyState: document.getElementById('empty-state'),
    columnsList: document.querySelectorAll('.kanban-board .column'),
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

// --- 3. Camada de Persistência (Local Storage) ---

/**
 * Salva a lista de tarefas no localStorage em formato JSON
 */
function saveTasksToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Erro ao salvar tarefas no LocalStorage:', error);
    }
}

/**
 * Carrega e recupera as tarefas salvas do localStorage
 */
function loadTasksFromStorage() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const parsed = JSON.parse(storedData);
            tasks = Array.isArray(parsed) ? parsed : [];
        } else {
            tasks = [];
        }
    } catch (error) {
        console.error('Erro ao ler dados do LocalStorage:', error);
        tasks = [];
    }
}

// --- 4. Indicadores e Filtros ---

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

    if (categories.includes(previousSelection)) {
        DOM.filters.category.value = previousSelection;
        currentFilters.category = previousSelection;
    } else {
        DOM.filters.category.value = 'todas';
        currentFilters.category = 'todas';
    }
}

// --- 5. Ações do Usuário (Adicionar, Concluir, Desfazer, Excluir) ---

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
    saveTasksToStorage();

    DOM.form.reset();
    DOM.inputs.desc.focus();

    updateDashboard();
    updateCategoryFilterOptions();
    renderBoard();
});

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.status = task.status === 'pendente' ? 'concluida' : 'pendente';
    saveTasksToStorage();

    updateDashboard();
    renderBoard();
}

function deleteTask(id) {
    const confirmed = window.confirm('Tem certeza de que deseja excluir esta tarefa permanentemente?');
    if (!confirmed) return;

    tasks = tasks.filter(t => t.id !== id);
    saveTasksToStorage();

    updateDashboard();
    updateCategoryFilterOptions();
    renderBoard();
}

// Delegação de Eventos para os botões de ação nos cards
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

// Eventos de alteração dos filtros
DOM.filters.status.addEventListener('change', function(event) {
    currentFilters.status = event.target.value;
    renderBoard();
});

DOM.filters.category.addEventListener('change', function(event) {
    currentFilters.category = event.target.value;
    renderBoard();
});

// --- 6. Renderização Dinâmica e Gestão do Estado Vazio ---
function renderBoard() {
    // 1. Tratamento da Situação Inicial (Sem tarefas cadastradas)
    if (tasks.length === 0) {
        DOM.emptyState.classList.remove('hidden');
        DOM.columnsList.forEach(col => col.style.display = 'none');
        return;
    }

    // Se existem tarefas, garante que o estado vazio está oculto e as colunas visíveis
    DOM.emptyState.classList.add('hidden');
    DOM.columnsList.forEach(col => col.style.display = 'flex');

    // 2. Limpa o conteúdo interno de todas as colunas
    Object.values(DOM.columns).forEach(column => {
        column.innerHTML = '';
    });

    // 3. Aplica os filtros ativos sem mutar os dados originais
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

    // 4. Cria e distribui os cards
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

// --- 7. Inicialização da Aplicação (Bootstrap) ---
function init() {
    loadTasksFromStorage();
    updateDashboard();
    updateCategoryFilterOptions();
    renderBoard();
}

// Inicia o app restaurando o estado do navegador
init();
