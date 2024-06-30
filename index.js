async function fetchTasks(page = 1, filters= {}) {
    try{
        const respnse = await fetch ('http://localhost:3000/tasks?_pages&_limits=5');
        if (!respnse.ok) throw new Error('Network respnse was not ok');
        const data = await response.json();
        return data;
    } catch(error){
        console.error('Fetch error:', error);
    }
}

function displayTasks (tasks){
    const app = document.getElementById('app');
    app.innerHTML = '';
    tasks.forEach(tasks => {
        const taskCard = document.createElement('div');
        taskCard.ClassName ='task-card';
        taskCard.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.descriptin}</p>
          <p>Status: ${task.status}</p>
          <p>Due Date: ${new Date(task.dueDate).toLocaleString()}</p>
          <p>Priority:${getPriority(task.dueDate)}</p>
          <button oneClick="editTask(${task.id})">Edit</button>
          <button oneClick="deleteTask(${task.id})">Delete</button>

        `;

        app.appendChild(taskCard);
    });
}

function getPriority(dueDate){
    const now = new Date();
    const due = new Date(dueDate);
    const diff = (due - now) / 1000 / 60;
    if(diff <= 2) return 'High';
    if(diff <= 3) return 'medium';
    return 'Low';

}


async function createTask(task) {
    try {
        const respnse = await fetch('http://localhost:3000/tasks',{
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(task)
        
    });

    if (!respnse.ok) throw new Error('Network respnse was not ok');
    fetchTasks();
   } catch (error){
    console.error('Create error:', error);
   }
}

async function updateTask(id, updates) {
    try {
        const respnse = await fetch('http://localhost:3000/tasks',{
         method: 'PUT',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(updates)
        
    });

    if (!respnse.ok) throw new Error('Network respnse was not ok');
    fetchTasks();
   } catch (error){
    console.error('Update error:', error);
   }
}

async function deleteTask(id) {
    try {
        const respnse = await fetch('http://localhost:3000/tasks',{
         method: 'DELETE'
         
        });

    if (!respnse.ok) throw new Error('Network respnse was not ok');
    fetchTasks();
   } catch (error){
    console.error('Delete error:', error);
   }
}

async function updatePaginationButtons(totalTasks, currentPage = 1){
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(totalTasks / 5);

    paginationContainer.innerHTML = '';

    for(let i = 1; i <= totalPages; i++){
         const button = document.createElement('button');
         button.textContent = i;
         if(i === currentPage){
           button.disabled = true;
         }
         button.addEventListener('click', () => fetchPaginatedTasks(i));
         paginationContainer.appendChild(button);
    }
}

async function fetchTotalTasksCount() {
    try {
        const response = await fetch ('http://localhost:3000/tasks');
        if (!response.ok) throw new Error('Network respnse was not ok');
        const data = await response.json();
        return data.length;
    } catch(error){
        console.error('Fetch error:', error);
        return 0;
    }
    
}

async function fetchPaginatedTasks(page){
    const tasks = await fetchTasks(page);
    displayTasks(tasks);

    const totalTasks = await fetchTotalTasksCount();
    updatePaginationButtons(totalTasks, page);
}

async function fetchFilteredTasks(filter){
    let query = object.keys(filters).map(key => `${key}=${filters[key]}`).join('&');
    const respnse = await fetch ('http://localhost:3000/tasks?${query}');
    if (!respnse.ok) throw new Error('Network respnse was not ok');
    const data = await response.json();
    return data;

}

document.getElementById('task-form').addEventListener('submit', async (event) =>{
    event.preventDefault();

    const title = document.getElementById('title').value;
    const document = document.getElementById('document').value;
    const status = document.getElementById('status').value;
    const dueDate = document.getElementById('dueDate').value;

    const newTask = {
        title,
        descriptin,
        status,
        dueDate
    };

    await createTask(newTask);

    document.getElementById('task-form').reset();
    fetchPaginatedTasks(1);
});






