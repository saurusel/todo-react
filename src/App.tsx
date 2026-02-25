import { useMemo, useRef, useState } from "react";

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
import { StatsPanel } from "./components/StatsPanel";
import { useTodoStats } from "./hooks/useTodoStats";

export function App() {
    const { tasks, setTasks, loading, toggleCompleted, addTask, updateTitle } =
        useTasks();

    const { stats, bumpAdded, bumpDeleted } = useTodoStats({
        currentCount: tasks.length,
        isReady: !loading,
    });

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
    } = usePendingDeletes({ tasks, setTasks, onDeletedConfirmed: bumpDeleted });

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
    const [enteringTaskId, setEnteringTaskId] = useState<number | null>(null);
    const enterTimerRef = useRef<number | null>(null);

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
            .then((created) => {
                bumpAdded(1);
                if (enterTimerRef.current !== null) {
                    window.clearTimeout(enterTimerRef.current);
                }
                setEnteringTaskId(created.id);
                enterTimerRef.current = window.setTimeout(() => {
                    setEnteringTaskId(null);
                }, 300);

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
            <StatsPanel
                currentCount={tasks.length}
                deletedAllTime={stats.deletedAllTime}
                addedAllTime={stats.addedAllTime}
            />

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
                        enteringTaskId={enteringTaskId}
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
