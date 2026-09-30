//selecting DOM elements , so we are grabbing references to the HTML elements that we need to manipulate
const form = document.querySelector('#taskForm');
const input = document.querySelector('#taskInput');
const list = document.querySelector('#list');
const errorMsg = document.querySelector('#errorMsg');

//local storage, to load the saved tasks from the browser's storage on startup
let tasks = load();

//save the current tasks array to localStorage as a JSON string
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

//retrieve the tasks from localStorage, fallback to an emptyarray if none exist
function load() {
  const raw = localStorage.getItem('tasks');
  return JSON.parse(raw) || [];
}

//convert a single task object into a complete list HTML element
function taskToListItem(task) {
  const li = document.createElement('li');
  li.textContent = task.title;
  li.dataset.id = task.id;

  //add the 'done' class if the task is completed
  if (task.completed) {
    li.classList.add('done');
  }

  //crate and append the delete button inside the list item 
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete');
  li.append(deleteBtn);

  return li;
}

//render function : clear the current list UI and re-draw everything from the array
function renderTasks() {
  //clear the existing items to prevent duplicates on update
  list.innerHTML = '';
  
  //transform task objects into HTML elements and attach them to the list
  tasks
    .map(taskToListItem)
    .forEach(li => list.append(li));
}

//task operations, adding the functions that modify the array
function addTask(title) {
  const newTask = {
    id: String(Date.now()), //generate a unique ID using the current timestampp
    title: title,
    completed: false
  };

  tasks.push(newTask);
  save();
  renderTasks();
}

//filter out a deleted task by its unique ID
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  save();
  renderTasks();
}

//event listners and user input 
//handle a new task from submission and validation
form.addEventListener('submit', (e) => {
  e.preventDefault(); //stop defualt browser page reload on submit
  const text = input.value.trim();

  //input valdiation: reject empty or whitespace only entries
  if (!text) {
    errorMsg.textContent = 'Please enter a task!';
    return;
  }

  errorMsg.textContent = ''; //clear previour error
  addTask(text);
  input.value = ''; //reset input field
});

//event delegation: single click listner on the parent container 
list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return; //exit if the user clicked outside a task item

  const id = li.dataset.id;

  //if the delete button was clicked, remove the task
  if (e.target.classList.contains('delete')) {
    deleteTask(id);
    return;
  }

  //otherwise , toggle the task's completion status
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    save();
    renderTasks();
  }
});

//initial application render
renderTasks();