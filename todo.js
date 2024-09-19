document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  loadTasksFromStorage();

  addTaskBtn.addEventListener('click', addTask);

  darkModeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode');
      saveDarkModePreference();
  });

  filterBtns.forEach(btn => {
      btn.addEventListener('click', filterTasks);
  });


  function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText) {
          const taskDate = new Date().toLocaleDateString();  // Get current date
          const task = createTaskElement(taskText, false, taskDate);
          taskList.appendChild(task);
          saveTaskToStorage(taskText, false, taskDate);  // Save to localStorage
          taskInput.value = '';
      }
  }

  // Create Task Element
  function createTaskElement(text, completed = false, date) {
      const li = document.createElement('li');
      li.classList.toggle('completed', completed);  // Toggle completed class if task is completed
      li.innerHTML = `
          <span class="task-text">${text}</span>
          <span class="task-date">${date}</span>
          <button class="complete-btn">Complete</button>
          <button class="delete-btn">Delete</button>
      `;

      // Complete button functionality
      li.querySelector('.complete-btn').addEventListener('click', () => {
          li.classList.toggle('completed');
          updateTaskInStorage(text, li.classList.contains('completed'));
      });

      // Remove task on delete button click
      li.querySelector('.delete-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          taskList.removeChild(li);
          removeTaskFromStorage(text);
      });

      return li;
  }

  // Filter Tasks
  function filterTasks(e) {
      const filter = e.target.getAttribute('data-filter');
      filterBtns.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      const tasks = taskList.querySelectorAll('li');
      tasks.forEach(task => {
          const isCompleted = task.classList.contains('completed');
          if (filter === 'completed' && !isCompleted) {
              task.style.display = 'none';
          } else if (filter === 'uncompleted' && isCompleted) {
              task.style.display = 'none';
          } else {
              task.style.display = '';
          }
      });
  }

  // Save Task to localStorage
  function saveTaskToStorage(taskText, completed, date) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push({ text: taskText, completed, date });
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Update Task in localStorage
  function updateTaskInStorage(taskText, completed) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const updatedTasks = tasks.map(task => task.text === taskText ? { ...task, completed } : task);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  // Remove Task from localStorage
  function removeTaskFromStorage(taskText) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const updatedTasks = tasks.filter(task => task.text !== taskText);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  // Load Tasks from localStorage
  function loadTasksFromStorage() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => {
          const taskElement = createTaskElement(task.text, task.completed, task.date);
          taskList.appendChild(taskElement);
      });
  }

  // Save Dark Mode Preference
  function saveDarkModePreference() {
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
  }

  // Load Dark Mode Preference
  (function loadDarkModePreference() {
      const darkMode = localStorage.getItem('darkMode');
      if (darkMode === 'enabled') {
          document.body.classList.add('dark-mode');
          darkModeToggle.checked = true;
      }
  })();
});
