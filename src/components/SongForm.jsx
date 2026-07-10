function SongForm({
name,
setName,
author,
setAuthor,
keyTone,
setKeyTone,
bpm,
setBpm,
saveSong,
editingId
}) {
return (
    <div className="form-container">
    <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={({ target }) => setName(target.value)}
    />

    <input
        type="text"
        placeholder="Autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
    />

    <input
        type="text"
        placeholder="Tono"
        value={keyTone}
        onChange={(e) => setKeyTone(e.target.value)}
    />

    <input
        type="number"
        placeholder="BPM"
        value={bpm}
        onChange={(e) => setBpm(e.target.value)}
    />

    <button
    type="button"
    className="save-btn"
    onClick={saveSong}
    >
        {editingId ? "Actualizar" : "Guardar"}
    </button>
    </div>
);
}

export default SongForm;