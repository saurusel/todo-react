import { RefObject } from "react";
import { Theme } from "../app/theme";
import { FilterMode, SortMode } from "../app/taskView";
import { Select } from "./Select";

type Option<T extends string> = { value: T; label: string };

type Props = {
    theme: Theme;
    onToggleTheme(): void;

    searchInput: string;
    onChangeSearch(value: string): void;

    filterMode: FilterMode;
    filterOptions: Option<FilterMode>[];
    isFilterOpen: boolean;
    onToggleFilter(): void;
    onSelectFilter(value: FilterMode): void;

    sortMode: SortMode;
    sortOptions: Option<SortMode>[];
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
    const currentFilter =
        filterOptions.find((f) => f.value === filterMode) || filterOptions[0];

    const currentSort =
        sortOptions.find((s) => s.value === sortMode) || sortOptions[0];

    return (
        <header className="app-header">
            <h1 className="app-title">todo list</h1>

            <div className="toolbar">
                <div className="input-wrap">
                    <input
                        type="text"
                        className="input js-search"
                        placeholder="Search note..."
                        autoComplete="off"
                        value={searchInput}
                        onChange={(e) => onChangeSearch(e.target.value)}
                    />
                    <button className="input-icon-btn" type="button">
                        <img
                            className="icon-img"
                            src="/icons/search.svg"
                            alt=""
                        />
                    </button>
                </div>

                <Select
                    wrapClass="js-filter-select"
                    actionToggle="filter-toggle"
                    actionSet="filter-set"
                    isOpen={isFilterOpen}
                    currentLabel={currentFilter.label}
                    options={filterOptions}
                    onToggle={onToggleFilter}
                    onSelect={(value) => onSelectFilter(value as FilterMode)}
                />

                <Select
                    wrapClass="js-sort-select"
                    actionToggle="sort-toggle"
                    actionSet="sort-set"
                    isOpen={isSortOpen}
                    currentLabel={currentSort.label}
                    options={sortOptions}
                    onToggle={onToggleSort}
                    onSelect={(value) => onSelectSort(value as SortMode)}
                />

                <button
                    ref={deleteAllBtnRef}
                    className="delete-all-btn"
                    type="button"
                    onClick={onDeleteAll}
                >
                    <img className="icon-img" src="/icons/trash.svg" alt="" />
                    <span className="delete-all-label">delete all</span>
                </button>

                <button
                    className="icon-btn js-theme-toggle"
                    type="button"
                    onClick={onToggleTheme}
                >
                    <img
                        className="icon-img"
                        src={
                            theme === "dark"
                                ? "/icons/sun.svg"
                                : "/icons/moon.svg"
                        }
                        alt=""
                    />
                </button>
            </div>
        </header>
    );
}
