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
