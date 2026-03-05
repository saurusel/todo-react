import { UndoDeleteButton } from "../UndoDeleteButton";
import { DeleteQueueId, DeleteQueueCountdown } from "../../types/deleteQueue";
import "./UndoDeleteStack.css";

type Props = {
    DeleteQueueItems: DeleteQueueCountdown[];
    onUndo(taskId: DeleteQueueId): void;
};

export function UndoDeleteStack({ DeleteQueueItems, onUndo }: Props) {
    if (!DeleteQueueItems.length) return null;

    return (
        <div className="undo-delete-stack">
            {DeleteQueueItems.map((p) => (
                <UndoDeleteButton key={p.taskId} pending={p} onUndo={onUndo} />
            ))}
        </div>
    );
}
