// =========================
// IMPORTS
// =========================
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "./App.css";
import logo from "./assets/logo.png";
import API from "./services/api";
import { useSongs } from "./hooks/useSongs";
import { usePlaylists } from "./hooks/usePlaylists";
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
const [showOrder, setShowOrder] = useState(true);
const [showSongsList, setShowSongsList] = useState(false);
const [activeTab, setActiveTab] = useState("dashboard");
const [nextService, setNextService] = useState(null);
const {
    playlists,
    setPlaylists,

    playlistSongs,
    setPlaylistSongs,

    getPlaylists,
    createPlaylist,
    getPlaylistSongs,
    deletePlaylist

} = usePlaylists();

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
  
// Canciones 
const [playlistName, setPlaylistName] = useState("");
const [serviceDate, setServiceDate] = useState("");
const [selectedPlaylist, setSelectedPlaylist] = useState("");
const sortedPlaylists = [...playlists].sort( (a, b) => new Date(a.serviceDate) - new Date(b.serviceDate)  );
  
// Dashboard
const [selectedSong, setSelectedSong] = useState("");

// Reportes
const {
    totalSongs,
    totalServices,
    mostUsedSong,
    loadDashboard
} = useDashboard();

const {

    selectedHistorySong,
    setSelectedHistorySong,

    songHistory,
    yearUsage,
    yearStats,
    monthlyStats,

    getSongHistory,
    getYearUsage

} = useReports();

// Plalist
  const [showTopSongs, setShowTopSongs] = useState(false);
  const [showUnusedSongs, setShowUnusedSongs] = useState(false);
  const [showOverusedSongs, setShowOverusedSongs] = useState(false);
  const [showYearReport, setShowYearReport] = useState(false);
  
  const {
    topSongs,
    unusedSongs,
    overusedSongs,
    getTopSongs,
    getUnusedSongs,
    getOverusedSongs
} = useStatistics();

// =========================
// FUNCIONES PLAYLISTS
// =========================

// Agregar canción al culto
const addSongToPlaylist = async () => {

  if (!selectedPlaylist || !selectedSong) {

    Swal.fire({
      icon: "warning",
      title: "Faltan datos",
      text: "Selecciona culto y canción"
    });

    return;
  }

  try {

    await API.post(
      `/playlist-songs`,
      {
        playlistId: Number(selectedPlaylist),
        songId: Number(selectedSong),
        orderNumber:
          playlistSongs.length + 1
      }
    );

      // AUMENTAR ESTADÍSTICA

    await API.put(
      `/songs/${selectedSong}/play`
    );
    
    Swal.fire({
      icon: "success",
      title: "Canción agregada",
      timer: 1200,
      showConfirmButton: false
    });

    getPlaylistSongs(
      selectedPlaylist
    );
    getTopSongs();
    
  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        "No se pudo agregar la canción"
    });
  }
};

// Eliminar canción del culto
const removeSongFromPlaylist = async (
  playlistSongId
) => {

  try {

    await API.delete(
      `/playlist-songs/${playlistSongId}`
    );

    Swal.fire({
      icon: "success",
      title: "Canción eliminada",
      timer: 1200,
      showConfirmButton: false
    });

    getPlaylistSongs(
      selectedPlaylist
    );

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        "No se pudo eliminar la canción"
    });
  }
};

// Mover canción en el orden del culto
const moveSong = async (
  index,
  direction
) => {

  const updatedSongs =
    [...playlistSongs];

  const newIndex =
    direction === "up"
      ? index - 1
      : index + 1;

  // VALIDAR LÍMITES

  if (
    newIndex < 0 ||
    newIndex >= updatedSongs.length
  ) {
    return;
  }

  // INTERCAMBIAR POSICIÓN

  [
    updatedSongs[index],
    updatedSongs[newIndex]
  ] = [
    updatedSongs[newIndex],
    updatedSongs[index]
  ];

  // NUEVO ORDEN

  const reorderedSongs =
    updatedSongs.map(
      (song, i) => ({
        ...song,
        orderNumber: i + 1
      })
    );

  try {

    // GUARDAR EN BACKEND

    for (
      const item of reorderedSongs
    ) {

      await API.put(
        `/playlist-songs/${item.id}`,
        item
      );
    }

    // ACTUALIZAR PANTALLA

    setPlaylistSongs(
      reorderedSongs
    );

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        "No se pudo mover la canción"
    });
  }
};


// Editar Cultos

const startEditPlaylist = async () => {

  if (!selectedPlaylist) {

    Swal.fire({
      icon: "warning",
      title: "Selecciona un culto"
    });

    return;
  }

  const selected =
    playlists.find(
      p =>
        p.id ===
        Number(selectedPlaylist)
    );

  if (!selected) return;

  const result =
    await Swal.fire({

      title: "Editar Culto",

      html: `

        <input
          id="swal-name"
          class="swal2-input"
          placeholder="Nombre"
          value="${selected.name}"
        >

        <input
          id="swal-date"
          type="date"
          class="swal2-input"
          value="${selected.serviceDate}"
        >

      `,

      focusConfirm: false,

      showCancelButton: true,

      confirmButtonText: "Guardar",

      cancelButtonText: "Cancelar",

      preConfirm: () => {

        return {

          name:
            document.getElementById(
              "swal-name"
            ).value,

          serviceDate:
            document.getElementById(
              "swal-date"
            ).value

        };

      }

    });

  if (!result.isConfirmed)
    return;

  updatePlaylist(
    result.value
  );
};

// Parte 3 Edición Cultos

const updatePlaylist =
  async (data) => {

    try {

      await API.put(

        `/playlists/${selectedPlaylist}`,

        data

      );

      Swal.fire({

        icon: "success",

        title:
          "Culto actualizado",

        timer: 1500,

        showConfirmButton:
          false

      });

      getPlaylists();

    } catch (error) {

      console.error(error);

      Swal.fire({

        icon: "error",

        title: "Error",

        text:
          "No se pudo actualizar"

      });

    }
};


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
const selectedPlaylistData =
  Array.isArray(playlists)
    ? playlists.find(
        playlist =>
          playlist.id ===
          Number(selectedPlaylist)
      )
    : null;

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