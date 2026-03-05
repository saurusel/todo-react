import { createServer, Response } from "miragejs";
import dbJson from "./db.json";
import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_VALUE,
} from "../src/shared/constants/auth";
import { Task } from "../src/types/task";

const logsEnabled = process.env.APP_LOGS === "1";

function mlog(...args: unknown[]) {
    if (logsEnabled) console.log("[mirage]", ...args);
}

type DbShape = { tasks: Task[] };

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

export function makeServer() {
    mlog("starting server");

    const initialData: DbShape = dbJson;

    return createServer({
        seeds(server) {
            server.db.loadData(initialData);
            mlog("tasks seeded:", server.db.tasks.length);
        },

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

                return { tasks: schema.db.tasks };
            });

            // CREATE
            this.post("/tasks", (schema, request) => {
                mlog("POST /api/tasks", request.requestBody);
                const authErr = requireAuth(request);
                if (authErr) return authErr;

                const body = JSON.parse(request.requestBody) as {
                    title: string;
                };

                const newTask: Task = {
                    id: Date.now(),
                    title: body.title,
                    completed: false,
                };

                schema.db.tasks.insert(newTask);
                return { task: newTask };
            });

            // UPDATE
            this.patch("/tasks/:id", (schema, request) => {
                const authErr = requireAuth(request);
                if (authErr) return authErr;

                const id = Number(request.params.id);
                mlog("PATCH /api/tasks/" + id, request.requestBody);

                const patch = JSON.parse(request.requestBody) as Partial<
                    Pick<Task, "title" | "completed">
                >;

                const updated = schema.db.tasks.update(id, patch);
                return { task: updated };
            });

            // DELETE
            this.delete("/tasks/:id", (schema, request) => {
                const authErr = requireAuth(request);
                if (authErr) return authErr;

                const id = Number(request.params.id);
                mlog("DELETE /api/tasks/" + id);

                schema.db.tasks.remove(id);
                return new Response(204);
            });
        },
    });
}
