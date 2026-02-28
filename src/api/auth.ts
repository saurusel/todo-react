import { http } from "./http";

export async function login(login: string, password: string): Promise<void> {
    await http.post("/login", { login, password });
}
