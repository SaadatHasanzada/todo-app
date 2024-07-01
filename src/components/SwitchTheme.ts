import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";

export class SwitchTheme {
  private targetElement: HTMLBodyElement = document.body! as HTMLBodyElement;
  private switchButton: HTMLDivElement = this.targetElement.querySelector(
    ".toggle-icon"
  )! as HTMLDivElement;

  constructor() {
    this.switchButton.addEventListener("click", () => {
      this.toggleTheme();
    });
    this.loadTheme();
  }
  private toggleTheme() {
    const isDark = this.targetElement.classList.toggle("dark-mode");
    saveToLocalStorage("theme", isDark ? "dark" : "light");
  }
  private loadTheme() {
    const savedTheme = loadFromLocalStorage("theme") || "light";
    if (savedTheme === "dark") {
      this.targetElement.classList.add("dark-mode");
    } else {
      this.targetElement.classList.remove("dark-mode");
    }
  }
}
