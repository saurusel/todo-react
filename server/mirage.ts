import { createServer, Response } from "miragejs";
import db from "./db.json";

const logsEnabled = process.env.APP_LOGS === "1";

function mlog(...args: unknown[]) {
    if (logsEnabled) console.log("[mirage]", ...args);
}

type Task = {
    id: number;
    title: string;
    completed: boolean;
};

const TASKS_STORAGE_KEY = "todo_tasks";

function loadTasks(): Task[] {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return (db as any).tasks as Task[];

    try {
        return JSON.parse(raw) as Task[];
    } catch {
        return (db as any).tasks as Task[];
    }
}

function saveTasks(tasks: Task[]) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

export function makeServer() {
    mlog("starting server");

    let tasks: Task[] = loadTasks();
    mlog("tasks loaded:", tasks.length);

    return createServer({
        routes() {
            this.namespace = "api";

            this.get("/ping", () => {
                mlog("GET /api/ping");
                return { ok: true, message: "pong" };
            });

            // READ
            this.get("/tasks", () => {
                mlog("GET /api/tasks");
                return { tasks };
            });

            // CREATE
            this.post("/tasks", (schema, request) => {
                mlog("POST /api/tasks", request.requestBody);

                const body = JSON.parse(request.requestBody);
                const title = body.title?.trim();
                if (!title)
                    return new Response(400, {}, { message: "no title" });

                const newTask = { id: Date.now(), title, completed: false };
                tasks = [newTask, ...tasks];
                saveTasks(tasks);

                return { task: newTask };
            });

            // UPDATE
            this.patch("/tasks/:id", (schema, request) => {
                const id = Number(request.params.id);
                mlog("PATCH /api/tasks/" + id, request.requestBody);
                const patch = JSON.parse(request.requestBody);

                const idx = tasks.findIndex((t) => t.id === id);
                if (idx === -1)
                    return new Response(404, {}, { message: "no task" });

                const current = tasks[idx];
                const next = { ...current, ...patch };

                if (!next.title?.trim())
                    return new Response(400, {}, { message: "no title" });

                tasks = tasks.map((t) => (t.id === id ? next : t));
                saveTasks(tasks);

                return { task: next };
            });

            // DELETE
            this.delete("/tasks/:id", (schema, request) => {
                const id = Number(request.params.id);
                mlog("DELETE /api/tasks/" + id);

                const exists = tasks.some((t) => t.id === id);
                if (!exists)
                    return new Response(404, {}, { message: "no task" });

                tasks = tasks.filter((t) => t.id !== id);
                saveTasks(tasks);

                return new Response(204);
            });
        },
    });
}
