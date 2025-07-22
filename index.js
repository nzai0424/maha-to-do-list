const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const dateInput = document.getElementById("due-date");
const filterButtons = document.querySelectorAll(".filters button");
const searchInput = document.getElementById("search-task");
const toggleBtn = document.getElementById("toggle-mode");

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
  }
  loadTasks();
});

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  toggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function addTask(text, dueDate = "", completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const taskInfo = document.createElement("div");

  const taskText = document.createElement("span");
  taskText.textContent = text;
  taskText.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
    applyFilter();
  });

  const dueDateEl = document.createElement("small");
  if (dueDate) dueDateEl.textContent = `Due: ${dueDate}`;


  taskInfo.appendChild(taskText);
  if (dueDate) taskInfo.appendChild(dueDateEl);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  li.appendChild(taskInfo);
  li.appendChild(deleteBtn);
  list.appendChild(li);

  saveTasks();
}

function saveTasks() {
  const tasks = [];
  list.querySelectorAll("li").forEach(li => {
    const text = li.querySelector("span").textContent;
    const due = li.querySelector("small")?.textContent.replace("Due: ", "") || "";
    const completed = li.classList.contains("completed");
    tasks.push({ text, dueDate: due, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  list.innerHTML = "";
  saved.forEach(task => addTask(task.text, task.dueDate, task.completed));
}

addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  const due = dateInput.value;
  if (text) {
    addTask(text, due);
    input.value = "";
    dateInput.value = "";
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter();
  });
});

function applyFilter() {
  const filter = document.querySelector(".filters button.active").dataset.filter;
  document.querySelectorAll("#task-list li").forEach(li => {
    const isDone = li.classList.contains("completed");
    if (
      filter === "all" ||
      (filter === "active" && !isDone) ||
      (filter === "completed" && isDone)
    ) {
      li.style.display = "flex";
    } else {
      li.style.display = "none";
    }
  });
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  document.querySelectorAll("#task-list li").forEach(li => {
    const text = li.querySelector("span").textContent.toLowerCase();
    li.style.display = text.includes(term) ? "flex" : "none";
  });
});