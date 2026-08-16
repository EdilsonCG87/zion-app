// =========================
// IMPORTS
// =========================

import { useState } from "react";

import SongForm from "../components/songs/SongForm";
import SongTable from "../components/songs/SongTable";
import SongDetail from "../components/songs/SongDetail";

import SearchBar from "../components/common/SearchBar";
import ImportExcel from "../components/common/ImportExcel";

// =========================
// COMPONENTE
// =========================

function SongsPage({

    songsHook,

    getTopSongs,
    getOverusedSongs,

    // =========================
    // REPORTES
    // =========================

    songHistory,
    getSongHistory

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

    const [selectedSong, setSelectedSong] =
        useState(null);

    // =========================
    // SELECCIONAR CANCIÓN
    // =========================

    const handleSelectSong = async (song) => {

        setSelectedSong(song);

        await getSongHistory(song.id);

    };

    // =========================
    // CERRAR DETALLE
    // =========================

    const handleCloseDetail = () => {

        setSelectedSong(null);

    };

    // =========================
    // HTML
    // =========================

    return (

        <div className="tab-content">

            {/* =========================
                BIBLIOTECA
            ========================= */}

            <div className="playlist-card">

                <h2
                    className="playlist-title"
                    style={{ cursor: "pointer" }}

                    onClick={() =>
                        setShowSongsList(
                            !showSongsList
                        )
                    }
                >

                    🎵 Biblioteca de Canciones
                    ({songs.length})

                    {showSongsList
                        ? " ▼"
                        : " ►"
                    }

                </h2>

            </div>

            {/* =========================
                FORMULARIO
            ========================= */}

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

            {/* =========================
                IMPORTAR EXCEL
            ========================= */}

            <ImportExcel

                onImported={() => {

                    getSongs();

                    getTopSongs();

                    getOverusedSongs();

                }}

            />

            {/* =========================
                BUSCAR
            ========================= */}

            <SearchBar

                search={search}

                setSearch={(value) => {

                    setSearch(value);

                    if (
                        value.trim() !== ""
                    ) {

                        setShowSongsList(true);

                    }

                }}

            />

            {/* =========================
                TABLA
            ========================= */}

            {showSongsList && (

                <SongTable

                    songs={songs}

                    search={search}

                    editSong={editSong}

                    confirmDelete={confirmDelete}

                    toggleFavorite={toggleFavorite}

                    onSelectSong={handleSelectSong}

                />

            )}

            {/* =========================
                DETALLE
            ========================= */}

            {selectedSong && (

                <SongDetail

                    song={selectedSong}

                    songHistory={songHistory}

                    onClose={handleCloseDetail}

                />

            )}

        </div>

    );

}

export default SongsPage;