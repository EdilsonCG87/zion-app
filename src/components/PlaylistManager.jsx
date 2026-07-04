function PlaylistManager({
  playlists,
  selectedPlaylist,
  setSelectedPlaylist,
  getPlaylistSongs,
  deletePlaylist,
  playlistName,
  setPlaylistName,
  serviceDate,
  setServiceDate,
  createPlaylist,
  selectedSong,
  setSelectedSong,
  songs,
  addSongToPlaylist,
  startEditPlaylist,
  exportPlaylistPDF,
  shareWhatsApp
}) {
  
return (
    <div className="playlist-card">

{/* ORDEN DEL CULTO */}

<div className="playlist-card">

  <h2 className="playlist-title">
    🎼 Orden del Culto
  </h2>

{/* CREAR CULTO */}

  <div className="playlist-row">

    <input
      type="text"
      placeholder="Nombre del culto"
      value={playlistName}
      onChange={(e) =>
        setPlaylistName(
          e.target.value
        )
      }
    />

    <input
  type="date"
  value={serviceDate}
  onChange={(e) =>
    setServiceDate(
      e.target.value
    )
  }
/>

<button
  className="action-btn btn-create"
  onClick={createPlaylist}
>
  ➕ Crear Culto
</button>

  </div>

  {/* AGREGAR CANCIÓN */}

  <div className="playlist-row">

    <select
      value={selectedSong}
      onChange={(e) =>
        setSelectedSong(
          e.target.value
        )
      }
    >
      <option value="">
        Selecciona canción
      </option>

      {songs.map((song) => (

        <option
          key={song.id}
          value={song.id}
        >
          {song.name}
        </option>

      ))}
    </select>

    <button
      className="save-btn"
      onClick={addSongToPlaylist}
    >
      Agregar canción
    </button>

  </div>

</div>

    </div>
);

{/* SELECCIONAR CULTO */}

<div className="playlist-row">

    <select
        value={selectedPlaylist}
        onChange={(e) => {

            setSelectedPlaylist(e.target.value);

            getPlaylistSongs(e.target.value);

        }}
    >

        <option value="">
            Selecciona un culto
        </option>

        {playlists.map((playlist) => (

            <option
                key={playlist.id}
                value={playlist.id}
            >

                {playlist.name} - {playlist.serviceDate}

            </option>

        ))}

    </select>

</div>

}

export default PlaylistManager;