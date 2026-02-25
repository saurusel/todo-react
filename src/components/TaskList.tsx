import { Task } from "../types/task";
import { TaskItem } from "./TaskItem";

type Props = {
    tasks: Task[];
    theme: "light" | "dark";
    enteringTaskId?: number | null;
    onToggle?(id: number, completed: boolean): void;
    onEdit?(id: number): void;
    onDelete?(id: number): void;
};

export function TaskList({
    tasks,
    theme,
    enteringTaskId,
    onToggle,
    onEdit,
    onDelete,
}: Props) {
    if (!tasks.length) {
        const emptySrc =
            theme === "dark"
                ? "/photos/empty-dark.svg"
                : "/photos/empty-light.svg";

        return (
            <div className="empty-state">
                <img className="empty-state__img" src={emptySrc} alt="" />
                <div className="empty-state__label">Empty...</div>
            </div>
        );
    }

    return (
        <ul className="todo-list">
            {tasks.map((t) => (
                <TaskItem
                    key={t.id}
                    task={t}
                    isEntering={enteringTaskId === t.id}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
