import { UndoDeleteButton } from "./UndoDeleteButton";

type PendingId = number | "delete-all";

type PendingDelete = {
    taskId: PendingId;
    secondsLeft: number;
};

type Props = {
    pendingDeletes: PendingDelete[];
    onUndo(taskId: PendingId): void;
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
