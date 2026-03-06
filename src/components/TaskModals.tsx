import { Modal } from "./Modal/Modal";
import { ErrorModal } from "./Modal/ErrorModal";

type Props = {
    isAddOpen: boolean;
    newTitle: string;
    onChangeNewTitle(value: string): void;
    onCloseAdd(): void;
    onApplyAdd(): void;
    isAddApplyDisabled: boolean;

    isEditOpen: boolean;
    editTitle: string;
    onChangeEditTitle(value: string): void;
    onCloseEdit(): void;
    onApplyEdit(): void;
    isEditApplyDisabled: boolean;

    isErrorOpen: boolean;
    errorMessage: string;
    onCloseError(): void;
};

export function TaskModals({
    isAddOpen,
    newTitle,
    onChangeNewTitle,
    onCloseAdd,
    onApplyAdd,
    isAddApplyDisabled,

    isEditOpen,
    editTitle,
    onChangeEditTitle,
    onCloseEdit,
    onApplyEdit,
    isEditApplyDisabled,

    isErrorOpen,
    errorMessage,
    onCloseError,
}: Props) {
    return (
        <>
            <Modal
                isOpen={isAddOpen}
                title="ADD TODO"
                value={newTitle}
                onChange={onChangeNewTitle}
                onClose={onCloseAdd}
                onApply={onApplyAdd}
                isApplyDisabled={isAddApplyDisabled}
            />

            <Modal
                isOpen={isEditOpen}
                title="EDIT TODO"
                value={editTitle}
                onChange={onChangeEditTitle}
                onClose={onCloseEdit}
                onApply={onApplyEdit}
                isApplyDisabled={isEditApplyDisabled}
            />

            <ErrorModal
                isOpen={isErrorOpen}
                message={errorMessage}
                onClose={onCloseError}
            />
        </>
    );
}
