import { UndoDeleteButton } from "./UndoDeleteButton";
import { PendingId, PendingDeleteCountdown } from "../types/pendingDelete";

type Props = {
    pendingDeletes: PendingDeleteCountdown[];
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
