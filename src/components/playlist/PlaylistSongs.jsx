// =========================
// COMPONENTE
// =========================

function PlaylistSongs({

    playlistSongs,

    songs,

    removeSongFromPlaylist,

    moveSong,

    selectedPlaylist

}) {

    if (playlistSongs.length === 0) {

        return (

            <div className="playlist-card">

                <h2 className="playlist-title">

                    🎵 Canciones del Culto

                </h2>

                <p>No hay canciones agregadas.</p>

            </div>

        );

    }

    return (

        <div className="playlist-card">

            <h2 className="playlist-title">

                🎵 Canciones del Culto

            </h2>

            {playlistSongs.map((item, index) => {

                const song = songs.find(

                    s => s.id === item.songId

                );

                return (

                    <div
                        key={item.id}
                        className="playlist-row"
                    >

                        <span>

                            {index + 1}. {song?.name}

                        </span>

                        <div>

                            <button
                                onClick={() =>
                                    moveSong(
                                        index,
                                        "up"
                                    )
                                }
                            >
                                ⬆
                            </button>

                            <button
                                onClick={() =>
                                    moveSong(
                                        index,
                                        "down"
                                    )
                                }
                            >
                                ⬇
                            </button>

                            <button
                                onClick={() =>
                                    removeSongFromPlaylist(
                                        item.id,
                                        selectedPlaylist
                                    )
                                }
                            >
                                🗑
                            </button>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}

export default PlaylistSongs;