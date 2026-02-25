import { useRef, useEffect, useState, useMemo } from "react";

import { getTasks, patchTask, deleteTask, createTask } from "./api/tasks";
import { Task } from "./types/task";
import { UndoDeleteStack } from "./components/UndoDeleteStack";
import { TaskList } from "./components/TaskList";
import { Modal } from "./components/Modal";
import { ErrorModal } from "./components/ErrorModal";

type Theme = "light" | "dark";

const THEME_KEY = "todo_theme";

function loadTheme(): Theme {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === "dark" ? "dark" : "light";
}

function saveTheme(theme: Theme) {
    localStorage.setItem(THEME_KEY, theme);
}

type PendingDelete = {
    taskId: number;
    task: Task;
    index: number;
    beforeId: number | null;
    afterId: number | null;
    secondsLeft: number;
};

export function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [theme, setTheme] = useState<Theme>(loadTheme());
    const [loading, setLoading] = useState(true);
    const [newTitle, setNewTitle] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editInitialTitle, setEditInitialTitle] = useState("");

    const [pendingDeletes, setPendingDeletes] = useState<PendingDelete[]>([]);
    const pendingRef = useRef<PendingDelete[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const searchTimerRef = useRef<number | null>(null);

    useEffect(() => {
        pendingRef.current = pendingDeletes;
    }, [pendingDeletes]);

    const timersRef = useRef(
        new Map<
            number,
            { timeoutId: number | null; intervalId: number | null }
        >(),
    );

    useEffect(() => {
        return () => {
            if (searchTimerRef.current !== null) {
                window.clearTimeout(searchTimerRef.current);
            }
        };
    }, []);

    const scheduleSearch = (value: string) => {
        if (searchTimerRef.current !== null) {
            window.clearTimeout(searchTimerRef.current);
        }
        searchTimerRef.current = window.setTimeout(() => {
            setSearchQuery(value);
        }, 300);
    };

    const visibleTasks = useMemo(() => {
        const q = (searchQuery ?? "").trim().toLowerCase();
        if (!q) return tasks;
        return tasks.filter((t) => t.title.toLowerCase().includes(q));
    }, [tasks, searchQuery]);

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

    useEffect(() => {
        return () => {
            for (const [taskId] of timersRef.current) clearTimersFor(taskId);
        };
    }, []);

    const clearTimersFor = (taskId: number) => {
        const t = timersRef.current.get(taskId);
        if (!t) return;

        if (t.timeoutId !== null) window.clearTimeout(t.timeoutId);
        if (t.intervalId !== null) window.clearInterval(t.intervalId);

        timersRef.current.delete(taskId);
    };

    const restoreTask = (pending: PendingDelete) => {
        setTasks((prev) => {
            const beforePos =
                pending.beforeId !== null
                    ? prev.findIndex((t) => t.id === pending.beforeId)
                    : -1;
            if (beforePos !== -1) {
                const pos = beforePos + 1;
                return [
                    ...prev.slice(0, pos),
                    pending.task,
                    ...prev.slice(pos),
                ];
            }

            const afterPos =
                pending.afterId !== null
                    ? prev.findIndex((t) => t.id === pending.afterId)
                    : -1;
            if (afterPos !== -1) {
                const pos = afterPos;
                return [
                    ...prev.slice(0, pos),
                    pending.task,
                    ...prev.slice(pos),
                ];
            }

            const pos = Math.min(Math.max(0, pending.index), prev.length);
            return [...prev.slice(0, pos), pending.task, ...prev.slice(pos)];
        });
    };

    const confirmPendingDelete = (taskId: number) => {
        const pending = pendingRef.current.find((p) => p.taskId === taskId);
        if (!pending) return;

        clearTimersFor(taskId);
        setPendingDeletes((prev) => prev.filter((p) => p.taskId !== taskId));

        deleteTask(taskId).catch((err) => {
            console.error(err);
            // если delete упал — возвращаем на место
            restoreTask(pending);
        });
    };

    const undoPendingDelete = (taskId: number) => {
        const pending = pendingRef.current.find((p) => p.taskId === taskId);
        if (!pending) return;

        clearTimersFor(taskId);
        setPendingDeletes((prev) => prev.filter((p) => p.taskId !== taskId));

        restoreTask(pending);
    };

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
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        setEditingId(id);
        setEditTitle(task.title);
        setEditInitialTitle(task.title);
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (pendingRef.current.some((p) => p.taskId === id)) return;

        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) return;

        const task = tasks[index];
        const beforeId = index > 0 ? tasks[index - 1].id : null;
        const afterId = index < tasks.length - 1 ? tasks[index + 1].id : null;

        setTasks((prev) => prev.filter((t) => t.id !== id));

        const pending: PendingDelete = {
            taskId: id,
            task,
            index,
            beforeId,
            afterId,
            secondsLeft: 5,
        };

        setPendingDeletes((prev) => [...prev, pending]);

        const intervalId = window.setInterval(() => {
            setPendingDeletes((prev) => {
                const cur = prev.find((p) => p.taskId === id);
                if (!cur) return prev;

                const nextSeconds = Math.max(0, cur.secondsLeft - 1);

                if (nextSeconds <= 0) {
                    const timer = timersRef.current.get(id);
                    if (timer?.intervalId != null) {
                        window.clearInterval(timer.intervalId);
                        timer.intervalId = null;
                    }
                }

                return prev.map((p) =>
                    p.taskId === id ? { ...p, secondsLeft: nextSeconds } : p,
                );
            });
        }, 1000);

        const timeoutId = window.setTimeout(() => {
            confirmPendingDelete(id);
        }, 5000);

        timersRef.current.set(id, { intervalId, timeoutId });
    };

    const submitAdd = () => {
        const title = newTitle.trim();
        if (!title) {
            setIsErrorOpen(true);
            return;
        }

        createTask(title)
            .then((created) => {
                setTasks((prev) => [created, ...prev]);
                setNewTitle("");
                setIsAddOpen(false);
            })
            .catch(console.error);
    };

    const submitEdit = () => {
        if (editingId === null) return;

        const nextTitle = editTitle.trim();
        const prevTitle = editInitialTitle;

        if (!nextTitle) {
            setIsErrorOpen(true);
            return;
        }

        if (nextTitle === prevTitle) return;

        setTasks((prev) =>
            prev.map((t) =>
                t.id === editingId ? { ...t, title: nextTitle } : t,
            ),
        );

        patchTask(editingId, { title: nextTitle })
            .then(() => {
                setIsEditOpen(false);
                setEditingId(null);
                setEditTitle("");
                setEditInitialTitle("");
            })
            .catch((err) => {
                console.error(err);
                setTasks((prev) =>
                    prev.map((t) =>
                        t.id === editingId ? { ...t, title: prevTitle } : t,
                    ),
                );
            });
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
                                    onChange={(e) =>
                                        scheduleSearch(e.target.value)
                                    }
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
                            onClick={() => setIsAddOpen(true)}
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
                                    tasks={visibleTasks}
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
            <Modal
                isOpen={isAddOpen}
                title="ADD TODO"
                value={newTitle}
                onChange={setNewTitle}
                onClose={() => setIsAddOpen(false)}
                onApply={submitAdd}
            />

            <Modal
                isOpen={isEditOpen}
                title="EDIT TODO"
                value={editTitle}
                onChange={setEditTitle}
                onClose={() => setIsEditOpen(false)}
                onApply={submitEdit}
                isApplyDisabled={
                    editTitle.trim() === "" ||
                    editTitle.trim() === editInitialTitle.trim()
                }
            />

            <ErrorModal
                isOpen={isErrorOpen}
                message="Слишком мало символов в вашем инпуте"
                onClose={() => setIsErrorOpen(false)}
            />

            <UndoDeleteStack
                pendingDeletes={pendingDeletes}
                onUndo={undoPendingDelete}
            />
        </div>
    );
}
