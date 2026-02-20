import { createServer } from "miragejs";

export function makeServer() {
    console.log("[mirage] starting server");

    return createServer({
        routes() {
            this.namespace = "api";

            this.get("/ping", () => {
                console.log("[mirage] GET /api/ping");
                return { ok: true, message: "pong" };
            });
        },
    });
}
