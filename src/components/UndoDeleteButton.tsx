import { InlineSvg } from "./InlineSvg";
import { ICON_COUNTDOWN, ICON_UNDO_ARROW } from "../shared/assets/icons";
import { UNDO_DELETE_TTL_SECONDS } from "../shared/constants/timers";
import { DeleteQueueId, DeleteQueueCountdown } from "../types/deleteQueue";

type Props = {
    pending: DeleteQueueCountdown;
    onUndo(taskId: DeleteQueueId): void;
};

import type { CSSProperties } from "react";

type CssVars = CSSProperties & {
    ["--undo-ttl"]?: number;
};

export function UndoDeleteButton({ pending, onUndo }: Props) {
    const seconds = Math.max(0, pending.secondsLeft);

    const cssVars: CssVars = { "--undo-ttl": UNDO_DELETE_TTL_SECONDS };

    return (
        <button
            className="undo-delete"
            type="button"
            style={cssVars}
            onClick={() => onUndo(pending.taskId)}
        >
            <span className="undo-delete-countdown">
                <span className="undo-delete-ring">
                    <InlineSvg svg={ICON_COUNTDOWN} />
                </span>

                <span className="undo-delete-seconds">{seconds}</span>
            </span>

            <span className="undo-delete-label">UNDO</span>

            <InlineSvg
                className="icon-img undo-delete-arrow"
                svg={ICON_UNDO_ARROW}
            />
        </button>
    );
}
