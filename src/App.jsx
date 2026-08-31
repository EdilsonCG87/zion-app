// ========================================================
// IMPORTS
// ========================================================

import {
    lazy,
    Suspense,
    useEffect,
    useState
} from "react";

import "./App.css";
import logo from "./assets/logo.png";

// ============================================================
// AUTH
// ============================================================

import { useAuth } from "./context/AuthContext";

// ============================================================
// HOOKS
// ============================================================

import { useSongs } from "./hooks/useSongs";
import { usePlaylists } from "./hooks/usePlaylists";
import { usePlaylistSongs } from "./hooks/usePlaylistSongs";
import { useReports } from "./hooks/useReports";
import { useStatistics } from "./hooks/useStatistics";
import { useNextService } from "./hooks/useNextService";
import { useSharePlaylist } from "./hooks/useSharePlaylist";
import { useUsers } from "./hooks/useUsers";

// ============================================================
// PAGES
// ============================================================

const DashboardPage = lazy(
    () => import("./pages/DashboardPage")
);

const PlaylistPage = lazy(
    () => import("./pages/PlaylistPage")
);

const SongsPage = lazy(
    () => import("./pages/SongsPage")
);

const AgendaPage = lazy(
    () => import("./pages/AgendaPage")
);

const UsersPage = lazy(
    () => import("./pages/UsersPage")
);

const LoginPage = lazy(
    () => import("./pages/LoginPage")
);


// ============================================================
// APP
// ============================================================

function App() {

    // ========================================================
    // AUTENTICACIÓN
    // ========================================================

    const {
        user,
        loading,
        isAdmin
    } = useAuth();


    // ========================================================
    // NAVEGACIÓN
    // ========================================================

    const [activeTab, setActiveTab] = useState(
        "dashboard"
    );

    const [showTopSongs, setShowTopSongs] = useState(
        false
    );


    // ========================================================
    // HOOK CANCIONES
    // ========================================================

    const songsHook = useSongs();

    const {
        songs,
        getSongs
    } = songsHook;


    // ========================================================
    // HOOK CULTOS
    // ========================================================

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


    // ========================================================
    // HOOK CANCIONES DEL CULTO
    // ========================================================

    const playlistSongsHook = usePlaylistSongs();

    const {
        playlistSongs,
        getPlaylistSongs,
        addSongToPlaylist,
        removeSongFromPlaylist,
        moveSong
    } = playlistSongsHook;


    // ========================================================
    // HOOK REPORTES
    // ========================================================

    const {
        selectedHistorySong,
        setSelectedHistorySong,
        songHistory,
        getSongHistory,
        getYearUsage
    } = useReports();


    // ========================================================
    // HOOK ESTADÍSTICAS
    // ========================================================

    const {
        topSongs,
        getTopSongs,
        getUnusedSongs,
        getOverusedSongs
    } = useStatistics();


    // ========================================================
    // PRÓXIMO CULTO
    // ========================================================

    const {
        nextService,
        daysRemaining
    } = useNextService(playlists);


    // ========================================================
    // COMPARTIR / PDF
    // ========================================================

    const {
        shareWhatsApp,
        exportPlaylistPDF
    } = useSharePlaylist({
        playlists,
        selectedPlaylist,
        playlistSongs,
        songs
    });


    // ========================================================
    // USUARIOS
    // ========================================================

    const usersHook = useUsers();


    // ========================================================
    // CARGAR DATOS PROTEGIDOS
    // ========================================================
    //
    // IMPORTANTE:
    //
    // Estas peticiones NO deben ejecutarse antes
    // de que exista una sesión autenticada.
    //
    // Antes:
    //
    // useEffect(() => {
    //     getSongs();
    //     getPlaylists();
    //     ...
    // }, []);
    //
    // Eso provocaba los 401.
    //
    // Ahora esperamos a:
    //
    // loading === false
    //
    // y además:
    //
    // user !== null
    //
    // ========================================================

    useEffect(() => {

        // ----------------------------------------------------
        // TODAVÍA SE ESTÁ COMPROBANDO LA SESIÓN
        // ----------------------------------------------------

        if (loading) {
            return;
        }


        // ----------------------------------------------------
        // NO HAY USUARIO AUTENTICADO
        // ----------------------------------------------------
        //
        // LoginPage se encargará de mostrar el formulario.
        //
        // NO hacemos ninguna petición protegida.
        //

        if (!user) {
            return;
        }


        // ----------------------------------------------------
        // USUARIO AUTENTICADO
        // ----------------------------------------------------
        //
        // Ahora sí podemos consultar la API.
        //

        getSongs();

        getPlaylists();

        getTopSongs();

        getUnusedSongs();

        getOverusedSongs();

        getYearUsage(2026);

    }, [
        loading,
        user,
        getSongs,
        getPlaylists,
        getTopSongs,
        getUnusedSongs,
        getOverusedSongs,
        getYearUsage
    ]);


    // ========================================================
    // CAMBIAR A DASHBOARD CUANDO LA SESIÓN CAMBIA
    // ========================================================

    useEffect(() => {

        if (!user) {
            setActiveTab("dashboard");
        }

    }, [user]);


    // ========================================================
    // ESTADO DE CARGA DE AUTENTICACIÓN
    // ========================================================

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

                        <p>
                            Gestión inteligente de alabanzas
                        </p>

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


    // ========================================================
    // SIN SESIÓN
    // ========================================================
    //
    // IMPORTANTE:
    //
    // Aquí detenemos completamente la aplicación protegida.
    //
    // No se muestran canciones.
    // No se muestran cultos.
    // No se consultan endpoints protegidos.
    //
    // Se muestra LoginPage.
    //
    // ========================================================

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


    // ========================================================
    // APLICACIÓN AUTENTICADA
    // ========================================================

    return (

        <div className="app-container">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="header">

                <img
                    src={logo}
                    alt="Zion Logo"
                    className="logo"
                />

                <div>

                    <h1>
                        ZION Playlist
                    </h1>

                    <p>
                        Gestión inteligente de alabanzas
                    </p>

                </div>

            </div>


            {/* ==================================================
                PRÓXIMO CULTO
            ================================================== */}

            {nextService && (

                <div className="next-service-alert">

                    🔔 Próximo culto:

                    <strong>
                        {" "}
                        {nextService.name}
                    </strong>

                    {" - "}

                    {nextService.serviceDate}

                    {" ("}

                    {daysRemaining}

                    {" días)"}

                </div>

            )}


            {/* ==================================================
                CONTENIDO PRINCIPAL
            ================================================== */}

            <Suspense fallback={null}>

                {/* ==================================================
                    DASHBOARD
                ================================================== */}

                {activeTab === "dashboard" && (

                    <DashboardPage
                        songs={songs}
                        playlists={playlists}
                        topSongs={topSongs}
                        showTopSongs={showTopSongs}
                        setShowTopSongs={
                            setShowTopSongs
                        }
                    />

                )}


                {/* ==================================================
                    AGENDA
                ================================================== */}

                {activeTab === "agenda" && (

                    <AgendaPage
                        playlists={playlists}
                        playlistSongs={
                            playlistSongs
                        }
                        songs={songs}
                        getPlaylistSongs={
                            getPlaylistSongs
                        }
                    />

                )}


                {/* ==================================================
                    CULTOS / PLAYLIST
                ================================================== */}

                {activeTab === "playlist" && (

                    <PlaylistPage
                        playlists={playlists}

                        selectedPlaylist={
                            selectedPlaylist
                        }

                        setSelectedPlaylist={
                            setSelectedPlaylist
                        }

                        getPlaylistSongs={
                            getPlaylistSongs
                        }

                        playlistSongs={
                            playlistSongs
                        }

                        deletePlaylist={
                            deletePlaylist
                        }

                        playlistName={
                            playlistName
                        }

                        setPlaylistName={
                            setPlaylistName
                        }

                        serviceDate={
                            serviceDate
                        }

                        setServiceDate={
                            setServiceDate
                        }

                        createPlaylist={
                            createPlaylist
                        }

                        selectedSong={
                            selectedSong
                        }

                        setSelectedSong={
                            setSelectedSong
                        }

                        songs={songs}

                        addSongToPlaylist={
                            addSongToPlaylist
                        }

                        removeSongFromPlaylist={
                            removeSongFromPlaylist
                        }

                        moveSong={moveSong}

                        startEditPlaylist={
                            startEditPlaylist
                        }

                        exportPlaylistPDF={
                            exportPlaylistPDF
                        }

                        shareWhatsApp={
                            shareWhatsApp
                        }

                        selectedHistorySong={
                            selectedHistorySong
                        }

                        setSelectedHistorySong={
                            setSelectedHistorySong
                        }

                        songHistory={
                            songHistory
                        }

                        getSongHistory={
                            getSongHistory
                        }
                    />

                )}


                {/* ==================================================
                    CANCIONES
                ================================================== */}

                {activeTab === "songs" && (

                    <SongsPage
                        songsHook={songsHook}
                        getTopSongs={
                            getTopSongs
                        }
                        getOverusedSongs={
                            getOverusedSongs
                        }
                        songHistory={
                            songHistory
                        }
                        getSongHistory={
                            getSongHistory
                        }
                    />

                )}


                {/* ==================================================
                    USUARIOS
                ================================================== */}

                {activeTab === "users" && (

                    <UsersPage
                        usersHook={usersHook}
                    />

                )}

            </Suspense>


            {/* ==================================================
                NAVEGACIÓN INFERIOR
            ================================================== */}

            <div className="bottom-nav">

                {/* ------------------------------------------------
                    INICIO
                ------------------------------------------------ */}

                <button
                    className={
                        activeTab === "dashboard"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() =>
                        setActiveTab("dashboard")
                    }
                >

                    🏠

                    <span>
                        Inicio
                    </span>

                </button>


                {/* ------------------------------------------------
                    CULTOS
                ------------------------------------------------ */}

                <button
                    className={
                        activeTab === "playlist"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() =>
                        setActiveTab("playlist")
                    }
                >

                    🎵

                    <span>
                        Cultos
                    </span>

                </button>


                {/* ------------------------------------------------
                    AGENDA
                ------------------------------------------------ */}

                <button
                    className={
                        activeTab === "agenda"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() =>
                        setActiveTab("agenda")
                    }
                >

                    📅

                    <span>
                        Agenda
                    </span>

                </button>


                {/* ------------------------------------------------
                    CANCIONES
                ------------------------------------------------ */}

                <button
                    className={
                        activeTab === "songs"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                    onClick={() =>
                        setActiveTab("songs")
                    }
                >

                    🎼

                    <span>
                        Canciones
                    </span>

                </button>


                {/* ------------------------------------------------
                    USUARIOS
                ------------------------------------------------ */}

                {isAdmin && (

                    <button
                        className={
                            activeTab === "users"
                                ? "nav-btn active"
                                : "nav-btn"
                        }
                        onClick={() =>
                            setActiveTab("users")
                        }
                    >

                        👥

                        <span>
                            Usuarios
                        </span>

                    </button>

                )}

            </div>

        </div>
    );
}


// ============================================================
// EXPORT
// ============================================================

export default App;