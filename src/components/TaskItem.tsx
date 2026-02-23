import { Task } from "../types/task";

type Props = {
    task: Task;
    onToggle?(id: number, completed: boolean): void;
    onEdit?(id: number): void;
    onDelete?(id: number): void;
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
    return (
        <li className="todo-item" data-id={task.id}>
            <label className="todo-main">
                <input
                    className="checkbox-input"
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onToggle?.(task.id, e.target.checked)}
                />
                <span className="checkbox-box">
                    <img src="/icons/check-mark.svg" alt="" />
                </span>

                <span className="todo-text">
                    {task.title}
                </span>
            </label>

            <div className="todo-actions">
                <button
                    className="todo-actions-icon icon-edit"
                    type="button"
                    onClick={() => onEdit?.(task.id)}
                >
                    <img className="icon-img" src="/icons/edit.svg" alt="" />
                </button>

                <button
                    className="todo-actions-icon icon-delete"
                    type="button"
                    onClick={() => onDelete?.(task.id)}
                >
                    <img className="icon-img" src="/icons/trash.svg" alt="" />
                </button>
            </div>
        </li>
    );
}
