function SongTable({
    songs,
    search,
    toggleFavorite,
    editSong,
    confirmDelete
}) {

    const searchText = (search ?? "")
        .trim()
        .toLowerCase();

    const filteredSongs = songs.filter((song) => {

        const name = (song.name ?? "")
            .toLowerCase();

        const author = (song.author ?? "")
            .toLowerCase();

        const keyTone = (song.keyTone ?? "")
            .toLowerCase();

        return (
            name.includes(searchText) ||
            author.includes(searchText) ||
            keyTone.includes(searchText)
        );

    });

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

                {filteredSongs.map((song, index) => (

                    <tr key={song.id}>

                        <td>
                            {index + 1}
                        </td>

                        <td>
                            {song.name}
                        </td>

                        <td>
                            {song.author || "-"}
                        </td>

                        <td>
                            {song.keyTone || "-"}
                        </td>

                        <td>
                            {song.bpm || "-"}
                        </td>

                        <td>

                            <button
                                className={
                                    song.favorite
                                        ? "favorite-btn active"
                                        : "favorite-btn"
                                }
                                onClick={() =>
                                    toggleFavorite(song)
                                }
                            >
                                ★
                            </button>

                            <button
                                className="edit-btn"
                                onClick={() =>
                                    editSong(song)
                                }
                            >
                                Editar
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() =>
                                    confirmDelete(song.id)
                                }
                            >
                                Eliminar
                            </button>

                        </td>

                    </tr>

                ))}

                {filteredSongs.length === 0 && (

                    <tr>

                        <td
                            colSpan="6"
                            style={{
                                textAlign: "center",
                                padding: "20px"
                            }}
                        >
                            No se encontraron canciones.
                        </td>

                    </tr>

                )}

            </tbody>

        </table>

    );
}

export default SongTable;