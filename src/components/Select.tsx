type Option = {
    value: string;
    label: string;
};

type Props = {
    wrapClass: string;
    actionToggle: string;
    actionSet: string;
    isOpen: boolean;
    currentLabel: string;
    options: Option[];
    onToggle(): void;
    onSelect(value: string): void;
};

export function Select({
    wrapClass,
    actionToggle,
    actionSet,
    isOpen,
    currentLabel,
    options,
    onToggle,
    onSelect,
}: Props) {
    return (
        <div className={`select-wrap ${wrapClass} ${isOpen ? "is-open" : ""}`}>
            <button
                className="select-btn"
                type="button"
                data-action={actionToggle}
                onClick={onToggle}
            >
                <span className="select-value">{currentLabel}</span>
                <img
                    className="select-icon"
                    src="/icons/chevron-down.svg"
                    alt=""
                />
            </button>

            <ul className="select-menu">
                {options.map((o) => (
                    <li key={o.value}>
                        <button
                            className="select-option"
                            type="button"
                            data-action={actionSet}
                            data-value={o.value}
                            onClick={() => onSelect(o.value)}
                        >
                            {o.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}