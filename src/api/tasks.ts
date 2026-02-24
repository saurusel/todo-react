import { http } from "./http";
import { Task } from "../types/task";

export async function getTasks(): Promise<Task[]> {
    const { data } = await http.get<{ tasks: Task[] }>("/tasks");
    return data.tasks;
}

export async function patchTask(
    id: number,
    patch: Partial<Pick<Task, "title" | "completed">>,
): Promise<Task> {
    const { data } = await http.patch<{ task: Task }>(`/tasks/${id}`, patch);
    return data.task;
}

export async function deleteTask(id: number): Promise<void> {
    await http.delete(`/tasks/${id}`);
}

export async function createTask(title: string): Promise<Task> {
    const { data } = await http.post<{ task: Task }>("/tasks", { title });
    return data.task;
}
