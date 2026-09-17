import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import { useAuth } from "./context/AuthContext";
import { useSongs } from "./hooks/useSongs";
import { usePlaylists } from "./hooks/usePlaylists";
import { usePlaylistSongs } from "./hooks/usePlaylistSongs";
import { useReports } from "./hooks/useReports";
import { useStatistics } from "./hooks/useStatistics";
import { useNextService } from "./hooks/useNextService";
import { useSharePlaylist } from "./hooks/useSharePlaylist";
import { useUsers } from "./hooks/useUsers";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PlaylistPage = lazy(() => import("./pages/PlaylistPage"));
const SongsPage = lazy(() => import("./pages/SongsPage"));
const AgendaPage = lazy(() => import("./pages/AgendaPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

function App() {
    const { user, loading, isAdmin, logout } = useAuth();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [showTopSongs, setShowTopSongs] = useState(false);

    const songsHook = useSongs();
    const { songs, getSongs } = songsHook;

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

    const { nextService, daysRemaining } = useNextService(playlists);

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
        if (loading || !user) {
            return;
        }

        getSongs();
        getPlaylists();
        getYearUsage(2026);

        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [loading, user]);

    useEffect(() => {
        if (!user || !Array.isArray(songs)) {
            return;
        }

        getTopSongs(songs);
        getUnusedSongs(songs);
        getOverusedSongs(songs);
    }, [
        user,
        songs,
        getTopSongs,
        getUnusedSongs,
        getOverusedSongs
    ]);

    useEffect(() => {
        if (!user) {
            setActiveTab("dashboard");
        }
    }, [user]);

    if (loading) {
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

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "300px",
                        fontSize: "18px"
                    }}
                >
                    Comprobando sesión...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <Suspense
                fallback={
                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center"
                        }}
                    >
                        Cargando...
                    </div>
                }
            >
                <LoginPage />
            </Suspense>
        );
    }

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

                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >
                    <span
                        style={{
                            fontSize: "14px",
                            opacity: 0.85
                        }}
                    >
                        {user.username}
                    </span>

                    <button
                        type="button"
                        onClick={logout}
                        style={{
                            border: "none",
                            borderRadius: "8px",
                            padding: "9px 14px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>

            </div>

            {nextService && (
                <div className="next-service-alert">
                    🔔 Próximo culto:{" "}
                    <strong>{nextService.name}</strong>
                    {" - "}
                    {nextService.serviceDate}
                    {" ("}
                    {daysRemaining}
                    {" días)"}
                </div>
            )}

            <Suspense fallback={null}>

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

                {activeTab === "users" && isAdmin && (
                    <UsersPage
                        usersHook={usersHook}
                    />
                )}

            </Suspense>

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

                {isAdmin && (
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
                )}

            </div>

        </div>
    );
}

export default App;