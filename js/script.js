const STORAGE_KEY = 'kanban_tasks_app';
const THEME_KEY = 'kanban_theme_preference';

let tasks = [];

const currentFilters = {
    status: 'todas',
    category: 'todas',
    search: '',
    sort: 'padrao'
};

const DOM = {
    form: document.getElementById('task-form'),
    board: document.querySelector('.kanban-board'),
    emptyState: document.getElementById('empty-state'),
    columnsList: document.querySelectorAll('.kanban-board .column'),
    btnClearDone: document.getElementById('btn-clear-done'),
    themeToggle: document.getElementById('btn-theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    themeText: document.getElementById('theme-text'),
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
        done: document.getElementById('stat-done'),
        progress: document.getElementById('stat-progress'),
        progressFill: document.getElementById('progress-bar-fill')
    },
    filters: {
        status: document.getElementById('filter-status'),
        category: document.getElementById('filter-category'),
        search: document.getElementById('filter-search'),
        sort: document.getElementById('filter-sort')
    }
};

/* Armazenamento (LocalStorage) */

function saveTasksToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Erro ao salvar tarefas no LocalStorage:', error);
    }
}

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
        console.error('Erro ao ler tarefas do LocalStorage:', error);
        tasks = [];
    }
}

/* Gerenciamento de Tema (Dark/Light Mode) */

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        applyTheme(savedTheme, false);
    } else {
        // Respeita a preferência do sistema operacional caso não haja escolha salva
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(systemPrefersDark ? 'dark' : 'light', false);
    }
}

function applyTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);

    if (theme === 'dark') {
        DOM.themeIcon.textContent = '☀️';
        DOM.themeText.textContent = 'Claro';
    } else {
        DOM.themeIcon.textContent = '🌙';
        DOM.themeText.textContent = 'Escuro';
    }

    if (save) {
        localStorage.setItem(THEME_KEY, theme);
    }
}

DOM.themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
});

/* Interface de Indicadores e Filtros */

function updateDashboard() {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'concluida').length;
    const pending = total - done;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    DOM.stats.total.textContent = total;
    DOM.stats.pending.textContent = pending;
    DOM.stats.done.textContent = done;
    DOM.stats.progress.textContent = `${percentage}%`;
    DOM.stats.progressFill.style.width = `${percentage}%`;

    if (DOM.btnClearDone) {
        DOM.btnClearDone.disabled = done === 0;
    }
}

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

/* Ações de Tarefas */

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

DOM.btnClearDone.addEventListener('click', function() {
    const doneTasksCount = tasks.filter(t => t.status === 'concluida').length;
    if (doneTasksCount === 0) return;

    const confirmed = window.confirm(`Deseja realmente excluir todas as ${doneTasksCount} tarefas concluídas?`);
    if (!confirmed) return;

    tasks = tasks.filter(t => t.status !== 'concluida');
    saveTasksToStorage();

    updateDashboard();
    updateCategoryFilterOptions();
    renderBoard();
});

// Event Delegation: listener único no container para tratar ações dos cards
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

DOM.filters.status.addEventListener('change', function(event) {
    currentFilters.status = event.target.value;
    renderBoard();
});

DOM.filters.category.addEventListener('change', function(event) {
    currentFilters.category = event.target.value;
    renderBoard();
});

DOM.filters.search.addEventListener('input', function(event) {
    currentFilters.search = event.target.value.toLowerCase().trim();
    renderBoard();
});

DOM.filters.sort.addEventListener('change', function(event) {
    currentFilters.sort = event.target.value;
    renderBoard();
});

/* Renderização */

function renderBoard() {
    if (tasks.length === 0) {
        DOM.emptyState.classList.remove('hidden');
        DOM.columnsList.forEach(col => col.style.display = 'none');
        return;
    }

    DOM.emptyState.classList.add('hidden');
    DOM.columnsList.forEach(col => col.style.display = 'flex');

    Object.values(DOM.columns).forEach(column => {
        column.innerHTML = '';
    });

    let visibleTasks = tasks.filter(task => {
        const matchesStatus =
            currentFilters.status === 'todas' ||
            (currentFilters.status === 'pendente' && task.status === 'pendente') ||
            (currentFilters.status === 'concluida' && task.status === 'concluida');

        const matchesCategory =
            currentFilters.category === 'todas' ||
            task.categoria.toLowerCase() === currentFilters.category.toLowerCase();

        const matchesSearch =
            !currentFilters.search ||
            task.descricao.toLowerCase().includes(currentFilters.search) ||
            task.categoria.toLowerCase().includes(currentFilters.search);

        return matchesStatus && matchesCategory && matchesSearch;
    });

    // Peso numérico para ordenação comparativa por nível de dificuldade
    const difficultyWeight = { facil: 1, moderado: 2, dificil: 3 };

    if (currentFilters.sort === 'data-asc') {
        visibleTasks.sort((a, b) => new Date(a.data) - new Date(b.data));
    } else if (currentFilters.sort === 'data-desc') {
        visibleTasks.sort((a, b) => new Date(b.data) - new Date(a.data));
    } else if (currentFilters.sort === 'dificuldade-asc') {
        visibleTasks.sort((a, b) => difficultyWeight[a.dificuldade] - difficultyWeight[b.dificuldade]);
    } else if (currentFilters.sort === 'dificuldade-desc') {
        visibleTasks.sort((a, b) => difficultyWeight[b.dificuldade] - difficultyWeight[a.dificuldade]);
    }

    visibleTasks.forEach(task => {
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

function init() {
    initTheme();
    loadTasksFromStorage();
    updateDashboard();
    updateCategoryFilterOptions();
    renderBoard();
}

init();
