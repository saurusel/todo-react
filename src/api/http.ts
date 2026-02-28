import axios from "axios";
import { getCookie } from "../shared/lib/cookies";
import { ACCESS_TOKEN_COOKIE } from "../shared/constants/auth";

export const http = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
});

const logsEnabled = process.env.APP_LOGS === "1";

http.interceptors.request.use((config) => {
    const token = getCookie(ACCESS_TOKEN_COOKIE);

    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }

    if (logsEnabled) {
        const method = (config.method || "get").toUpperCase();
        console.log("[http →]", method, config.url, config.data ?? "");
    }

    return config;
});

http.interceptors.response.use(
    (res) => {
        if (logsEnabled) {
            console.log("[http ←]", res.status, res.config.url, res.data ?? "");
        }
        return res;
    },
    (err) => {
        if (logsEnabled) {
            const status = err?.response?.status;
            const url = err?.config?.url;
            const payload = err?.response?.data;
            console.error("[http ✖]", status, url, payload ?? err?.message);
        }
        return Promise.reject(err);
    },
);
