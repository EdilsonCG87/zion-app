// =========================
// COMPONENTE
// =========================
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

    const handleSelectPlaylist = (e) => {

        const playlistId = e.target.value;

        setSelectedPlaylist(playlistId);

        if (!playlistId) {
            getPlaylistSongs(null);
            return;
        }

        getPlaylistSongs(playlistId);

    };

    return (

        <div className="playlist-card">

            <h2 className="playlist-title">
                🎯 Culto Activo
            </h2>

            <div className="playlist-row">

                <select
                    value={selectedPlaylist}
                    onChange={handleSelectPlaylist}
                >

                    <option value="">
                        Seleccionar culto
                    </option>

                    {Array.isArray(playlists) &&
                        playlists.map((playlist) => (

                            <option
                                key={playlist.id}
                                value={playlist.id}
                            >
                                {playlist.name}
                            </option>

                        ))
                    }

                </select>

            </div>

            {/* =========================
                BOTONES DE ACCIÓN
            ========================= */}

            <div className="active-playlist-actions">

                <button
                    className="action-btn btn-edit"
                    onClick={startEditPlaylist}
                >
                    ✏️ <span>Editar</span>
                </button>

                <button
                    className="action-btn btn-delete"
                    onClick={deletePlaylist}
                >
                    🗑 <span>Eliminar</span>
                </button>

                <button
                    className="action-btn btn-pdf"
                    onClick={exportPlaylistPDF}
                >
                    📄 <span>PDF</span>
                </button>

                <button
                    className="action-btn btn-whatsapp"
                    onClick={shareWhatsApp}
                >
                    📲 <span>WhatsApp</span>
                </button>

            </div>

        </div>

    );

}

export default ActivePlaylist;