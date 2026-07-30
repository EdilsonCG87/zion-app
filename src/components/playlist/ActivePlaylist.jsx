function ActivePlaylist({

    playlists,
    selectedPlaylist,
    setSelectedPlaylist,
    getPlaylistSongs,
    startEditPlaylist,
    deletePlaylist,
    exportPlaylistPDF,
    shareWhatsApp

}) {

    return (

        <div className="playlist-card">

            <h2 className="playlist-title">
                🎯 Culto Activo
            </h2>

            <div className="playlist-row">

                <select
                    value={selectedPlaylist}
                    onChange={(e) => {

                        const playlistId = e.target.value;

                        setSelectedPlaylist(playlistId);

                        getPlaylistSongs(playlistId);

                    }}
                >

                    <option value="">
                        Seleccionar culto
                    </option>

                    {playlists.map((playlist) => (

                        <option
                            key={playlist.id}
                            value={playlist.id}
                        >
                            {playlist.name}
                        </option>

                    ))}

                </select>

            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap"
                }}
            >

                <button
                    className="action-btn btn-edit"
                    onClick={startEditPlaylist}
                >
                    ✏️ Editar
                </button>

                <button
                    className="action-btn btn-delete"
                    onClick={deletePlaylist}
                >
                    🗑 Eliminar
                </button>

                <button
                    className="action-btn btn-pdf"
                    onClick={exportPlaylistPDF}
                >
                    📄 PDF
                </button>

                <button
                    className="action-btn btn-whatsapp"
                    onClick={shareWhatsApp}
                >
                    📲 WhatsApp
                </button>

            </div>

        </div>

    );

}

export default ActivePlaylist;