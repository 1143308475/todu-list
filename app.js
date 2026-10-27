const STORAGE_KEY = 'simple-todo-list-v1';
let todos = loadTodos();
let filter = 'all';

const form = document.querySelector('#todoForm');
const titleInput = document.querySelector('#todoTitle');
const dueInput = document.querySelector('#todoDue');
const list = document.querySelector('#todoList');
const emptyState = document.querySelector('#emptyState');
const editDialog = document.querySelector('#editDialog');
const editForm = document.querySelector('#editForm');
let editingId = null;

function loadTodos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveTodos() { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }
function formatDue(value) {
  if (!value) return '无结束时间';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '无结束时间' : `截止 ${date.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
}
function isOverdue(todo) { return !todo.done && todo.due && new Date(todo.due) < new Date(); }
function isSoon(todo) { return !todo.done && todo.due && new Date(todo.due) >= new Date() && new Date(todo.due) - Date.now() < 86400000; }
function visibleTodos() { return todos.filter(todo => filter === 'all' || (filter === 'active' && !todo.done) || (filter === 'completed' && todo.done)); }

function render() {
  list.innerHTML = '';
  const visible = visibleTodos();
  visible.forEach((todo, index) => {
    const item = document.querySelector('#todoTemplate').content.firstElementChild.cloneNode(true);
    item.dataset.id = todo.id;
    item.style.animationDelay = `${Math.min(index * 35, 210)}ms`;
    item.classList.toggle('completed', todo.done);
    item.classList.toggle('overdue', isOverdue(todo));
    item.querySelector('h3').textContent = todo.title;
    item.querySelector('.due-date').textContent = formatDue(todo.due);
    item.querySelector('.due-date').classList.toggle('soon', isSoon(todo) || isOverdue(todo));
    item.querySelector('.status-pill').textContent = isOverdue(todo) ? '已逾期' : '';
    const checkButton = item.querySelector('.check-btn');
    checkButton.setAttribute('aria-label', todo.done ? '标记为未完成' : '标记完成');
    checkButton.setAttribute('aria-pressed', String(todo.done));
    checkButton.addEventListener('click', () => toggleTodo(todo.id));
    item.querySelector('.edit-btn').addEventListener('click', () => editTodo(todo.id));
    item.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));
    list.append(item);
  });
  const done = todos.filter(t => t.done).length;
  document.querySelector('#progressText').textContent = todos.length ? `${Math.round(done / todos.length * 100)}%` : '0%';
  document.querySelector('#progressBar').style.width = todos.length ? `${done / todos.length * 100}%` : '0%';
  document.querySelector('#progressCount').textContent = `${done} / ${todos.length} 已完成`;
  document.querySelector('#allCount').textContent = todos.length;
  document.querySelector('#activeCount').textContent = todos.filter(t => !t.done).length;
  document.querySelector('#completedCount').textContent = done;
  emptyState.hidden = visible.length !== 0;
  document.querySelector('#emptyTitle').textContent = filter === 'completed' ? '还没有已完成的计划' : filter === 'active' ? '太棒了，暂时没有进行中的计划' : '还没有计划';
  document.querySelector('#emptyMessage').textContent = filter === 'all' ? '先添加一件想完成的事情吧。' : '切换到其他分类看看吧。';
}
function addTodo(event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  todos.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, title, due: dueInput.value, done: false, createdAt: Date.now() });
  saveTodos(); form.reset(); render(); titleInput.focus();
}
function toggleTodo(id) { const todo = todos.find(t => t.id === id); if (todo) { todo.done = !todo.done; saveTodos(); render(); } }
function deleteTodo(id) { todos = todos.filter(t => t.id !== id); saveTodos(); render(); }
function editTodo(id) {
  const todo = todos.find(t => t.id === id); if (!todo) return;
  editingId = id;
  document.querySelector('#editTitle').value = todo.title;
  document.querySelector('#editDue').value = todo.due || '';
  editDialog.showModal();
}
document.querySelector('#cancelEdit').addEventListener('click', () => editDialog.close());
editForm.addEventListener('submit', event => {
  event.preventDefault();
  const todo = todos.find(t => t.id === editingId);
  const title = document.querySelector('#editTitle').value.trim();
  if (!todo || !title) return;
  todo.title = title;
  todo.due = document.querySelector('#editDue').value;
  saveTodos();
  editDialog.close();
  render();
});
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => { filter = tab.dataset.filter; document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab)); render(); }));
document.querySelector('#clearCompleted').addEventListener('click', () => { if (todos.some(t => t.done)) { todos = todos.filter(t => !t.done); saveTodos(); render(); } });
form.addEventListener('submit', addTodo);
render();
