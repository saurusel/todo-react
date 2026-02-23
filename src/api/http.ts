import axios from "axios";

export const http = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
});

const logsEnabled = process.env.APP_LOGS === "1";

http.interceptors.request.use((config) => {
    if (logsEnabled) {
        const method = (config.method || "get").toUpperCase();
        const url = config.url;
        const data = config.data ?? "";
        console.log("[http →]", method, url, data);
    }
    return config;
});

http.interceptors.response.use(
    (res) => {
        if (logsEnabled) {
            const url = res.config.url || "";
            const data = res.data ?? "";
            console.log("[http ←]", res.status, url, data);
        }
        return res;
    },
    (err) => {
        const status = err?.response?.status;
        const url = err?.config?.url;
        const payload = err?.response?.data;
        const message = err?.message;
        console.error("[http ✖]", status, url, payload ?? message);
        return Promise.reject(err);
    },
);
