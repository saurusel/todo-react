import { MouseEvent } from "react";

type Props = {
    isOpen: boolean;
    message: string;
    onClose(): void;
};

export function ErrorModal({ isOpen, message, onClose }: Props) {
    if (!isOpen) return null;

    const stop = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

    return (
        <div className="modal" onMouseDown={onClose}>
            <div className="modal-overlay" />

            <div className="modal-window" onMouseDown={stop}>
                <h1 className="modal-title">ERROR</h1>
                <div className="modal-message">{message}</div>

                <div className="modal-actions modal-actions-center">
                    <button
                        className="modal-btn modal-btn--primary"
                        type="button"
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
