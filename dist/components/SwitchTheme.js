import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage.js";
export class SwitchTheme {
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
        saveToLocalStorage("theme", isDark ? "dark" : "light");
    }
    loadTheme() {
        const savedTheme = loadFromLocalStorage("theme") || "light";
        if (savedTheme === "dark") {
            this.targetElement.classList.add("dark-mode");
        }
        else {
            this.targetElement.classList.remove("dark-mode");
        }
    }
}
