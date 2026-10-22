
function TopSongs({
    topSongs = [],
    showTopSongs,
    setShowTopSongs,
    title = "⭐ Canciones más usadas",
    emptyMessage = "No hay estadísticas"
}) {
    const maxTimesPlayed =
        topSongs.length > 0
            ? Math.max(...topSongs.map(song => song.timesPlayed || 0))
            : 0;

    return (
        <div className="top-songs-card">
            <h3 className="top-songs-title">
                <button
                    type="button"
                    className="top-songs-toggle"
                    onClick={() => setShowTopSongs(!showTopSongs)}
                    aria-expanded={showTopSongs}
                >
                    <span>{title}</span>
                    <span className="top-songs-indicator" aria-hidden="true">
                        {showTopSongs ? "▼" : "►"}
                    </span>
                </button>
            </h3>

            {showTopSongs && (
                topSongs.length === 0 ? (
                    <p className="top-songs-empty">{emptyMessage}</p>
                ) : (
                    <div className="top-songs-list">
                        {topSongs.map((song, index) => {
                            const timesPlayed = song.timesPlayed || 0;
                            const percentage =
                                maxTimesPlayed > 0
                                    ? (timesPlayed / maxTimesPlayed) * 100
                                    : 0;

                            return (
                                <div key={song.id ?? `${song.name}-${index}`} className="top-song-item">
                                    <div className="top-song-header">
                                        <span>{index + 1}. {song.name}</span>
                                        <span>{timesPlayed}</span>
                                    </div>

                                    <div className="top-song-bar">
                                        <div
                                            className="top-song-fill"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
}

export default TopSongs;
