import { http } from "./http";
import { Task } from "../types/task";

export async function getTasks(): Promise<Task[]> {
    const { data } = await http.get<{ tasks: Task[] }>("/tasks");
    return data.tasks;
}
