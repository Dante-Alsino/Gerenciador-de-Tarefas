
let tasks = [];

const DOM = {
    form: document.getElementById('task-form'),
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
        descricao: descricao,
        categoria: categoria,
        dificuldade: dificuldade,
        data: data,
        status: 'pendente'
    };


    tasks.push(newTask);

    DOM.form.reset();
    DOM.inputs.desc.focus();
    renderBoard();
});

function renderBoard() {

    Object.values(DOM.columns).forEach(column => {
        column.innerHTML = '';
    });


    tasks.forEach(task => {
        const card = document.createElement('article');
        card.classList.add('card', task.dificuldade);

        const dateParts = task.data.split('-');
        const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : task.data;

        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title"></h3>
                <span class="card-category"></span>
            </div>
            <div class="card-meta">
                <span class="card-date">📅 ${formattedDate}</span>
            </div>
            <div class="card-actions">
                <button class="btn-action btn-complete" disabled>✔ Concluir</button>
                <button class="btn-action btn-delete" disabled>🗑 Excluir</button>
            </div>
        `;

        card.querySelector('.card-title').textContent = task.descricao;
        card.querySelector('.card-category').textContent = task.categoria;

        if (task.status === 'pendente') {
            const columnId = task.dificuldade;
            if (DOM.columns[columnId]) {
                DOM.columns[columnId].appendChild(card);
            }
        } else if (task.status === 'concluida') {
            DOM.columns.concluido.appendChild(card);
        }
    });
}
