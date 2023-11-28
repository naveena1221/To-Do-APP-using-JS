
const newTaskForm = document.getElementById("new-task-form");
const taskList = document.getElementById("taskList");

function saveTasksToLocalStorage() {
    const tasks = [];
    const taskElements = document.querySelectorAll("#taskList li label");
    taskElements.forEach(function(taskElement) {
        tasks.push(taskElement.textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", function() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function(taskText) {
        createTask(taskText);
    });

    const taskElements = document.querySelectorAll("#taskList li label");
    const storedCheckboxStates = JSON.parse(localStorage.getItem("checkboxStates")) || {};
    taskElements.forEach(function(taskElement) {
        const taskText = taskElement.textContent;
        if (storedCheckboxStates[taskText]) {
            taskElement.style.textDecoration = "line-through";
            const checkbox = taskElement.parentElement.querySelector("input[type='checkbox']");
            checkbox.checked = true;
        }
    });
    const allTab = document.getElementById("all-tab");
    const pendingTab = document.getElementById("pending-tab");
    const completedTab = document.getElementById("completed-tab");

    function updateTabStyles(activeTab) {
        [allTab, pendingTab, completedTab].forEach(tab => {
            if (tab === activeTab) {
                tab.classList.add('active-tab');
                tab.classList.remove('inactive-tab');
            } else {
                tab.classList.remove('active-tab');
                tab.classList.add('inactive-tab');
            }
        });
    }


    allTab.addEventListener("click", function() {
        const allTasks = document.querySelectorAll("#taskList li");
        allTasks.forEach(task => {
            task.style.display = "flex";
        });
        updateTabStyles(allTab);
        saveTasksToLocalStorage();
    });

    pendingTab.addEventListener("click", function() {
        const pendingTasks = document.querySelectorAll("#taskList li");
        pendingTasks.forEach(task => {
            const checkbox = task.querySelector("input[type='checkbox']");
            if (checkbox && !checkbox.checked) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
            
        });
        updateTabStyles(pendingTab);
            saveTasksToLocalStorage();
    });

    completedTab.addEventListener("click", function() {
        const completedTasks = document.querySelectorAll("#taskList li");
        
        completedTasks.forEach(task => {
            
            const checkbox = task.querySelector("input[type='checkbox']");
            if (checkbox && checkbox.checked) {
                task.style.display = "flex";
                
            } else {
                task.style.display = "none";
            }
            
        });
        updateTabStyles(completedTab);
        saveTasksToLocalStorage();
    });
    updateTabStyles(allTab);
});

function createTask(taskText) {
    const li = document.createElement("li");
    li.style.listStyleType = "none";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.appendChild(checkbox);

    const taskLabel = document.createElement("label");
    taskLabel.textContent = taskText;
    taskLabel.style.width="600px";
    li.appendChild(taskLabel);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.style.backgroundColor="#4380E5";
    li.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.style.backgroundColor="#F0210E";
    li.appendChild(deleteButton);

    taskList.appendChild(li);

    checkbox.addEventListener("change", function() {
        if (this.checked) {
            taskLabel.style.textDecoration = "line-through";
        } else {
            taskLabel.style.textDecoration = "none";
        }
        const storedCheckboxStates = JSON.parse(localStorage.getItem("checkboxStates")) || {};
    storedCheckboxStates[taskLabel.textContent] = this.checked;
    localStorage.setItem("checkboxStates", JSON.stringify(storedCheckboxStates));
    });

    editButton.addEventListener("click", function() {
        const editInput = document.createElement("input");
        editInput.value = taskLabel.textContent;
        editInput.style.width="600px";

        if (editButton.textContent === "Edit") {
            editButton.textContent = "Save";
            li.replaceChild(editInput, taskLabel);

            editButton.addEventListener("click", function saveHandler() {
                taskLabel.textContent = editInput.value;
                
                li.replaceChild(taskLabel, editInput);
                editButton.textContent = "Edit";
                editButton.removeEventListener("click", saveHandler);
                saveTasksToLocalStorage();
            });
        }
    });

    deleteButton.addEventListener("click", function() {
        taskList.removeChild(li);
        saveTasksToLocalStorage();
    });
}

newTaskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskInput = document.getElementById("new-task-input");
    const taskText = taskInput.value.trim();
    const hidden=document.getElementById("hide");

    if (taskText !== "") {
        createTask(taskText);
        saveTasksToLocalStorage();
        taskInput.value = "";
    } else {
        hidden.style.display="block";
        hidden.style.color="red";
        
         taskInput.style.border = "2px solid red"; // Set the border to red if taskText is empty
    }
});
