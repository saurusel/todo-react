import { InlineSvg } from "./InlineSvg";
import { ICON_EDIT, ICON_TRASH } from "../shared/assets/icons";
import { Task } from "../types/task";

type Props = {
    task: Task;
    isEntering?: boolean;
    onToggle?(id: number, completed: boolean): void;
    onEdit?(id: number): void;
    onDelete?(id: number): void;
};

export function TaskItem({ task, isEntering, onToggle, onEdit, onDelete }: Props) {
    return (
        <li className={`todo-item${isEntering ? " is-entering" : ""}`} data-id={task.id}>
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
                    <InlineSvg className="icon-img" svg={ICON_EDIT} />
                </button>

                <button
                    className="todo-actions-icon icon-delete"
                    type="button"
                    onClick={() => onDelete?.(task.id)}
                >
                    <InlineSvg className="icon-img" svg={ICON_TRASH} />
                </button>
            </div>
        </li>
    );
}
