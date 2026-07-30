// =========================
// IMPORTS
// =========================
import { useState } from "react";

import SongForm from "../components/songs/SongForm";
import SearchBar from "../components/common/SearchBar";
import SongTable from "../components/songs/SongTable";
import ImportExcel from "../components/ImportExcel";

// =========================
// COMPONENTE
// =========================

function SongsPage({

    songsHook,

    getTopSongs,

    getOverusedSongs

}) {

    // =========================
    // HOOK
    // =========================

    const {

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

        getSongs

    } = songsHook;

    // =========================
    // STATES
    // =========================

    const [showSongsList, setShowSongsList] =
        useState(false);

    // =========================
    // HTML
    // =========================

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

                editingId={editingId}

                saveSong={saveSong}

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