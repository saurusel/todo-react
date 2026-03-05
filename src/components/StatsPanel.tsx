type Props = {
    loading: boolean;
    currentCount: number;
    deletedAllTime: number;
    addedAllTime: number;
};

export function StatsPanel({
    loading,
    currentCount,
    deletedAllTime,
    addedAllTime,
}: Props) {
        const value = (v: number) => (loading ? "Loading..." : v);

    return (
        <section className="stats-panel">
            <div className="stats-row">
                <span className="stats-label">Current tasks count:</span>
                <span className="stats-value">{value(currentCount)}</span>
            </div>

            <div className="stats-row">
                <span className="stats-label">Deleted tasks all time:</span>
                <span className="stats-value">{value(deletedAllTime)}</span>
            </div>

            <div className="stats-row">
                <span className="stats-label">Added tasks all time:</span>
                <span className="stats-value">{value(addedAllTime)}</span>
            </div>
        </section>
    );
}
