import { useEffect, useRef, useState } from "react";
import {
    TodoStats,
    hasStatsInLS,
    loadStatsFromLS,
    saveStatsToLS,
} from "../storage/statsStorage";

export function useTodoStats(params: {
    currentCount: number;
    isReady: boolean;
}) {
    const { currentCount, isReady } = params;

    const [stats, setStats] = useState<TodoStats>(() => loadStatsFromLS());
    const hasKeyRef = useRef<boolean>(hasStatsInLS());

    useEffect(() => {
        if (!isReady) return;
        if (hasKeyRef.current) return;

        const init: TodoStats = {
            addedAllTime: 0,
            deletedAllTime: 0,
        };
        setStats(init);
        saveStatsToLS(init);
        hasKeyRef.current = true;
    }, [isReady]);

    const bumpAdded = (delta: number) => {
        setStats((prev) => {
            const next = { ...prev, addedAllTime: prev.addedAllTime + delta };
            saveStatsToLS(next);
            return next;
        });
    };

    const bumpDeleted = (delta: number) => {
        setStats((prev) => {
            const next = {
                ...prev,
                deletedAllTime: prev.deletedAllTime + delta,
            };
            saveStatsToLS(next);
            return next;
        });
    };

    return { stats, bumpAdded, bumpDeleted };
}
