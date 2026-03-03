import { ReactNode, KeyboardEvent, MouseEvent } from "react";

type Props = {
    isOpen: boolean;
    title: string;
    value: string;
    onChange(value: string): void;
    onClose(): void;
    onApply(): void;
    isApplyDisabled?: boolean;
};

export function Modal({
    isOpen,
    title,
    value,
    onChange,
    onClose,
    onApply,
    isApplyDisabled = false,
}: Props) {
    if (!isOpen) return null;

    const stop = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

    return (
        <div className="modal" onMouseDown={onClose}>
            <div className="modal-overlay" />

            <div className="modal-window" onMouseDown={stop}>
                <h1 className="modal-title">{title}</h1>

                <input
                    className="modal-input"
                    type="text"
                    placeholder="Input your note..."
                    value={value}
                    autoFocus
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !isApplyDisabled) onApply();
                    }}
                />

                <div className="modal-actions">
                    <button
                        className="modal-btn modal-btn--ghost"
                        type="button"
                        onClick={onClose}
                    >
                        CANCEL
                    </button>

                    <button
                        className="modal-btn modal-btn--primary"
                        type="button"
                        onClick={onApply}
                        disabled={isApplyDisabled}
                    >
                        APPLY
                    </button>
                </div>
            </div>
        </div>
    );
}
