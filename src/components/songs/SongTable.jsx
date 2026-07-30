function SongTable({
  songs,
  search,
  toggleFavorite,
  editSong,
  confirmDelete
}) {
  return (
    <table>

      <thead>

        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Autor</th>
          <th>Tono</th>
          <th>BPM</th>
          <th>Acciones</th>
        </tr>

      </thead>

      <tbody>

        {songs
          .filter(song =>
            song.name.toLowerCase().includes(search.toLowerCase()) ||
            song.author.toLowerCase().includes(search.toLowerCase()) ||
            song.keyTone.toLowerCase().includes(search.toLowerCase())
          )
          .map((song, index) => (

            <tr key={song.id}>

              <td>{index + 1}</td>

              <td>{song.name}</td>

              <td>{song.author}</td>

              <td>{song.keyTone}</td>

              <td>{song.bpm}</td>

              <td>

                <button
                  className={
                    song.favorite
                      ? "favorite-btn active"
                      : "favorite-btn"
                  }
                  onClick={() => toggleFavorite(song)}
                >
                  ★
                </button>

                <button
                  className="edit-btn"
                  onClick={() => editSong(song)}
                >
                  Editar
                </button>

                <button
                  className="delete-btn"
                  onClick={() => confirmDelete(song.id)}
                >
                  Eliminar
                </button>

              </td>

            </tr>

          ))}

      </tbody>

    </table>
  );
}

export default SongTable;