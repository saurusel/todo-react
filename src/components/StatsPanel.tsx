type Props = {
    currentCount: number;
    deletedAllTime: number;
    addedAllTime: number;
};

export function StatsPanel({
    currentCount,
    deletedAllTime,
    addedAllTime,
}: Props) {
    return (
        <section className="stats-panel">
            <div className="stats-row">
                <span className="stats-label">Current tasks count:</span>
                <span className="stats-value">{currentCount}</span>
            </div>

            <div className="stats-row">
                <span className="stats-label">Deleted tasks all time:</span>
                <span className="stats-value">{deletedAllTime}</span>
            </div>

            <div className="stats-row">
                <span className="stats-label">Added tasks all time:</span>
                <span className="stats-value">{addedAllTime}</span>
            </div>
        </section>
    );
}
