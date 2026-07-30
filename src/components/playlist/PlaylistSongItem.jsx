// =========================
// COMPONENTE
// =========================

function PlaylistSongItem({

    item,

    index,

    song,

    selectedPlaylist,

    moveSong,

    removeSongFromPlaylist

}) {

    return (

        <div className="playlist-row">

            <span>

                <strong>{index + 1}.</strong>{" "}

                {song?.name || "Canción"}

            </span>

            <div
                style={{
                    display: "flex",
                    gap: "8px"
                }}
            >

                <button
                    className="action-btn"
                    title="Subir"
                    onClick={() =>
                        moveSong(index, "up")
                    }
                >
                    ⬆
                </button>

                <button
                    className="action-btn"
                    title="Bajar"
                    onClick={() =>
                        moveSong(index, "down")
                    }
                >
                    ⬇
                </button>

                <button
                    className="action-btn btn-delete"
                    title="Eliminar"
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

}

export default PlaylistSongItem;