  let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];

function saveTasks() {
  localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('taskInput');
  const desc = input.value.trim();
  if (!desc) return;

  const task = { id: Date.now(), desc: desc, column: 'aberto' };
  tasks.push(task);
  saveTasks();
  renderTasks();
  input.value = '';
}

function renderTasks() {
  const colunas = ['aberto', 'negociacao', 'andamento', 'entregue'];

  // Remove apenas os cards, mantendo os títulos
  colunas.forEach(col => {
    const coluna = document.getElementById(col);
    if (coluna) {
      const filhos = Array.from(coluna.children);
      filhos.forEach(el => {
        if (el.tagName !== 'H2') {
          el.remove();
        }
      });
    }
  });

  // Adiciona as tarefas nas colunas corretas
  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.ondragstart = drag;
    card.dataset.id = task.id;
    card.innerHTML = `<span>${task.desc}</span> <button onclick="removeTask(${task.id})">X</button>`;

    const coluna = document.getElementById(task.column);
    if (coluna) {
      coluna.appendChild(card);
    } else {
      console.error(`Coluna "${task.column}" não encontrada no HTML.`);
    }
  });
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.dataset.id);
}

function drop(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  const task = tasks.find(t => t.id == id);
  if (task) {
    task.column = ev.currentTarget.id;
    saveTasks();
    renderTasks();
  }
}

// Inicializa a renderização
renderTasks();
