function PlaylistHistory({

    songs,

    selectedHistorySong,

    setSelectedHistorySong,

    getSongHistory,

    songHistory

}) {

    return (

        <div className="playlist-card">

            <h2 className="playlist-title">

                📊 Historial de Canciones

            </h2>

            <div className="playlist-row">

                <select

                    value={selectedHistorySong}

                    onChange={(e) => {

                        const songId = e.target.value;

                        setSelectedHistorySong(songId);

                        getSongHistory(songId);

                    }}

                >

                    <option value="">

                        Seleccionar canción

                    </option>

                    {

                        songs.map(song => (

                            <option

                                key={song.id}

                                value={song.id}

                            >

                                {song.name}

                            </option>

                        ))

                    }

                </select>

            </div>

            <div style={{ marginTop: "20px" }}>

                <h3>

                    Veces usada: {songHistory.length}

                </h3>

                {

                    songHistory.length > 0

                        ?

                        songHistory.map((usage, index) => (

                            <div

                                key={index}

                                className="song-card"

                                style={{ marginBottom: "10px" }}

                            >

                                ⛪ {usage.playlist?.name}

                                {" — "}

                                {usage.serviceDate}

                            </div>

                        ))

                        :

                        <p>No hay historial</p>

                }

            </div>

        </div>

    );

}

export default PlaylistHistory;