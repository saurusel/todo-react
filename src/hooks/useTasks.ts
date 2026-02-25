import { useEffect, useState } from "react";
import { createTask, getTasks, patchTask } from "../api/tasks";
import { Task } from "../types/task";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTasks()
            .then((items) => setTasks(items))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleCompleted = (id: number, completed: boolean) => {
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

    const addTask = (title: string) => {
        return createTask(title).then((created) => {
            setTasks((prev) => [created, ...prev]);
            return created;
        });
    };

    const updateTitle = (id: number, nextTitle: string, prevTitle: string) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, title: nextTitle } : t)),
        );

        return patchTask(id, { title: nextTitle }).catch((err) => {
            console.error(err);
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, title: prevTitle } : t)),
            );
            throw err;
        });
    };

    return { tasks, setTasks, loading, toggleCompleted, addTask, updateTitle };
}
