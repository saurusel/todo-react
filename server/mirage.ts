import { createServer, Response } from "miragejs";
import db from "./db.json";
import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_VALUE,
} from "../src/shared/constants/auth";

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

function setAccessTokenCookie() {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(
        ACCESS_TOKEN_VALUE,
    )}; path=/`;
}

function getBearerToken(headers: Record<string, string | undefined>) {
    const raw = headers["Authorization"] ?? headers["authorization"];
    if (!raw) return null;

    const m = raw.match(/^Bearer\s+(.+)$/i);
    return m ? m[1] : null;
}

function requireAuth(request: { requestHeaders: Record<string, string> }) {
    const token = getBearerToken(request.requestHeaders || {});
    if (!token || token !== ACCESS_TOKEN_VALUE) {
        return new Response(401, {}, { message: "you are not authorized" });
    }
    return null;
}

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

            this.post("/login", () => {
                mlog("Login successful");
                setAccessTokenCookie();
                return { ok: true };
            });

            // READ
            this.get("/tasks", (schema, request) => {
                mlog("GET /api/tasks");
                const authErr = requireAuth(request);
                if (authErr) return authErr;
                return { tasks };
            });

            // CREATE
            this.post("/tasks", (schema, request) => {
                mlog("POST /api/tasks", request.requestBody);
                const authErr = requireAuth(request);
                if (authErr) return authErr;

                const body = JSON.parse(request.requestBody);
                const newTask: Task = {
                    id: Date.now(),
                    title: body.title,
                    completed: false,
                };

                tasks = [newTask, ...tasks];
                saveTasks(tasks);

                return { task: newTask };
            });

            // UPDATE
            this.patch("/tasks/:id", (schema, request) => {
                const authErr = requireAuth(request);
                if (authErr) return authErr;

                const id = Number(request.params.id);
                mlog("PATCH /api/tasks/" + id, request.requestBody);
                const patch = JSON.parse(request.requestBody);

                tasks = tasks.map((t) =>
                    t.id === id ? { ...t, ...patch } : t,
                );
                saveTasks(tasks);

                const updated = tasks.find((t) => t.id === id);
                return { task: updated };
            });

            // DELETE
            this.delete("/tasks/:id", (schema, request) => {
                const authErr = requireAuth(request);
                if (authErr) return authErr;

                const id = Number(request.params.id);
                mlog("DELETE /api/tasks/" + id);

                tasks = tasks.filter((t) => t.id !== id);
                saveTasks(tasks);

                return new Response(204);
            });
        },
    });
}
