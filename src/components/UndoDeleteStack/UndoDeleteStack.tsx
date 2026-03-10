import { UndoDeleteButton } from "../UndoDeleteButton";
import { DeleteQueueId, DeleteQueueCountdown } from "../../types/deleteQueue";
import "./UndoDeleteStack.css";

type Props = {
    deleteQueueItems: DeleteQueueCountdown[];
    onUndo(taskId: DeleteQueueId): void;
};

export function UndoDeleteStack({ deleteQueueItems, onUndo }: Props) {
    if (!deleteQueueItems.length) return null;

    return (
        <div className="undo-delete-stack">
            {deleteQueueItems.map((p) => (
                <UndoDeleteButton key={p.taskId} pending={p} onUndo={onUndo} />
            ))}
        </div>
    );
}
