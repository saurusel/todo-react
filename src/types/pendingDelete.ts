import { Task } from "./task";

export type PendingId = number | "delete-all";

export type PendingSingleDelete = {
    taskId: number;
    secondsLeft: number;

    task: Task;
    index: number;
    beforeId: number | null;
    afterId: number | null;
};

export type PendingDeleteAll = {
    taskId: "delete-all";
    secondsLeft: number;

    isDeleteAll: true;
    tasksSnapshot: Task[];
};

export type PendingDelete = PendingSingleDelete | PendingDeleteAll;

export type PendingDeleteCountdown = {
    taskId: PendingId;
    secondsLeft: number;
};
