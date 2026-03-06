import { RefObject } from "react";
import { Theme } from "../../app/theme";
import { FilterMode, SortMode } from "../../app/taskView";
import { Select, SelectOption } from "../Select";
import { InlineSvg } from "../InlineSvg";
import {
    ICON_SEARCH,
    ICON_TRASH,
    ICON_SUN,
    ICON_MOON,
} from "../../shared/assets/icons";
import "./AppHeader.css";

type Props = {
    theme: Theme;
    onToggleTheme(): void;

    searchInput: string;
    onChangeSearch(value: string): void;

    filterMode: FilterMode;
    filterOptions: SelectOption<FilterMode>[];
    isFilterOpen: boolean;
    onToggleFilter(): void;
    onSelectFilter(value: FilterMode): void;

    sortMode: SortMode;
    sortOptions: SelectOption<SortMode>[];
    isSortOpen: boolean;
    onToggleSort(): void;
    onSelectSort(value: SortMode): void;

    deleteAllBtnRef: RefObject<HTMLButtonElement | null>;
    onDeleteAll(): void;
};

export function AppHeader({
    theme,
    onToggleTheme,

    searchInput,
    onChangeSearch,

    filterMode,
    filterOptions,
    isFilterOpen,
    onToggleFilter,
    onSelectFilter,

    sortMode,
    sortOptions,
    isSortOpen,
    onToggleSort,
    onSelectSort,

    deleteAllBtnRef,
    onDeleteAll,
}: Props) {
    return (
        <header className="app-header">
            <h1 className="app-title">todo list</h1>

            <div className="toolbar">
                <div className="input-wrap">
                    <input
                        type="text"
                        className="input input--search"
                        placeholder="Search note..."
                        autoComplete="off"
                        value={searchInput}
                        onChange={(e) => onChangeSearch(e.target.value)}
                    />
                    <span className="input-icon">
                        <InlineSvg className="icon-img" svg={ICON_SEARCH} />
                    </span>
                </div>

                <Select
                    className="filter-select"
                    value={filterMode}
                    options={filterOptions}
                    isOpen={isFilterOpen}
                    onToggle={onToggleFilter}
                    onChange={onSelectFilter}
                />

                <Select
                    className="sort-select"
                    value={sortMode}
                    options={sortOptions}
                    isOpen={isSortOpen}
                    onToggle={onToggleSort}
                    onChange={onSelectSort}
                />

                <button
                    ref={deleteAllBtnRef}
                    className="delete-all-btn"
                    type="button"
                    onClick={onDeleteAll}
                >
                    <InlineSvg className="icon-img" svg={ICON_TRASH} />
                    <span className="delete-all-label">delete all</span>
                </button>

                <button
                    className="icon-btn"
                    type="button"
                    onClick={onToggleTheme}
                >
                    <InlineSvg
                        className="icon-img"
                        svg={theme === "dark" ? ICON_SUN : ICON_MOON}
                    />
                </button>
            </div>
        </header>
    );
}
