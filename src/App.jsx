// =========================
// IMPORTS
// =========================
import { useEffect, useState } from "react";
import "./App.css";

import logo from "./assets/logo.png";

import { useSongs } from "./hooks/useSongs";
import { usePlaylists } from "./hooks/usePlaylists";
import { usePlaylistSongs } from "./hooks/usePlaylistSongs";
import { useDashboard } from "./hooks/useDashboard";
import { useReports } from "./hooks/useReports";
import { useStatistics } from "./hooks/useStatistics";

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

const [activeTab, setActiveTab] =
    useState("dashboard");
const [nextService, setNextService] =
    useState(null);

// Dashboard
const [showTopSongs, setShowTopSongs] =
    useState(false);

// =========================
// HOOKS
// =========================

// Canciones
const songsHook = useSongs();
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

    getSongs,

    saveSong,
    editSong,
    toggleFavorite,
    confirmDelete
} = songsHook;

// Cultos
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
    updatePlaylist,
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

// Dashboard
const dashboardHook = useDashboard();
const {
    totalSongs,
    totalServices,
    mostUsedSong,
    loadDashboard
} = dashboardHook;

// Reportes
const reportsHook = useReports();
const {
    selectedHistorySong,
    setSelectedHistorySong,

    songHistory,
    yearUsage,
    yearStats,
    monthlyStats,

    getSongHistory,
    getYearUsage
} = reportsHook;

// Estadísticas
const statisticsHook = useStatistics();
const {
    topSongs,
    unusedSongs,
    overusedSongs,

    getTopSongs,
    getUnusedSongs,
    getOverusedSongs
} = statisticsHook;


  
// Plalist
  const [showUnusedSongs, setShowUnusedSongs] = useState(false);
  const [showOverusedSongs, setShowOverusedSongs] = useState(false);
  const [showYearReport, setShowYearReport] = useState(false);


// =========================
// FUNCIONES PDF
// =========================

const shareWhatsApp = () => {

  if (
    !selectedPlaylist ||
    playlistSongs.length === 0
  ) {

    Swal.fire({
      icon: "warning",
      title: "Sin información",
      text:
        "Selecciona un culto con canciones"
    });

    return;
  }

  const playlist =
    playlists.find(
      p =>
        p.id ===
        Number(selectedPlaylist)
    );

  let message =
`🎼 ZION Playlist

⛪ ${playlist?.name}

📅 ${playlist?.serviceDate}

`;

  playlistSongs.forEach(
    (item, index) => {

      const song =
        songs.find(
          s =>
            s.id === item.songId
        );

      message +=
`${index + 1}. ${song?.name}\n`;

    }
  );

  message +=
`\n🙏 Bendiciones`;

  const url =
`https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(
    url,
    "_blank"
  );
};

const exportPlaylistPDF = () => {

  if (
    playlistSongs.length === 0
  ) {

    Swal.fire({
      icon: "warning",
      title: "Sin canciones",
      text:
        "No hay canciones para exportar"
    });

    return;
  }

  const pdf =
    new jsPDF();

  pdf.setFontSize(18);

  pdf.text(
    "ZION Playlist - Orden del Culto",
    20,
    20
  );

  pdf.setFontSize(12);

  const selected =
    playlists.find(
      p =>
        p.id ===
        Number(
          selectedPlaylist
        )
    );

  pdf.text(
    `Culto: ${
      selected?.name ||
      "Sin nombre"
    }`,
    20,
    35
  );

  let y = 50;

  playlistSongs.forEach(
    (item, index) => {

      const song =
        songs.find(
          s =>
            s.id ===
            item.songId
        );

      pdf.text(
        `${index + 1}. ${
          song?.name ||
          "Canción"
        }`,
        20,
        y
      );

      y += 10;
    }
  );

  pdf.save(
    "orden-culto-zion.pdf"
  );

  Swal.fire({
    icon: "success",
    title:
      "PDF exportado"
  });
};

  // =========================
  // USE EFFECT
  // =========================

useEffect(() => {

  // Canciones
  getSongs();

  // Cultos
  getPlaylists();

  // Dashboard
  loadDashboard();

  // Estadísticas
  getTopSongs();
  getUnusedSongs();
  getOverusedSongs();

  // Reportes
  getYearUsage(2026);

}, []);

useEffect(() => {

  const today = new Date();

  today.setHours(0,0,0,0);

  const upcomingServices =
  Array.isArray(playlists)
    ? playlists
        .filter((playlist) => {
          const serviceDate =
            new Date(playlist.serviceDate);

          serviceDate.setHours(0,0,0,0);

          return serviceDate >= today;
        })
        .sort(
          (a,b) =>
            new Date(a.serviceDate) -
            new Date(b.serviceDate)
        )
    : [];

  if (upcomingServices.length > 0) {

    setNextService(
      upcomingServices[0]
    );

  }

}, [playlists]);


// =========================
// VARIABLES AUXILIARES
// =========================

// Próximo culto

const daysRemaining = nextService
  ? Math.ceil(
      (
        new Date(nextService.serviceDate) -
        new Date()
      ) /
      (1000 * 60 * 60 * 24)
    )
  : null;

// =========================
  // HTML
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


{/* NOTIFICACIÓN PRÓXIMO CULTO */}

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

{activeTab === "songs" && (

    <SongsPage
        songsHook={songsHook}
        getTopSongs={getTopSongs}
        getOverusedSongs={getOverusedSongs}
    />

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

</div>

</div>

);

}

export default App;