import { Task } from "../types/task";

export type FilterMode = "all" | "completed" | "incomplete";

export type SortMode = "default" | "title-asc" | "title-desc";

export const FILTERS: { value: FilterMode; label: string }[] = [
    { value: "all", label: "all" },
    { value: "completed", label: "completed" },
    { value: "incomplete", label: "incomplete" },
];

export const SORTS: { value: SortMode; label: string }[] = [
    { value: "default", label: "sort" },
    { value: "title-asc", label: "a-z" },
    { value: "title-desc", label: "z-a" },
];

export function getVisibleTasks(params: {
    tasks: Task[];
    filterMode: FilterMode;
    sortMode: SortMode;
    searchQuery: string;
}): Task[] {
    const { tasks, filterMode, sortMode, searchQuery } = params;

    let result: Task[];
    switch (filterMode) {
        case "completed":
            result = tasks.filter((t) => t.completed);
            break;
        case "incomplete":
            result = tasks.filter((t) => !t.completed);
            break;
        default:
            result = tasks;
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
        result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    if (!result.length) return result;

    switch (sortMode) {
        case "title-asc":
            return [...result].sort((a, b) => a.title.localeCompare(b.title));
        case "title-desc":
            return [...result].sort((a, b) => b.title.localeCompare(a.title));
        default:
            return result;
    }
}
