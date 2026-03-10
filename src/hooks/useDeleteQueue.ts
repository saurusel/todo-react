import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { deleteTask } from "../api/tasks";
import { Task } from "../types/task";
import {
    DeleteQueueItem,
    DeleteQueueAll,
    DeleteQueueId,
    DeleteQueueSingle,
} from "../types/deleteQueue";
import { UNDO_DELETE_TTL_SECONDS } from "../shared/constants/timers";

export function useDeleteQueue(params: {
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    onDeletedConfirmed?: (count: number) => void;
}) {
    const { tasks, setTasks, onDeletedConfirmed } = params;

    const [deleteQueueItems, setDeleteQueueItems] = useState<DeleteQueueItem[]>(
        [],
    );
    const pendingRef = useRef<DeleteQueueItem[]>([]);

    const SECOND_MS = 1000;
    const UNDO_TTL_MS = UNDO_DELETE_TTL_SECONDS * SECOND_MS;

    useEffect(() => {
        pendingRef.current = deleteQueueItems;
    }, [deleteQueueItems]);

    type IntervalId = ReturnType<typeof setInterval>;
    type TimeoutId = ReturnType<typeof setTimeout>;

    type DeleteTimer = {
        intervalId: IntervalId | null;
        timeoutId: TimeoutId | null;
    };

    const timersRef = useRef<Map<DeleteQueueId, DeleteTimer>>(new Map());

    const clearTimersFor = (taskId: DeleteQueueId) => {
        const t = timersRef.current.get(taskId);
        if (!t) return;

        if (t.timeoutId != null) clearTimeout(t.timeoutId);
        if (t.intervalId != null) clearInterval(t.intervalId);

        timersRef.current.delete(taskId);
    };

    useEffect(() => {
        return () => {
            for (const taskId of timersRef.current.keys())
                clearTimersFor(taskId);
        };
    }, []);

    const deleteAllBtnRef = useRef<HTMLButtonElement | null>(null);

    const shakeDeleteAll = () => {
        const el = deleteAllBtnRef.current;
        if (!el) return;

        el.classList.remove("is-shaking");
        void el.offsetWidth;
        el.classList.add("is-shaking");

        setTimeout(() => {
            el.classList.remove("is-shaking");
        }, 400);
    };

    const restoreTask = (pending: DeleteQueueSingle) => {
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

    const confirmDeleteQueueItem = (taskId: DeleteQueueId) => {
        const pending = pendingRef.current.find((p) => p.taskId === taskId);
        if (!pending) return;

        clearTimersFor(taskId);
        setDeleteQueueItems((prev) => prev.filter((p) => p.taskId !== taskId));

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

        if (typeof taskId !== "number") return;

        deleteTask(taskId)
            .then(() => onDeletedConfirmed?.(1))
            .catch((err) => {
                console.error(err);
                restoreTask(pending);
            });
    };

    const undoDeleteQueueItem = (taskId: DeleteQueueId) => {
        const pending = pendingRef.current.find((p) => p.taskId === taskId);
        if (!pending) return;

        clearTimersFor(taskId);
        setDeleteQueueItems((prev) => prev.filter((p) => p.taskId !== taskId));

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

        const pending: DeleteQueueSingle = {
            taskId: id,
            task,
            index,
            beforeId,
            afterId,
            secondsLeft: UNDO_DELETE_TTL_SECONDS,
        };

        setDeleteQueueItems((prev) => [...prev, pending]);

        const intervalId = setInterval(() => {
            setDeleteQueueItems((prev) => {
                const cur = prev.find((p) => p.taskId === id);
                if (!cur) return prev;

                const nextSeconds = Math.max(0, cur.secondsLeft - 1);

                if (nextSeconds <= 0) {
                    const timer = timersRef.current.get(id);
                    if (timer?.intervalId != null) {
                        clearInterval(timer.intervalId);
                        timer.intervalId = null;
                    }
                }

                return prev.map((p) =>
                    p.taskId === id ? { ...p, secondsLeft: nextSeconds } : p,
                );
            });
        }, SECOND_MS);

        const timeoutId = setTimeout(() => {
            confirmDeleteQueueItem(id);
        }, UNDO_TTL_MS);

        timersRef.current.set(id, { intervalId, timeoutId });
    };

    const handleDeleteAll = () => {
        if (pendingRef.current.length > 0 || tasks.length === 0) {
            shakeDeleteAll();
            return;
        }

        const snapshot = [...tasks];
        setTasks([]);

        const pending: DeleteQueueAll = {
            taskId: "delete-all",
            isDeleteAll: true,
            tasksSnapshot: snapshot,
            secondsLeft: UNDO_DELETE_TTL_SECONDS,
        };

        setDeleteQueueItems([pending]);

        const intervalId = setInterval(() => {
            setDeleteQueueItems((prev) => {
                const cur = prev.find((p) => p.taskId === "delete-all");
                if (!cur) return prev;

                const nextSeconds = Math.max(0, cur.secondsLeft - 1);

                if (nextSeconds <= 0) {
                    const timer = timersRef.current.get("delete-all");
                    if (timer?.intervalId != null) {
                        clearInterval(timer.intervalId);
                        timer.intervalId = null;
                    }
                }

                return prev.map((p) =>
                    p.taskId === "delete-all"
                        ? { ...p, secondsLeft: nextSeconds }
                        : p,
                );
            });
        }, SECOND_MS);

        const timeoutId = setTimeout(() => {
            confirmDeleteQueueItem("delete-all");
        }, UNDO_TTL_MS);

        timersRef.current.set("delete-all", { intervalId, timeoutId });
    };

    return {
        deleteQueueItems,
        undoDeleteQueueItem,
        handleDelete,
        handleDeleteAll,
        deleteAllBtnRef,
    };
}
