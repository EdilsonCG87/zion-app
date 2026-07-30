// =========================
// IMPORTS
// =========================
import PlaylistSongItem from "./PlaylistSongItem";

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

    if (!playlistSongs || playlistSongs.length === 0) {

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

                    <PlaylistSongItem

                        key={item.id}

                        item={item}

                        index={index}

                        song={song}

                        selectedPlaylist={selectedPlaylist}

                        moveSong={moveSong}

                        removeSongFromPlaylist={removeSongFromPlaylist}

                    />

                );

            })}

        </div>

    );

}

export default PlaylistSongs;