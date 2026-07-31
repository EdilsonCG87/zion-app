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

    const handleMoveUp = () => {
        moveSong(index, "up");
    };

    const handleMoveDown = () => {
        moveSong(index, "down");
    };

    const handleDelete = () => {
        removeSongFromPlaylist(
            item.id,
            selectedPlaylist
        );
    };

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
                    onClick={handleMoveUp}
                    disabled={index === 0}
                >
                    ⬆
                </button>

                <button
                    className="action-btn"
                    title="Bajar"
                    onClick={handleMoveDown}
                >
                    ⬇
                </button>

                <button
                    className="action-btn btn-delete"
                    title="Eliminar"
                    onClick={handleDelete}
                >
                    🗑
                </button>

            </div>

        </div>

    );

}

export default PlaylistSongItem;