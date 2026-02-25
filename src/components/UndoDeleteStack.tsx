import { UndoDeleteButton } from "./UndoDeleteButton";

type PendingDelete = {
    taskId: number;
    secondsLeft: number;
};

type Props = {
    pendingDeletes: PendingDelete[];
    onUndo(taskId: number): void;
};

export function UndoDeleteStack({ pendingDeletes, onUndo }: Props) {
    if (!pendingDeletes.length) return null;

    return (
        <div className="undo-delete-stack">
            {pendingDeletes.map((p) => (
                <UndoDeleteButton key={p.taskId} pending={p} onUndo={onUndo} />
            ))}
        </div>
    );
}
