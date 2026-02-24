import { useEffect, useState } from "react";

import { getTasks, patchTask } from "./api/tasks";
import { Task } from "./types/task";
import { TaskList } from "./components/TaskList";

type Theme = "light" | "dark";

const THEME_KEY = "todo_theme";

function loadTheme(): Theme {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === "dark" ? "dark" : "light";
}

function saveTheme(theme: Theme) {
    localStorage.setItem(THEME_KEY, theme);
}

export function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [theme, setTheme] = useState<Theme>(loadTheme());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.documentElement.classList.toggle(
            "theme-dark",
            theme === "dark",
        );
        saveTheme(theme);
        // console.log("[ui] theme applied:", theme);
    }, [theme]);

    useEffect(() => {
        // console.log("[ui] load tasks...");
        getTasks()
            .then((items) => {
                // console.log("[ui] tasks loaded:", items.length);
                setTasks(items);
            })
            .catch((e) => {
                // console.error("[ui] load tasks error", e);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleToggle = (id: number, completed: boolean) => {
        // console.log("[ui] toggle", { id, completed });
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed } : t)),
        );

        patchTask(id, { completed }).catch((err) => {
            console.error(err);
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, completed: !completed } : t,
                ),
            );
        });
    };

    const handleEdit = (id: number) => {
        // console.log("[ui] edit click", id);
    };

    const handleDelete = (id: number) => {
        // console.log("[ui] delete click", id);
    };

    return (
        <div className="page">
            <div className="container">
                <main className="app">
                    <header className="app-header">
                        <h1 className="app-title">todo list</h1>

                        <div className="toolbar">
                            <div className="input-wrap">
                                <input
                                    type="text"
                                    className="input js-search"
                                    placeholder="Search note..."
                                    autoComplete="off"
                                />
                                <button
                                    className="input-icon-btn"
                                    type="button"
                                >
                                    <img
                                        className="icon-img"
                                        src="/icons/search.svg"
                                        alt=""
                                    />
                                </button>
                            </div>

                            <button
                                className="delete-all-btn"
                                type="button"
                                disabled
                            >
                                <img
                                    className="icon-img"
                                    src="/icons/trash.svg"
                                    alt=""
                                />
                                <span className="delete-all-label">
                                    delete all
                                </span>
                            </button>

                            <button
                                className="icon-btn js-theme-toggle"
                                type="button"
                                onClick={() =>
                                    setTheme((t) =>
                                        t === "dark" ? "light" : "dark",
                                    )
                                }
                            >
                                <img
                                    className="icon-img"
                                    src={
                                        theme === "dark"
                                            ? "/icons/sun.svg"
                                            : "/icons/moon.svg"
                                    }
                                    alt=""
                                />
                            </button>
                        </div>
                    </header>

                    <div className="tasks-surface">
                        <button
                            className="fab"
                            type="button"
                            onClick={() => undefined}
                        >
                            <img
                                className="icon-img"
                                src="/icons/plus.svg"
                                alt=""
                            />
                        </button>

                        <section className="list-area">
                            {loading ? (
                                <div style={{ padding: 16 }}>Loading...</div>
                            ) : (
                                <TaskList
                                    tasks={tasks}
                                    theme={theme}
                                    onToggle={handleToggle}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
