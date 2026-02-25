import { Theme } from "../app/theme";
import { Task } from "../types/task";
import { TaskList } from "./TaskList";

type Props = {
    loading: boolean;
    theme: Theme;

    tasks: Task[];
    onToggle(id: number, completed: boolean): void;
    onEdit(id: number): void;
    onDelete(id: number): void;

    onOpenAdd(): void;
};

export function TasksSurface({
    loading,
    theme,
    tasks,
    onToggle,
    onEdit,
    onDelete,
    onOpenAdd,
}: Props) {
    return (
        <div className="tasks-surface">
            <button className="fab" type="button" onClick={onOpenAdd}>
                <img className="icon-img" src="/icons/plus.svg" alt="" />
            </button>

            <section className="list-area">
                {loading ? (
                    <div style={{ padding: 16 }}>Loading...</div>
                ) : (
                    <TaskList
                        tasks={tasks}
                        theme={theme}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
            </section>
        </div>
    );
}
