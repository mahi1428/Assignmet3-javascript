const input = document.querySelector("input.todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filterButtons = document.querySelectorAll(".filter");

let currentFilter = "all"; // Default filter

showTodos();

// Generate HTML for a single todo item
function getTodoHtml(todo, index) {
  let checked = todo.status === "completed" ? "checked" : "";
  return `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `;
}

// Display todos based on the current filter
function showTodos() {
  const filteredTodos = todosJson.filter(todo => {
    if (currentFilter === "all") return true;
    return todo.status === currentFilter;
  });

  if (filteredTodos.length === 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = filteredTodos.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

// Add a new todo item
function addTodo() {
  let todo = input.value.trim();
  if (!todo) return;
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

// Add event listener for adding todos with Enter key
input.addEventListener("keyup", e => {
  if (e.key === "Enter") addTodo();
});

// Add event listener for add button
addButton.addEventListener("click", addTodo);

// Update the status of a todo item
function updateStatus(todo) {
  let todoName = todo.parentElement.querySelector('span');
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

// Remove a todo item
function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

// Delete all todo items
deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

// Apply filter and update the display
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    showTodos();
  });
});
