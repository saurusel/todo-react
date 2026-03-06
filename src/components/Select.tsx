import { InlineSvg } from "./InlineSvg";
import { ICON_CHEVRON_DOWN } from "../shared/assets/icons";

export type SelectOption<T extends string> = {
    value: T;
    label: string;
};

type Props<T extends string> = {
    className?: string;
    value: T;
    options: ReadonlyArray<SelectOption<T>>;

    isOpen: boolean;
    onToggle(): void;

    onChange(value: T): void;
};

export function Select<T extends string>({
    className,
    value,
    options,
    isOpen,
    onToggle,
    onChange,
}: Props<T>) {
    const current = options.find((o) => o.value === value) ?? options[0];
    const currentLabel = current?.label ?? "";

    return (
        <div
            className={`select-wrap ${className ?? ""} ${isOpen ? "is-open" : ""}`}
        >
            <button className="select-btn" type="button" onClick={onToggle}>
                <span className="select-value">{currentLabel}</span>
                <InlineSvg className="select-icon" svg={ICON_CHEVRON_DOWN} />
            </button>

            <ul className="select-menu">
                {options.map((o) => (
                    <li key={o.value}>
                        <button
                            className="select-option"
                            type="button"
                            onClick={() => onChange(o.value)}
                        >
                            {o.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
