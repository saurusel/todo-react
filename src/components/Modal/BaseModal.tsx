import { MouseEvent, ReactNode, useEffect, useRef } from "react";
import "./Modal.css";

type Props = {
    isOpen: boolean;
    onClose(): void;
    children: ReactNode;
};

export function BaseModal({ isOpen, onClose, children }: Props) {
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseRef.current();
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const stop = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

    return (
        <div className="modal" onMouseDown={onClose}>
            <div className="modal-overlay" />
            <div className="modal-window" onMouseDown={stop}>
                {children}
            </div>
        </div>
    );
}
