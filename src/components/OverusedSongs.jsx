function OverusedSongs({

    overusedSongs,

    showOverusedSongs,

    setShowOverusedSongs

}) {

    return (

        <div className="playlist-card">

            <h2

                className="playlist-title"

                style={{ cursor: "pointer" }}

                onClick={() =>

                    setShowOverusedSongs(

                        !showOverusedSongs

                    )

                }

            >

                ⚠️ Canciones Muy Utilizadas

                {" "}

                {

                    showOverusedSongs

                        ? "▼"

                        : "►"

                }

            </h2>

            {

                showOverusedSongs && (

                    <>

                        {

                            overusedSongs.length === 0

                                ?

                                <p>

                                    No hay canciones repetidas

                                </p>

                                :

                                overusedSongs.map(song => (

                                    <div

                                        key={song.id}

                                        className="song-card"

                                    >

                                        🔥 {song.name}

                                        {" — "}

                                        {song.timesPlayed} usos

                                    </div>

                                ))

                        }

                    </>

                )

            }

        </div>

    );

}

export default OverusedSongs;