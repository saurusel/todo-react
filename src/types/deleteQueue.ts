import { Task } from "./task";

export type DeleteQueueId = number | "delete-all";

export type DeleteQueueSingle = {
    taskId: number;
    secondsLeft: number;

    task: Task;
    index: number;
    beforeId: number | null;
    afterId: number | null;
};

export type DeleteQueueAll = {
    taskId: "delete-all";
    secondsLeft: number;

    isDeleteAll: true;
    tasksSnapshot: Task[];
};

export type DeleteQueueItem = DeleteQueueSingle | DeleteQueueAll;

export type DeleteQueueCountdown = {
    taskId: DeleteQueueId;
    secondsLeft: number;
};
