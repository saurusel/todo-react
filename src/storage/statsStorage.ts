export type TodoStats = {
    addedAllTime: number;
    deletedAllTime: number;
};

export const STATS_KEY = "todo_stats";

export function hasStatsInLS(): boolean {
    return localStorage.getItem(STATS_KEY) !== null;
}

export function loadStatsFromLS(): TodoStats {
    try {
        const raw = localStorage.getItem(STATS_KEY);
        if (!raw) return { addedAllTime: 0, deletedAllTime: 0 };

        const parsed = JSON.parse(raw);

        return {
            addedAllTime: Number(parsed?.addedAllTime ?? 0),
            deletedAllTime: Number(parsed?.deletedAllTime ?? 0),
        };
    } catch {
        return { addedAllTime: 0, deletedAllTime: 0 };
    }
}

export function saveStatsToLS(stats: TodoStats) {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {}
}
