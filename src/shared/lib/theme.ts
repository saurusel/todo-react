export type Theme = "light" | "dark";

export const THEME_KEY = "todo_theme";

export function loadTheme(): Theme {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === "dark" ? "dark" : "light";
}

export function saveTheme(theme: Theme) {
    localStorage.setItem(THEME_KEY, theme);
}

export function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
}
