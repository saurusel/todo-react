import { BaseModal } from "./BaseModal";

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
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <h1 className="modal-title">{title}</h1>

            <input
                className="modal-input"
                type="text"
                placeholder="Enter your note..."
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
        </BaseModal>
    );
}
