// =========================
// COMPONENTE DETALLE DE CANCIÓN
// =========================

function SongDetail({
    song,
    songHistory,
    onClose
}) {

    if (!song) {
        return null;
    }

    // =========================
    // DATOS REALES DEL HISTORIAL
    // =========================

    const history = Array.isArray(songHistory)
        ? songHistory
        : [];

    const timesPlayed = history.length;

    const lastPlayed =
        history.length > 0
            ? history[0]?.serviceDate
            : null;

    return (
        <div className="song-detail-card">

            {/* =========================
                ENCABEZADO
            ========================= */}

            <div className="song-detail-header">

                <div>

                    <h3>
                        🎵 Detalle de la canción
                    </h3>

                    <h2>
                        {song.name}
                    </h2>

                </div>

                <button
                    className="song-detail-close"
                    onClick={onClose}
                    title="Cerrar detalle"
                >
                    ✕
                </button>

            </div>

            {/* =========================
                INFORMACIÓN
            ========================= */}

            <div className="song-detail-info">

                <div className="song-detail-item">

                    <span>
                        ✍️ Autor
                    </span>

                    <strong>
                        {song.author || "-"}
                    </strong>

                </div>

                <div className="song-detail-item">

                    <span>
                        🎼 Tono
                    </span>

                    <strong>
                        {song.keyTone || "-"}
                    </strong>

                </div>

                <div className="song-detail-item">

                    <span>
                        🎚️ BPM
                    </span>

                    <strong>
                        {song.bpm || 0}
                    </strong>

                </div>

                <div className="song-detail-item">

                    <span>
                        ⭐ Favorita
                    </span>

                    <strong>
                        {song.favorite
                            ? "Sí"
                            : "No"
                        }
                    </strong>

                </div>

                {/* =========================
                    VECES UTILIZADA
                ========================= */}

                <div className="song-detail-item">

                    <span>
                        🔥 Veces utilizada
                    </span>

                    <strong>
                        {timesPlayed}
                    </strong>

                </div>

                {/* =========================
                    ÚLTIMA VEZ
                ========================= */}

                <div className="song-detail-item">

                    <span>
                        📅 Última vez
                    </span>

                    <strong>
                        {lastPlayed || "-"}
                    </strong>

                </div>

            </div>

            {/* =========================
                HISTORIAL
            ========================= */}

            <div className="song-history-section">

                <h3>
                    📜 Historial de uso
                </h3>

                {history.length === 0 ? (

                    <p className="song-history-empty">
                        Esta canción todavía no tiene
                        historial de uso registrado.
                    </p>

                ) : (

                    <div className="song-history-list">

                        {history.map(
                            (item, index) => (

                                <div
                                    className="song-history-item"
                                    key={
                                        item.id ||
                                        `${item.serviceDate}-${index}`
                                    }
                                >

                                    <div>

                                        <strong>
                                            ⛪{" "}
                                            {item.playlist?.name ||
                                                item.playlistName ||
                                                "Culto"}
                                        </strong>

                                    </div>

                                    <div>

                                        📅{" "}

                                        {item.serviceDate ||
                                            "-"}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default SongDetail;