import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "../shared/lib/cookies";
import { ACCESS_TOKEN_COOKIE } from "../shared/constants/auth";

export const http = axios.create({
    baseURL: "/api",
});

const logsEnabled = process.env.APP_LOGS === "1";

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
    onUnauthorized = handler;
};

http.interceptors.request.use((config) => {
    const token = getCookie(ACCESS_TOKEN_COOKIE);

    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>)["Authorization"] =
            `Bearer ${token}`;
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
        const status = err?.response?.status;

        if (status === 401) {
            onUnauthorized?.();
        }

        if (logsEnabled) {
            const url = err?.config?.url;
            const payload = err?.response?.data;
            console.error("[http ✖]", status, url, payload ?? err?.message);
        }
        return Promise.reject(err);
    },
);
