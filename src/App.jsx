// =========================
// IMPORTS
// =========================
import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

import { usePlaylists } from "./hooks/usePlaylists";
import { usePlaylistSongs } from "./hooks/usePlaylistSongs";
import { useDashboard } from "./hooks/useDashboard";
import { useReports } from "./hooks/useReports";
import { useStatistics } from "./hooks/useStatistics";
import { useNextService } from "./hooks/useNextService";
import { useSharePlaylist } from "./hooks/useSharePlaylist";

import DashboardPage from "./pages/DashboardPage";
import PlaylistPage from "./pages/PlaylistPage";
import SongsPage from "./pages/SongsPage";
import AgendaPage from "./pages/AgendaPage";

// =========================
// COMPONENTE APP
// =========================
function App() {

// =========================
// STATES
// =========================

    const [activeTab, setActiveTab] = useState("dashboard");

    const [showTopSongs, setShowTopSongs] = useState(false);

// =========================
// HOOK CANCIONES
// =========================

    const songsHook = useSongs();

    const {
        songs,
        getSongs
    } = songsHook;

// =========================
// HOOK CULTOS
// =========================

    const playlistsHook = usePlaylists();

    const {
        playlists,
        playlistName,
        setPlaylistName,
        serviceDate,
        setServiceDate,
        selectedPlaylist,
        setSelectedPlaylist,
        selectedSong,
        setSelectedSong,
        getPlaylists,
        createPlaylist,
        deletePlaylist,
        startEditPlaylist

    } = playlistsHook;

// =========================
// HOOK CANCIONES DEL CULTO
// =========================

    const playlistSongsHook = usePlaylistSongs();

    const {
        playlistSongs,
        getPlaylistSongs,
        addSongToPlaylist
    } = playlistSongsHook;

// =========================
// REPORTES
// =========================

    const {
        selectedHistorySong,
        setSelectedHistorySong,
        songHistory,
        getSongHistory,
        getYearUsage
    } = useReports();

// =========================
// ESTADÍSTICAS
// =========================

    const {
        topSongs,
        getTopSongs,
        getUnusedSongs,
        getOverusedSongs
    } = useStatistics();

// =========================
// PRÓXIMO CULTO
// =========================

    const {
        nextService,
        daysRemaining
    } = useNextService(playlists);

// =========================
// EXPORTAR / WHATSAPP
// =========================

    const {
        shareWhatsApp,
        exportPlaylistPDF
    } = useSharePlaylist({
        playlists,
        selectedPlaylist,
        playlistSongs,
        songs
    });

// =========================
// CARGA INICIAL
// =========================

    useEffect(() => {
        getSongs();
        getPlaylists();
        getTopSongs();
        getUnusedSongs();
        getOverusedSongs();
        getYearUsage(2026);

    }, []);

// =========================
// RENDER
// =========================

    return (

        <div className="app-container">

            {/* HEADER */}

            <div className="header">

                <img
                    src={logo}
                    alt="Zion Logo"
                    className="logo"
                />

                <div>

                    <h1>ZION Playlist</h1>

                    <p>Gestión inteligente de alabanzas</p>

                </div>

            </div>

            {/* PRÓXIMO CULTO */}

            {nextService && (

                <div className="next-service-alert">

                    🔔 Próximo culto:

                    <strong> {nextService.name}</strong>

                    {" - "}

                    {nextService.serviceDate}

                    {" ("}

                    {daysRemaining}

                    {" días)"}

                </div>

            )}

            {/* DASHBOARD */}

            {activeTab === "dashboard" && (
                <DashboardPage
                    songs={songs}
                    playlists={playlists}
                    topSongs={topSongs}
                    showTopSongs={showTopSongs}
                    setShowTopSongs={setShowTopSongs}
                />
            )}

            {/* AGENDA */}

            {activeTab === "agenda" && (

                <AgendaPage
                    playlists={playlists}
                    playlistSongs={playlistSongs}
                    songs={songs}
                    getPlaylistSongs={getPlaylistSongs}
                />
            )}

            {/* CULTOS */}

            {activeTab === "playlist" && (

                <PlaylistPage
                    playlists={playlists}
                    selectedPlaylist={selectedPlaylist}
                    setSelectedPlaylist={setSelectedPlaylist}
                    getPlaylistSongs={getPlaylistSongs}
                    deletePlaylist={deletePlaylist}
                    playlistName={playlistName}
                    setPlaylistName={setPlaylistName}
                    serviceDate={serviceDate}
                    setServiceDate={setServiceDate}
                    createPlaylist={createPlaylist}
                    selectedSong={selectedSong}
                    setSelectedSong={setSelectedSong}
                    songs={songs}
                    addSongToPlaylist={addSongToPlaylist}
                    startEditPlaylist={startEditPlaylist}
                    exportPlaylistPDF={exportPlaylistPDF}
                    shareWhatsApp={shareWhatsApp}
                    selectedHistorySong={selectedHistorySong}
                    setSelectedHistorySong={setSelectedHistorySong}
                    songHistory={songHistory}
                    getSongHistory={getSongHistory}
                />
            )}

            {/* CANCIONES */}

            {activeTab === "songs" && (
                <SongsPage
                    songsHook={songsHook}
                    getTopSongs={getTopSongs}
                    getOverusedSongs={getOverusedSongs}
                />
            )}

            {/* MENÚ */}

            <div className="bottom-nav">

                <button

                    className={activeTab === "dashboard" ? "nav-btn active" : "nav-btn"}

                    onClick={() => setActiveTab("dashboard")}

                >

                    🏠

                    <span>Inicio</span>

                </button>

                <button

                    className={activeTab === "playlist" ? "nav-btn active" : "nav-btn"}

                    onClick={() => setActiveTab("playlist")}

                >

                    🎵

                    <span>Cultos</span>

                </button>

                <button

                    className={activeTab === "agenda" ? "nav-btn active" : "nav-btn"}

                    onClick={() => setActiveTab("agenda")}

                >

                    📅

                    <span>Agenda</span>

                </button>

                <button

                    className={activeTab === "songs" ? "nav-btn active" : "nav-btn"}

                    onClick={() => setActiveTab("songs")}

                >

                    🎼

                    <span>Canciones</span>

                </button>

            </div>

        </div>

    );

}

export default App;