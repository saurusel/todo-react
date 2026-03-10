import { Theme } from "../shared/lib/theme";
import { Task } from "../types/task";
import { TaskList } from "./TaskList";
import { InlineSvg } from "./InlineSvg";
import { ICON_PLUS } from "../shared/assets/icons";

type Props = {
    loading: boolean;
    theme: Theme;

    tasks: Task[];
    onToggle(id: number, completed: boolean): void;
    onEdit(id: number): void;
    onDelete(id: number): void;

    onOpenAdd(): void;
    enteringTaskId?: number | null;
};

export function TasksSurface({
    loading,
    theme,
    tasks,
    enteringTaskId,
    onToggle,
    onEdit,
    onDelete,
    onOpenAdd,
}: Props) {
    return (
        <div className="tasks-surface">
            <button className="fab" type="button" onClick={onOpenAdd}>
                <InlineSvg className="icon-img" svg={ICON_PLUS} />
            </button>

            <section className="list-area">
                {loading ? (
                    <div style={{ padding: 16 }}>Loading...</div>
                ) : (
                    <TaskList
                        tasks={tasks}
                        theme={theme}
                        enteringTaskId={enteringTaskId}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
            </section>
        </div>
    );
}
