  let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || [];

  function saveTasks() {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }

  function addTask() {
    const input = document.getElementById('taskInput');
    const desc = input.value.trim();
    if (!desc) return;

    const task = { id: Date.now(), desc: desc, column: 'em-aberto' };
    tasks.push(task);
    saveTasks();
    renderTasks();
    input.value = '';
  }

  function renderTasks() {
    ['em-aberto', 'bid', 'em-andamento', 'entregue'].forEach(col => {
      document.getElementById(col).innerHTML = `<h2 class="${col.replace('-', ' ')}">${capitalize(col.replace('-', ' '))}</h2>`;
    });

    tasks.forEach(task => {
      const card = document.createElement('div');
      card.className = 'card';
      card.draggable = true;
      card.ondragstart = drag;
      card.dataset.id = task.id;
      card.innerHTML = `<span>${task.desc}</span> <button onclick="removeTask(${task.id})">X</button>`;
      document.getElementById(task.column).appendChild(card);
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

  function capitalize(str) {
    return str.split(' ').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
  }

  // Inicializa o Kanban com dados do localStorage
  renderTasks();