import { BaseModal } from "./BaseModal";

type Props = {
    isOpen: boolean;
    message: string;
    onClose(): void;
};

export function ErrorModal({ isOpen, message, onClose }: Props) {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
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
        </BaseModal>
    );
}
