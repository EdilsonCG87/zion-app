function TopSongs({
    topSongs,
    showTopSongs,
    setShowTopSongs
}) {

    const maxTimesPlayed =
        topSongs.length > 0
            ? Math.max(
                ...topSongs.map(
                    song => song.timesPlayed || 0
                )
            )
            : 0;

    return (

        <div className="top-songs-card">

            <h3
                className="top-songs-title"
                onClick={() =>
                    setShowTopSongs(!showTopSongs)
                }
            >

                ⭐ Canciones más usadas

                <span>
                    {showTopSongs ? "▼" : "►"}
                </span>

            </h3>


            {showTopSongs && (

                topSongs.length === 0 ? (

                    <p className="top-songs-empty">
                        No hay estadísticas
                    </p>

                ) : (

                    <div className="top-songs-list">

                        {topSongs.map(
                            (song, index) => {

                                const timesPlayed =
                                    song.timesPlayed || 0;

                                const percentage =
                                    maxTimesPlayed > 0
                                        ? (
                                            timesPlayed /
                                            maxTimesPlayed
                                        ) * 100
                                        : 0;

                                return (

                                    <div
                                        key={song.id}
                                        className="top-song-item"
                                    >

                                        <div className="top-song-header">

                                            <span>
                                                {index + 1}.{" "}
                                                {song.name}
                                            </span>

                                            <span>
                                                {timesPlayed}
                                            </span>

                                        </div>

                                        <div className="top-song-bar">

                                            <div
                                                className="top-song-fill"
                                                style={{
                                                    width:
                                                        `${percentage}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )

            )}

        </div>

    );
}

export default TopSongs;