import { useEffect, useState } from "react";
import { Theme, applyTheme, loadTheme, saveTheme } from "../app/theme";

export function useThemeState() {
    const [theme, setTheme] = useState<Theme>(loadTheme());

    useEffect(() => {
        applyTheme(theme);
        saveTheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
    };

    return { theme, setTheme, toggleTheme };
}
