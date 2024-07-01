import { Task } from "../models/Task";
import { Filter } from "../models/Filter";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";

export class ToDoApp {
  private tasks: Task[] = [
    { id: 1, value: "Read a book", completed: false },
    { id: 2, value: "10 minutes meditation", completed: true },
  ];
  private filter: Filter = "all";
  private listEl: HTMLUListElement = document.getElementById(
    "toDoList"
  )! as HTMLUListElement;
  private notFound: HTMLDivElement = document.querySelector(
    ".no-item-found"
  )! as HTMLDivElement;
  private inputEl: HTMLInputElement = document.getElementById(
    "todoInput"
  )! as HTMLInputElement;
  private allBtns: NodeList = document.querySelectorAll("#all")! as NodeList;
  private activeBtns: NodeList = document.querySelectorAll(
    "#active"
  )! as NodeList;
  private completedBtns: NodeList = document.querySelectorAll(
    "#completed"
  )! as NodeList;
  private filterButtons: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".filter-btn"
  ) as NodeListOf<HTMLElement>;
  private itemsLeftElement: HTMLSpanElement = document.querySelector(
    ".left-items"
  ) as HTMLSpanElement;
  private clearCompleteditemsBtn: HTMLButtonElement = document.querySelector(
    ".clear-completed-items"
  ) as HTMLButtonElement;
  constructor() {
    this.inputEl.addEventListener("keyup", (event: KeyboardEvent) => {
      const inputValue: string = this.inputEl.value.trim();
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
  private addTask(value: string): void {
    const newTask: Task = {
      id: Date.now(),
      value: value,
      completed: false,
    };
    this.tasks.push(newTask);
    this.inputEl.value = "";
    this.saveTasks();
    this.render();
  }
  private removeTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
    this.render();
  }
  private toggleTaskCompletion(id: number): void {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    this.saveTasks();
    this.render();
  }
  private setFilter(filter: Filter): void {
    this.filter = filter;
    this.filterButtons.forEach((btn) => {
      if (btn.id === filter) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    this.saveActiveFilter();
    this.render();
  }
  private getFilteredTasks(): Task[] {
    switch (this.filter) {
      case "active":
        return this.tasks.filter((task) => !task.completed);
      case "completed":
        return this.tasks.filter((task) => task.completed);
      default:
        return this.tasks;
    }
  }
  private updateLeftItems() {
    const activeTaskCount = this.tasks.filter((task) => !task.completed).length;
    this.itemsLeftElement.textContent = `${activeTaskCount} items left`;
  }
  private clearCompletedItems() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.saveTasks();
    this.render();
  }
  private saveTasks(): void {
    saveToLocalStorage("tasks", this.tasks);
  }
  private loadTasks(): void {
    const savedTasks = loadFromLocalStorage("tasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }
  private saveActiveFilter() {
    saveToLocalStorage("active-category", this.filter);
  }
  private loadActiveFilter() {
    const savedFilter: Filter = loadFromLocalStorage(
      "active-category"
    ) as Filter;
    this.filter = savedFilter || "all";
    this.setFilter(this.filter);
  }
  private render(): void {
    const tasks = this.getFilteredTasks();
    this.listEl.innerHTML = "";
    if (tasks.length === 0) {
      this.notFound.classList.add("show");
    } else {
      this.notFound.classList.remove("show");
      tasks.forEach((task) => {
        const taskElement = document.createElement("li");
        taskElement.draggable = true;
        taskElement.classList.add("todo-item");
        taskElement.innerHTML = `
                          <input class='circle' type="checkbox" ${
                            task.completed ? "checked" : ""
                          }/>
                          <span class="item">${task.value}</span>
                   
                      <button  class="remove-item">
                          <img src="./images/icon-cross.svg" alt="Cross icon" />
                      </button>`;
        const checkedBtn = taskElement.querySelector(
          "input"
        ) as HTMLInputElement;

        checkedBtn.addEventListener("click", () => {
          this.toggleTaskCompletion(task.id);
        });
        const removeBtn = taskElement.querySelector(
          "button"
        ) as HTMLButtonElement;
        removeBtn.addEventListener("click", () => {
          this.removeTask(task.id);
        });
        // Drag event listeners
        taskElement.addEventListener("dragstart", (event) =>
          this.dragStartHandler(event, task.id)
        );
        taskElement.addEventListener("drop", (event) =>
          this.dropHandler(event, task.id)
        );
        taskElement.addEventListener("dragover", (event) =>
          this.dragOverHandler(event)
        );

        this.listEl.appendChild(taskElement);
      });
    }
    this.updateLeftItems();
  }
  //   Drag & Drop handlers
  private dragStartHandler(event: DragEvent, id: number): void {
    event.dataTransfer?.setData("text/plain", `${id}` || "");
    event.dataTransfer!.effectAllowed = "move";
  }
  private dropHandler(event: DragEvent, id: number): void {
    event.preventDefault();
    const draggedId = event.dataTransfer?.getData("text/plain");

    if (draggedId && draggedId !== id.toString()) {
      const draggedIndex = this.tasks.findIndex(
        (task) => task.id.toString() === draggedId
      );
      const targetIndex = this.tasks.findIndex((task) => task.id === id);
      const [draggedTask] = this.tasks.splice(draggedIndex, 1);
      this.tasks.splice(targetIndex, 0, draggedTask);

      this.saveTasks();
      this.render();
    }
  }
  private dragOverHandler(event: DragEvent): void {
    event.preventDefault();
  }
}
