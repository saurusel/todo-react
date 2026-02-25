import { CSSProperties } from "react";

type PendingId = number | "delete-all";

type PendingDelete = {
    taskId: PendingId;
    secondsLeft: number;
};

type Props = {
    pending: PendingDelete;
    onUndo(taskId: PendingId): void;
};

export function UndoDeleteButton({ pending, onUndo }: Props) {
    const seconds = Math.max(0, pending.secondsLeft);
    const elapsed = 5 - seconds;

    const ringStyle: CSSProperties = {
        ["--undo-elapsed" as any]: elapsed,
    };

    return (
        <button
            className="undo-delete"
            type="button"
            onClick={() => onUndo(pending.taskId)}
        >
            <span className="undo-delete-countdown">
                <span className="undo-delete-ring" style={ringStyle}>
                    <svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <circle
                            className="countdown-ring-bg"
                            cx="14"
                            cy="14"
                            r="12"
                            pathLength="100"
                        ></circle>
                        <circle
                            className="countdown-ring-fg"
                            cx="14"
                            cy="14"
                            r="12"
                            pathLength="100"
                        ></circle>
                    </svg>
                </span>

                <span className="undo-delete-seconds">{seconds}</span>
            </span>

            <span className="undo-delete-label">UNDO</span>

            <img
                className="undo-delete-arrow"
                src="/icons/undo-arrow.svg"
                alt=""
            />
        </button>
    );
}
