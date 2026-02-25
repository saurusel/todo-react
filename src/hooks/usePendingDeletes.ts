import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { deleteTask } from "../api/tasks";
import { Task } from "../types/task";
import {
    PendingDelete,
    PendingDeleteAll,
    PendingId,
    PendingSingleDelete,
} from "../types/pendingDelete";

export function usePendingDeletes(params: {
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    onDeletedConfirmed?: (count: number) => void;
}) {
    const { tasks, setTasks, onDeletedConfirmed } = params;

    const [pendingDeletes, setPendingDeletes] = useState<PendingDelete[]>([]);
    const pendingRef = useRef<PendingDelete[]>([]);

    useEffect(() => {
        pendingRef.current = pendingDeletes;
    }, [pendingDeletes]);

    const timersRef = useRef(
        new Map<
            PendingId,
            { timeoutId: number | null; intervalId: number | null }
        >(),
    );

    const clearTimersFor = (taskId: PendingId) => {
        const t = timersRef.current.get(taskId);
        if (!t) return;

        if (t.timeoutId != null) window.clearTimeout(t.timeoutId);
        if (t.intervalId != null) window.clearInterval(t.intervalId);

        timersRef.current.delete(taskId);
    };

    useEffect(() => {
        return () => {
            for (const [taskId] of timersRef.current) clearTimersFor(taskId);
        };
    }, []);

    const deleteAllBtnRef = useRef<HTMLButtonElement | null>(null);

    const shakeDeleteAll = () => {
        const el = deleteAllBtnRef.current;
        if (!el) return;

        el.classList.remove("is-shaking");
        void el.offsetWidth;
        el.classList.add("is-shaking");

        window.setTimeout(() => {
            el.classList.remove("is-shaking");
        }, 400);
    };

    const restoreTask = (pending: PendingSingleDelete) => {
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

    const confirmPendingDelete = (taskId: PendingId) => {
        const pending = pendingRef.current.find((p) => p.taskId === taskId);
        if (!pending) return;

        clearTimersFor(taskId);
        setPendingDeletes((prev) => prev.filter((p) => p.taskId !== taskId));

        if (pending.taskId === "delete-all") {
            const snapshot = pending.tasksSnapshot;

            (async () => {
                for (const t of snapshot) {
                    await deleteTask(t.id);
                }
                onDeletedConfirmed?.(snapshot.length);
            })().catch((err) => {
                console.error(err);
                setTasks((prev) => [...prev, ...snapshot]);
            });

            return;
        }

        deleteTask(taskId as number)
            .then(() => {
                onDeletedConfirmed?.(1);
            })
            .catch((err) => {
                console.error(err);
                restoreTask(pending);
            });
    };

    const undoPendingDelete = (taskId: PendingId) => {
        const pending = pendingRef.current.find((p) => p.taskId === taskId);
        if (!pending) return;

        clearTimersFor(taskId);
        setPendingDeletes((prev) => prev.filter((p) => p.taskId !== taskId));

        if (pending.taskId === "delete-all") {
            setTasks((prev) => [...prev, ...pending.tasksSnapshot]);
            return;
        }

        restoreTask(pending);
    };

    const handleDelete = (id: number) => {
        if (pendingRef.current.some((p) => p.taskId === id)) return;

        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) return;

        const task = tasks[index];
        const beforeId = index > 0 ? tasks[index - 1].id : null;
        const afterId = index < tasks.length - 1 ? tasks[index + 1].id : null;

        setTasks((prev) => prev.filter((t) => t.id !== id));

        const pending: PendingSingleDelete = {
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

    const handleDeleteAll = () => {
        if (pendingRef.current.length > 0 || tasks.length === 0) {
            shakeDeleteAll();
            return;
        }

        const snapshot = [...tasks];
        setTasks([]);

        const pending: PendingDeleteAll = {
            taskId: "delete-all",
            isDeleteAll: true,
            tasksSnapshot: snapshot,
            secondsLeft: 5,
        };

        setPendingDeletes([pending]);

        const intervalId = window.setInterval(() => {
            setPendingDeletes((prev) => {
                const cur = prev.find((p) => p.taskId === "delete-all");
                if (!cur) return prev;

                const nextSeconds = Math.max(0, cur.secondsLeft - 1);

                if (nextSeconds <= 0) {
                    const timer = timersRef.current.get("delete-all");
                    if (timer?.intervalId != null) {
                        window.clearInterval(timer.intervalId);
                        timer.intervalId = null;
                    }
                }

                return prev.map((p) =>
                    p.taskId === "delete-all"
                        ? { ...p, secondsLeft: nextSeconds }
                        : p,
                );
            });
        }, 1000);

        const timeoutId = window.setTimeout(() => {
            confirmPendingDelete("delete-all");
        }, 5000);

        timersRef.current.set("delete-all", { intervalId, timeoutId });
    };

    return {
        pendingDeletes,
        undoPendingDelete,
        handleDelete,
        handleDeleteAll,
        deleteAllBtnRef,
    };
}
