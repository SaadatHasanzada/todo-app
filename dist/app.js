"use strict";
class ToDoApp {
    constructor() {
        this.tasks = [
            { id: 1, value: "Read a book", completed: false },
            { id: 2, value: "10 minutes meditation", completed: true },
        ];
        this.filter = "all";
        this.listEl = document.getElementById("toDoList");
        this.notFound = document.querySelector(".no-item-found");
        this.inputEl = document.getElementById("todoInput");
        this.allBtns = document.querySelectorAll("#all");
        this.activeBtns = document.querySelectorAll("#active");
        this.completedBtns = document.querySelectorAll("#completed");
        this.filterButtons = document.querySelectorAll(".filter-btn");
        this.itemsLeftElement = document.querySelector(".left-items");
        this.clearCompleteditemsBtn = document.querySelector(".clear-completed-items");
        this.inputEl.addEventListener("keyup", (event) => {
            const inputValue = this.inputEl.value.trim();
            if (inputValue.length && event.key === "Enter") {
                this.addTask(inputValue);
            }
        });
        this.allBtns.forEach((el) => {
            el.addEventListener("click", () => this.setFilter("all"));
        });
        this.activeBtns.forEach((el) => {
            el.addEventListener("click", () => this.setFilter("active"));
        });
        this.completedBtns.forEach((el) => {
            el.addEventListener("click", () => this.setFilter("completed"));
        });
        this.clearCompleteditemsBtn.addEventListener("click", () => {
            this.clearCompletedItems();
        });
        this.loadTasks();
        this.loadActiveFilter();
        this.render();
    }
    addTask(value) {
        const newTask = {
            id: Date.now(),
            value: value,
            completed: false,
        };
        this.tasks.push(newTask);
        this.inputEl.value = "";
        this.saveTasks();
        this.render();
    }
    removeTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.saveTasks();
        this.render();
    }
    toggleTaskCompletion(id) {
        this.tasks = this.tasks.map((task) => {
            if (task.id === id) {
                return Object.assign(Object.assign({}, task), { completed: !task.completed });
            }
            return task;
        });
        this.saveTasks();
        this.render();
    }
    setFilter(filter) {
        this.filter = filter;
        this.filterButtons.forEach((btn) => {
            if (btn.id === filter) {
                btn.classList.add("active");
            }
            else {
                btn.classList.remove("active");
            }
        });
        this.saveActiveFilter();
        this.render();
    }
    getFilteredTasks() {
        switch (this.filter) {
            case "active":
                return this.tasks.filter((task) => !task.completed);
            case "completed":
                return this.tasks.filter((task) => task.completed);
            default:
                return this.tasks;
        }
    }
    updateLeftItems() {
        const activeTaskCount = this.tasks.filter((task) => !task.completed).length;
        this.itemsLeftElement.textContent = `${activeTaskCount} items left`;
    }
    clearCompletedItems() {
        this.tasks = this.tasks.filter((task) => !task.completed);
        this.saveTasks();
        this.render();
    }
    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
    loadTasks() {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }
    saveActiveFilter() {
        localStorage.setItem("active-category", this.filter);
    }
    loadActiveFilter() {
        const savedFilter = localStorage.getItem("active-category");
        this.filter = savedFilter || "all";
        this.setFilter(this.filter);
    }
    render() {
        const tasks = this.getFilteredTasks();
        this.listEl.innerHTML = "";
        if (tasks.length === 0) {
            this.notFound.classList.add("show");
        }
        else {
            this.notFound.classList.remove("show");
            tasks.forEach((task) => {
                const taskElement = document.createElement("li");
                taskElement.draggable = true;
                taskElement.classList.add("todo-item");
                taskElement.innerHTML = `
                        <input class='circle' type="checkbox" ${task.completed ? "checked" : ""}/>
                        <span class="item">${task.value}</span>
                 
                    <button  class="remove-item">
                        <img src="./images/icon-cross.svg" alt="Cross icon" />
                    </button>`;
                const checkedBtn = taskElement.querySelector("input");
                checkedBtn.addEventListener("click", () => {
                    this.toggleTaskCompletion(task.id);
                });
                const removeBtn = taskElement.querySelector("button");
                removeBtn.addEventListener("click", () => {
                    this.removeTask(task.id);
                });
                // Drag event listeners
                taskElement.addEventListener("dragstart", (event) => this.dragStartHandler(event, task.id));
                taskElement.addEventListener("drop", (event) => this.dropHandler(event, task.id));
                taskElement.addEventListener("dragover", (event) => this.dragOverHandler(event));
                this.listEl.appendChild(taskElement);
            });
        }
        this.updateLeftItems();
    }
    //   Drag & Drop handlers
    dragStartHandler(event, id) {
        var _a;
        (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text/plain", `${id}` || "");
        event.dataTransfer.effectAllowed = "move";
    }
    dropHandler(event, id) {
        var _a;
        event.preventDefault();
        const draggedId = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
        if (draggedId && draggedId !== id.toString()) {
            const draggedIndex = this.tasks.findIndex((task) => task.id.toString() === draggedId);
            const targetIndex = this.tasks.findIndex((task) => task.id === id);
            const [draggedTask] = this.tasks.splice(draggedIndex, 1);
            this.tasks.splice(targetIndex, 0, draggedTask);
            this.saveTasks();
            this.render();
        }
    }
    dragOverHandler(event) {
        event.preventDefault();
    }
}
class SwitchTheme {
    constructor() {
        this.targetElement = document.body;
        this.switchButton = this.targetElement.querySelector(".toggle-icon");
        this.switchButton.addEventListener("click", () => {
            this.toggleTheme();
        });
        this.loadTheme();
    }
    toggleTheme() {
        const isDark = this.targetElement.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }
    loadTheme() {
        const savedTheme = localStorage.getItem("theme") || "light";
        if (savedTheme === "dark") {
            this.targetElement.classList.add("dark-mode");
        }
        else {
            this.targetElement.classList.remove("dark-mode");
        }
    }
}
new ToDoApp();
new SwitchTheme();
