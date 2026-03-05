import { http } from "./http";
import { Task } from "../types/task";
import { TASKS_RESOURCE } from "../shared/constants/api";

export async function getTasks(): Promise<Task[]> {
    const { data } = await http.get<{ tasks: Task[] }>(TASKS_RESOURCE);
    return data.tasks;
}

export async function patchTask(
    id: number,
    patch: Partial<Pick<Task, "title" | "completed">>,
): Promise<Task> {
    const { data } = await http.patch<{ task: Task }>(
        `${TASKS_RESOURCE}/${id}`,
        patch,
    );
    return data.task;
}

export async function deleteTask(id: number): Promise<void> {
    await http.delete(`${TASKS_RESOURCE}/${id}`);
}

export async function createTask(title: string): Promise<Task> {
    const { data } = await http.post<{ task: Task }>(TASKS_RESOURCE, { title });
    return data.task;
}
