// DOM ELEMENT SELECTIONS

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const prioritySelect = document.getElementById("priority-select");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const taskCounter = document.getElementById("task-counter");

let tasks = [
  { id: 1, text: "Do finals", priority: "high", completed: false },
  { id: 2, text: "Beat Zelda OOt", priority: "low", completed: true }
];
let currentFilter = "all";


// Make a new button plz
function handleAddTask(event) {
  event.preventDefault(); // Dont reload it

  const text = todoInput.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    priority: prioritySelect.value,
    completed: false
  };

  tasks.push(newTask);
  todoInput.value = "";
  renderTasks();
}

// list click
function handleTaskListClick(event) {
  const listItem = event.target.closest(".todo-item");
  if (!listItem) return;

  const taskId = Number(listItem.dataset.id);

  // Remove task if you delete it
  if (event.target.classList.contains("delete-btn")) {
    tasks = tasks.filter(function (task) {
      return task.id !== taskId;
    });
  } else {
    // Ekse keep it completed
    tasks = tasks.map(function (task) {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
  }

  renderTasks();
}

function handleFilterChange(event) {
  filterButtons.forEach(function (btn) {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
  currentFilter = event.target.dataset.filter;
  renderTasks();
}

function handleClearCompleted() {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });
  renderTasks();
}

function handleThemeToggle() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  themeToggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
}

function renderTasks() {
  todoList.innerHTML = "";

  const filteredTasks = tasks.filter(function (task) {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    todoList.innerHTML = `<li class="empty-message">No tasks to display in this view.</li>`;
  } else {
    filteredTasks.forEach(function (task) {
      const li = document.createElement("li");
      li.className = `todo-item ${task.completed ? "completed" : ""}`;
      li.dataset.id = task.id;

      li.innerHTML = `
        <div class="todo-left">
          <input type="checkbox" ${task.completed ? "checked" : ""} aria-label="Mark task complete">
          <span class="todo-text">${task.text}</span>
        </div>
        <span class="badge ${task.priority}">${task.priority}</span>
        <button type="button" class="delete-btn" aria-label="Delete task">&times;</button>
      `;

      todoList.appendChild(li);
    });
  }

  const activeCount = tasks.filter(function (task) {
    return !task.completed;
  }).length;
  taskCounter.textContent = `${activeCount} task${activeCount === 1 ? "" : "s"} remaining`;
}

todoForm.addEventListener("submit", handleAddTask);

todoList.addEventListener("click", handleTaskListClick);

filterButtons.forEach(function (button) {
  button.addEventListener("click", handleFilterChange);
});

clearCompletedBtn.addEventListener("click", handleClearCompleted);

themeToggleBtn.addEventListener("click", handleThemeToggle);

renderTasks();
