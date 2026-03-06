import { useEffect, useRef, useState } from "react";

export type TodoStats = {
    addedAllTime: number;
    deletedAllTime: number;
};

export function useTodoStats(params: {
    currentCount: number;
    isReady: boolean;
}) {
    const { currentCount, isReady } = params;

    const [stats, setStats] = useState<TodoStats>({
        addedAllTime: 0,
        deletedAllTime: 0,
    });

    const initializedRef = useRef(false);

    useEffect(() => {
        if (!isReady) return;
        if (initializedRef.current) return;

        setStats({
            addedAllTime: currentCount,
            deletedAllTime: 0,
        });

        initializedRef.current = true;
    }, [currentCount, isReady]);

    const bumpAdded = (delta: number) => {
        setStats((prev) => ({
            ...prev,
            addedAllTime: prev.addedAllTime + delta,
        }));
    };

    const bumpDeleted = (delta: number) => {
        setStats((prev) => ({
            ...prev,
            deletedAllTime: prev.deletedAllTime + delta,
        }));
    };

    return { stats, bumpAdded, bumpDeleted };
}
