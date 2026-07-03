import SongForm from "../components/SongForm";
import SearchBar from "../components/SearchBar";
import ImportExcel from "../components/ImportExcel";
import SongTable from "../components/SongTable";

function SongsPage({

songs,
search,
setSearch,

name,
setName,

author,
setAuthor,

keyTone,
setKeyTone,

bpm,
setBpm,

editingId,
saveSong,

editSong,

confirmDelete,

toggleFavorite,

showSongsList,

setShowSongsList,

getSongs,

getTopSongs,

getOverusedSongs

}) {

return (

<div className="tab-content">

<div className="playlist-card">

<h2
className="playlist-title"
style={{ cursor: "pointer" }}
onClick={() =>
setShowSongsList(!showSongsList)
}
>

🎵 Biblioteca de Canciones ({songs.length})

{showSongsList ? " ▼" : " ►"}

</h2>

</div>

<SongForm
    name={name}
    setName={setName}

    author={author}
    setAuthor={setAuthor}

    keyTone={keyTone}
    setKeyTone={setKeyTone}

    bpm={bpm}
    setBpm={setBpm}

    saveSong={saveSong}
    editingId={editingId}
/>

<ImportExcel

onImported={() => {

getSongs();

getTopSongs();

getOverusedSongs();

}}

/>

<SearchBar
    search={search}
    setSearch={setSearch}
/>

{showSongsList && (

    <SongTable
        songs={songs}
        search={search}
        editSong={editSong}
        confirmDelete={confirmDelete}
        toggleFavorite={toggleFavorite}
    />

)}

</div>

);

}

export default SongsPage;