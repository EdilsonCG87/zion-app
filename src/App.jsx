import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

import { useSongs } from "./hooks/useSongs";
import { usePlaylists } from "./hooks/usePlaylists";
import { usePlaylistSongs } from "./hooks/usePlaylistSongs";
import { useReports } from "./hooks/useReports";
import { useStatistics } from "./hooks/useStatistics";
import { useNextService } from "./hooks/useNextService";
import { useSharePlaylist } from "./hooks/useSharePlaylist";
import { useUsers } from "./hooks/useUsers";

import DashboardPage from "./pages/DashboardPage";
import PlaylistPage from "./pages/PlaylistPage";
import SongsPage from "./pages/SongsPage";
import AgendaPage from "./pages/AgendaPage";
import UsersPage from "./pages/UsersPage";

function App() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [showTopSongs, setShowTopSongs] = useState(false);

    const songsHook = useSongs();

    const {
        songs,
        getSongs
    } = songsHook;

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

    const playlistSongsHook = usePlaylistSongs();

    const {
        playlistSongs,
        getPlaylistSongs,
        addSongToPlaylist,
        removeSongFromPlaylist,
        moveSong
    } = playlistSongsHook;

    const {
        selectedHistorySong,
        setSelectedHistorySong,
        songHistory,
        getSongHistory,
        getYearUsage
    } = useReports();

    const {
        topSongs,
        getTopSongs,
        getUnusedSongs,
        getOverusedSongs
    } = useStatistics();

    const {
        nextService,
        daysRemaining
    } = useNextService(playlists);

    const {
        shareWhatsApp,
        exportPlaylistPDF
    } = useSharePlaylist({
        playlists,
        selectedPlaylist,
        playlistSongs,
        songs
    });

    const usersHook = useUsers();

    useEffect(() => {
        getSongs();
        getPlaylists();
        getTopSongs();
        getUnusedSongs();
        getOverusedSongs();
        getYearUsage(2026);
    }, []);

    return (
        <div className="app-container">
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

            {activeTab === "dashboard" && (
                <DashboardPage
                    songs={songs}
                    playlists={playlists}
                    topSongs={topSongs}
                    showTopSongs={showTopSongs}
                    setShowTopSongs={setShowTopSongs}
                />
            )}

            {activeTab === "agenda" && (
                <AgendaPage
                    playlists={playlists}
                    playlistSongs={playlistSongs}
                    songs={songs}
                    getPlaylistSongs={getPlaylistSongs}
                />
            )}

            {activeTab === "playlist" && (
                <PlaylistPage
                    playlists={playlists}
                    selectedPlaylist={selectedPlaylist}
                    setSelectedPlaylist={setSelectedPlaylist}
                    getPlaylistSongs={getPlaylistSongs}
                    playlistSongs={playlistSongs}
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
                    removeSongFromPlaylist={removeSongFromPlaylist}
                    moveSong={moveSong}
                    startEditPlaylist={startEditPlaylist}
                    exportPlaylistPDF={exportPlaylistPDF}
                    shareWhatsApp={shareWhatsApp}
                    selectedHistorySong={selectedHistorySong}
                    setSelectedHistorySong={setSelectedHistorySong}
                    songHistory={songHistory}
                    getSongHistory={getSongHistory}
                />
            )}

            {activeTab === "songs" && (
                <SongsPage
                    songsHook={songsHook}
                    getTopSongs={getTopSongs}
                    getOverusedSongs={getOverusedSongs}
                    songHistory={songHistory}
                    getSongHistory={getSongHistory}
                />
            )}

            {activeTab === "users" && (
                <UsersPage usersHook={usersHook} />
            )}

            <div className="bottom-nav">
                <button
                    className={
                        activeTab === "dashboard"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() => setActiveTab("dashboard")}
                >
                    🏠
                    <span>Inicio</span>
                </button>

                <button
                    className={
                        activeTab === "playlist"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() => setActiveTab("playlist")}
                >
                    🎵
                    <span>Cultos</span>
                </button>

                <button
                    className={
                        activeTab === "agenda"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() => setActiveTab("agenda")}
                >
                    📅
                    <span>Agenda</span>
                </button>

                <button
                    className={
                        activeTab === "songs"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() => setActiveTab("songs")}
                >
                    🎼
                    <span>Canciones</span>
                </button>

                <button
                    className={
                        activeTab === "users"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() => setActiveTab("users")}
                >
                    👥
                    <span>Usuarios</span>
                </button>
            </div>
        </div>
    );
}

export default App;