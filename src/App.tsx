import { useMemo, useState } from "react";

import {
    FilterMode,
    SortMode,
    FILTERS,
    SORTS,
    getVisibleTasks,
} from "./app/taskView";

import { useThemeState } from "./hooks/useThemeState";
import { useDebouncedState } from "./hooks/useDebouncedState";
import { useTasks } from "./hooks/useTasks";
import { usePendingDeletes } from "./hooks/usePendingDeletes";

import { UndoDeleteStack } from "./components/UndoDeleteStack";
import { AppHeader } from "./components/AppHeader";
import { TasksSurface } from "./components/TasksSurface";
import { TaskModals } from "./components/TaskModals";

export function App() {
    const { tasks, setTasks, loading, toggleCompleted, addTask, updateTitle } =
        useTasks();

    const { theme, toggleTheme } = useThemeState();

    const {
        value: searchInput,
        setValue: setSearchInput,
        debounced: searchQuery,
    } = useDebouncedState("", 300);

    const [filterMode, setFilterMode] = useState<FilterMode>("all");
    const [sortMode, setSortMode] = useState<SortMode>("default");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const {
        pendingDeletes,
        undoPendingDelete,
        handleDelete,
        handleDeleteAll,
        deleteAllBtnRef,
    } = usePendingDeletes({ tasks, setTasks });

    const visibleTasks = useMemo(() => {
        return getVisibleTasks({ tasks, filterMode, sortMode, searchQuery });
    }, [tasks, filterMode, sortMode, searchQuery]);

    const [newTitle, setNewTitle] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editInitialTitle, setEditInitialTitle] = useState("");

    const handleEdit = (id: number) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        setEditingId(id);
        setEditTitle(task.title);
        setEditInitialTitle(task.title);
        setIsEditOpen(true);
    };

    const closeEdit = () => {
        setIsEditOpen(false);
        setEditingId(null);
        setEditTitle("");
        setEditInitialTitle("");
    };

    const submitAdd = () => {
        const title = newTitle.trim();
        if (!title) {
            setIsErrorOpen(true);
            return;
        }

        addTask(title)
            .then(() => {
                setNewTitle("");
                setIsAddOpen(false);
            })
            .catch(console.error);
    };

    const submitEdit = () => {
        if (editingId === null) return;

        const nextTitle = editTitle.trim();
        const prevTitle = editInitialTitle;

        if (!nextTitle) {
            setIsErrorOpen(true);
            return;
        }

        if (nextTitle === prevTitle.trim()) return;

        updateTitle(editingId, nextTitle, prevTitle)
            .then(() => closeEdit())
            .catch(() => {});
    };

    const isEditApplyDisabled =
        editTitle.trim() === "" || editTitle.trim() === editInitialTitle.trim();

    return (
        <div className="page">
            <div className="container">
                <main className="app">
                    <AppHeader
                        theme={theme}
                        onToggleTheme={toggleTheme}
                        searchInput={searchInput}
                        onChangeSearch={setSearchInput}
                        filterMode={filterMode}
                        filterOptions={FILTERS}
                        isFilterOpen={isFilterOpen}
                        onToggleFilter={() => {
                            setIsFilterOpen((v) => !v);
                            setIsSortOpen(false);
                        }}
                        onSelectFilter={(value) => {
                            setFilterMode(value);
                            setIsFilterOpen(false);
                        }}
                        sortMode={sortMode}
                        sortOptions={SORTS}
                        isSortOpen={isSortOpen}
                        onToggleSort={() => {
                            setIsSortOpen((v) => !v);
                            setIsFilterOpen(false);
                        }}
                        onSelectSort={(value) => {
                            setSortMode(value);
                            setIsSortOpen(false);
                        }}
                        deleteAllBtnRef={deleteAllBtnRef}
                        onDeleteAll={handleDeleteAll}
                    />

                    <TasksSurface
                        loading={loading}
                        theme={theme}
                        tasks={visibleTasks}
                        onToggle={toggleCompleted}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onOpenAdd={() => setIsAddOpen(true)}
                    />
                </main>
            </div>

            <TaskModals
                isAddOpen={isAddOpen}
                newTitle={newTitle}
                onChangeNewTitle={setNewTitle}
                onCloseAdd={() => setIsAddOpen(false)}
                onApplyAdd={submitAdd}
                isEditOpen={isEditOpen}
                editTitle={editTitle}
                onChangeEditTitle={setEditTitle}
                onCloseEdit={closeEdit}
                onApplyEdit={submitEdit}
                isEditApplyDisabled={isEditApplyDisabled}
                isErrorOpen={isErrorOpen}
                errorMessage="Слишком мало символов в вашем инпуте"
                onCloseError={() => setIsErrorOpen(false)}
            />

            <UndoDeleteStack
                pendingDeletes={pendingDeletes}
                onUndo={undoPendingDelete}
            />
        </div>
    );
}
