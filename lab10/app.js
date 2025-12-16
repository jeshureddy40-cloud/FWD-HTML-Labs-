// Simple local + remote task dashboard using localStorage and fetch
// External todos API (read-only for this demo)
const TODOS_API = "https://jsonplaceholder.typicode.com/todos?_limit=5";

const LS_TASKS_KEY = "exp10_tasks";
const LS_PREFS_KEY = "exp10_prefs";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const showCompletedCheckbox = document.getElementById("showCompletedCheckbox");
const filterSelect = document.getElementById("filterSelect");
const loadRemoteBtn = document.getElementById("loadRemoteBtn");
const taskList = document.getElementById("taskList");
const statusMsg = document.getElementById("statusMsg");
const errorMsg = document.getElementById("errorMsg");

let tasks = []; // {id, title, completed, source, priority}
let prefs = {
  showCompleted: false,
  filter: "all"
};

/* ---------- Local Storage Helpers ---------- */

function loadFromStorage() {
  try {
    const storedTasks = JSON.parse(localStorage.getItem(LS_TASKS_KEY) || "[]");
    const storedPrefs = JSON.parse(localStorage.getItem(LS_PREFS_KEY) || "{}");
    if (Array.isArray(storedTasks)) tasks = storedTasks;
    prefs = { ...prefs, ...storedPrefs };
  } catch (e) {
    console.warn("Failed to read from localStorage", e);
  }
}

function saveToStorage() {
  localStorage.setItem(LS_TASKS_KEY, JSON.stringify(tasks));
  localStorage.setItem(LS_PREFS_KEY, JSON.stringify(prefs));
}

/* ---------- DOM Rendering ---------- */

function render() {
  taskList.innerHTML = "";
  errorMsg.textContent = "";

  const filtered = tasks.filter((t) => {
    if (!prefs.showCompleted && t.completed) return false;
    if (prefs.filter === "local" && t.source !== "local") return false;
    if (prefs.filter === "remote" && t.source !== "remote") return false;
    return true;
  });

  if (!filtered.length) {
    const li = document.createElement("li");
    li.textContent = "No tasks to show.";
    taskList.appendChild(li);
    return;
  }

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      toggleCompleted(task.id);
    });

    const titleSpan = document.createElement("span");
    titleSpan.className = "task-title";
    titleSpan.textContent = task.title;

    const badges = document.createElement("span");

    const priorityBadge = document.createElement("span");
    priorityBadge.className = "badge";
    priorityBadge.textContent =
      task.priority === "high" ? "High" : "Normal";
    if (task.priority === "high") {
      priorityBadge.classList.add("badge-high");
    }

    const sourceBadge = document.createElement("span");
    sourceBadge.className = "badge badge-remote";
    sourceBadge.textContent = task.source === "remote" ? "API" : "Local";

    badges.appendChild(priorityBadge);
    badges.appendChild(sourceBadge);

    const actions = document.createElement("span");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      startEditTask(task.id, titleSpan);
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(titleSpan);
    li.appendChild(badges);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  // sync controls with prefs
  showCompletedCheckbox.checked = prefs.showCompleted;
  filterSelect.value = prefs.filter;
}

/* ---------- Task Operations ---------- */

function addTask(title, priority = "normal") {
  const newTask = {
    id: Date.now(),
    title,
    completed: false,
    source: "local",
    priority
  };
  tasks.push(newTask);
  saveToStorage();
  render();
}

function toggleCompleted(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveToStorage();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveToStorage();
  render();
}

function startEditTask(id, titleSpan) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const input = document.createElement("input");
  input.type = "text";
  input.value = task.title;
  input.className = "editable-input";

  titleSpan.replaceWith(input);
  input.focus();

  function finishEdit() {
    const newTitle = input.value.trim();
    if (newTitle) {
      tasks = tasks.map((t) =>
        t.id === id ? { ...t, title: newTitle } : t
      );
      saveToStorage();
    }
    render();
  }

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.blur();
    } else if (e.key === "Escape") {
      render();
    }
  });
}

/* ---------- Fetch external data with error handling ---------- */

async function loadRemoteTasks() {
  statusMsg.textContent = "Loading sample tasks from API…";
  errorMsg.textContent = "";
  loadRemoteBtn.disabled = true;

  try {
    const response = await fetch(TODOS_API);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    const data = await response.json();

    const mapped = data.map((todo) => ({
      id: `api-${todo.id}`,
      title: todo.title,
      completed: todo.completed,
      source: "remote",
      priority: "normal"
    }));

    // merge, avoiding duplicates by id
    const existingIds = new Set(tasks.map((t) => t.id));
    mapped.forEach((t) => {
      if (!existingIds.has(t.id)) tasks.push(t);
    });

    saveToStorage();
    render();
    statusMsg.textContent = "Sample tasks loaded successfully.";
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Failed to load tasks from server.";
    statusMsg.textContent = "Error while loading remote tasks.";
  } finally {
    loadRemoteBtn.disabled = false;
  }
}

/* ---------- Event Listeners ---------- */

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  addTask(title, prioritySelect.value);
  taskInput.value = "";
  statusMsg.textContent = "Task added.";
});

showCompletedCheckbox.addEventListener("change", () => {
  prefs.showCompleted = showCompletedCheckbox.checked;
  saveToStorage();
  render();
});

filterSelect.addEventListener("change", () => {
  prefs.filter = filterSelect.value;
  saveToStorage();
  render();
});

loadRemoteBtn.addEventListener("click", () => {
  loadRemoteTasks();
});

/* ---------- Init ---------- */

loadFromStorage();
render();
statusMsg.textContent = "Dashboard loaded from localStorage.";
