// =========================
// IMPORTS
// =========================
import Dashboard from "./components/Dashboard";
import SearchBar from "./components/SearchBar";
import SongForm from "./components/SongForm";
import TopSongs from "./components/TopSongs";
import PlaylistManager from "./components/PlaylistManager";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "./App.css";
import logo from "./assets/logo.png";
import CalendarAgenda from "./components/CalendarAgenda";
const API_URL = "https://zion-backend-byyq.onrender.com";

// =========================
// COMPONENTE APP
// =========================
function App() {

  // =========================
  // STATES
  // =========================

const [songs, setSongs] = useState([]);
const [search, setSearch] = useState("");
const [name, setName] = useState("");
const [author, setAuthor] = useState("");
const [keyTone, setKeyTone] = useState("");
const [bpm, setBpm] = useState("");
const [editingId, setEditingId] = useState(null);
const [deletedSong, setDeletedSong] = useState(null);
const [showOrder, setShowOrder] = useState(true);
const [editingPlaylist, setEditingPlaylist] = useState(false);
const [editingPlaylistName, setEditingPlaylistName] = useState("");
const [editingServiceDate, setEditingServiceDate] = useState("");
const [showSongsList, setShowSongsList] = useState(false);
const [showAgenda, setShowAgenda] = useState(false);
const [nextService, setNextService] = useState(null);
const [activeTab, setActiveTab] = useState("dashboard");
const [monthlyStats, setMonthlyStats] = useState([]);
  
  // Canciones 
const [playlists, setPlaylists] = useState([]);
const [playlistName, setPlaylistName] = useState("");
const [serviceDate, setServiceDate] = useState("");
const [selectedPlaylist, setSelectedPlaylist] = useState("");
const sortedPlaylists = [...playlists].sort( (a, b) => new Date(a.serviceDate) - new Date(b.serviceDate)  );
  

// Dashboard
const [playlistSongs, setPlaylistSongs] = useState([]);
const [topSongs, setTopSongs] = useState([]);
const [selectedSong, setSelectedSong] = useState("");

// Reportes

const [totalSongs, setTotalSongs] = useState(0);
const [totalServices, setTotalServices] = useState(0);
const [mostUsedSong, setMostUsedSong] = useState(null);


// Plalist
const [selectedHistorySong, setSelectedHistorySong] = useState("");
const [songHistory, setSongHistory] = useState([]);

  // Orden del Culto

const [selectedYear, setSelectedYear] = useState("2026");
const [yearUsage, setYearUsage] = useState([]);
const [yearStats, setYearStats] = useState({
    totalServices: 0,
    totalSongs: 0,
    uniqueSongs: 0,
    mostUsedSong: null,
    mostUsedCount: 0
  });

  const [unusedSongs, setUnusedSongs] = useState([]);
  const [overusedSongs, setOverusedSongs] = useState([]);

  const [showTopSongs, setShowTopSongs] = useState(false);
  const [showYearReport, setShowYearReport] = useState(false);
  const [showUnusedSongs, setShowUnusedSongs] = useState(false);
  const [showOverusedSongs, setShowOverusedSongs] = useState(false); 
  
// =========================
// FUNCIONES CANCIONES
// =========================

const getSongs = async () => {

  try {

    const response = await axios.get(
      "${API_URL}/songs"
    );

    setSongs(response.data);

  } catch (error) {

    console.error(error);

  }
};

// =========================
// FUNCIONES DASHBOARD
// =========================

const loadDashboard =
  async () => {

    try {

      const songsResponse =
        await axios.get(
          "${API_URL}/songs"
        );

      const playlistsResponse =
        await axios.get(
          "${API_URL}/playlists"
        );

      const songs =
        songsResponse.data;

      setTotalSongs(
        songs.length
      );

      setTotalServices(
        playlistsResponse.data.length
      );

      const sortedSongs =
        [...songs].sort(
          (a, b) =>
            (b.timesPlayed || 0)
            -
            (a.timesPlayed || 0)
        );

      setMostUsedSong(
        sortedSongs[0]
      );

    } catch (error) {

      console.error(error);

    }
};

// =========================
// FUNCIONES REPORTES
// =========================

const getSongHistory =
  async (songId) => {

    try {

      if (!songId) {

        setSongHistory([]);

        return;
      }

      const response =
        await axios.get(

`${API_URL}/song-usage/${songId}`

        );

      setSongHistory(
        response.data
      );

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "No fue posible cargar el historial"
      });
    }
  };

  const getYearUsage =
  async (year) => {

    try {

      const response =
        await axios.get(

`${API_URL}/song-usage/by-year/${year}`

        );

      const usageData =
  response.data;

setYearUsage(
  usageData
);

const months = [

  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic"

];

const monthlyData =
  Array(12)
    .fill(0);

usageData.forEach(
  item => {

    const date =
      new Date(
        item.serviceDate
      );

    const month =
      date.getMonth();

    monthlyData[
      month
    ]++;

  }
);

setMonthlyStats(

  months.map(
    (
      month,
      index
    ) => ({

      month,

      count:
        monthlyData[
          index
        ]

    })
  )

);

const uniqueSongs =
  [
    ...new Set(
      usageData.map(
        item =>
          item.song?.id
      )
    )
  ];

const songCount =
  {};

usageData.forEach(
  item => {

    const songName =
      item.song?.name;

    if (!songName)
      return;

    songCount[
      songName
    ] =
      (
        songCount[
          songName
        ] || 0
      ) + 1;
  }
);

let topSong =
  null;

let topCount =
  0;

Object.entries(
  songCount
).forEach(
  ([name, count]) => {

    if (
      count >
      topCount
    ) {

      topSong =
        name;

      topCount =
        count;
    }
  }
);

const uniqueServices =
  [
    ...new Set(
      usageData.map(
        item =>
          item.playlist?.id
      )
    )
  ];

setYearStats({

  totalServices:
    uniqueServices
      .length,

  totalSongs:
    usageData.length,

  uniqueSongs:
    uniqueSongs
      .length,

  mostUsedSong:
    topSong,

  mostUsedCount:
    topCount

});


    } catch (error) {

      console.error(error);

    }
};

// =========================
// FUNCIONES ESTADÍSTICAS
// =========================

const getTopSongs = async () => {

  try {

    const response =
      await axios.get(
        "${API_URL}/songs"
      );

    const sortedSongs =
      response.data

        .filter(song =>
          song.timesPlayed !== null
        )

        .sort(
          (a, b) =>
            b.timesPlayed -
            a.timesPlayed
        )

        .slice(0, 5);

    setTopSongs(
      sortedSongs
    );

  } catch (error) {

    console.error(error);
  }
};

const getUnusedSongs =
  async () => {

    try {

      const response =
        await axios.get(
          "${API_URL}/songs"
        );

      const sortedSongs =
        [...response.data]

          .sort(
            (a, b) =>

              (a.timesPlayed || 0)
              -
              (b.timesPlayed || 0)

          )

          .slice(0, 10);

      setUnusedSongs(
        sortedSongs
      );

    } catch (error) {

      console.error(error);

    }
};

// =========================
// CRUD CANCIONES
// =========================
  const saveSong = async () => {

    const songData = {
      name,
      author,
      keyTone,
      bpm
    };

    try {

      // EDITAR
      if (editingId) {

        await axios.put(
          `${API_URL}/songs/${editingId}`,
          songData
        );

        Swal.fire({
          icon: "success",
          title: "Canción actualizada",
          timer: 1500,
          showConfirmButton: false
        });

      } else {

        // CREAR
        await axios.post(
          "${API_URL}/songs",
          songData
        );

        Swal.fire({
          icon: "success",
          title: "Canción guardada",
          timer: 1500,
          showConfirmButton: false
        });
      }

      // LIMPIAR FORMULARIO

      setName("");
      setAuthor("");
      setKeyTone("");
      setBpm("");
      setEditingId(null);

      getSongs();

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible guardar"
      });
    }
  };

  // =========================
  // EDITAR
  // =========================

  const editSong = (song) => {

    setName(song.name);
    setAuthor(song.author);
    setKeyTone(song.keyTone);
    setBpm(song.bpm);

    setEditingId(song.id);
  };

  // =========================
  // FAVORITAS
  // =========================

  const toggleFavorite = async (song) => {

    try {

      await axios.put(
        `${API_URL}/songs/${song.id}`,
        {
          ...song,
          favorite: !song.favorite
        }
      );

      getSongs();

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar favorita"
      });
    }
  };

  // =========================
  // ELIMINAR
  // =========================

  const deleteSong = async (id) => {

    try {

      const songToDelete = songs.find(song => song.id === id);

      setDeletedSong(songToDelete);

      await axios.delete(
        `${API_URL}/songs/${id}`
      );

      getSongs();

      Swal.fire({
        title: "Canción eliminada",
        text: "Puedes deshacer la acción",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Deshacer",
        cancelButtonText: "Cerrar"
      }).then((result) => {

        if (result.isConfirmed) {

          undoDelete();
        }
      });

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible eliminar"
      });
    }
  };

  // =========================
  // DESHACER ELIMINACIÓN
  // =========================

  const undoDelete = async () => {

    if (!deletedSong) return;

    try {

      await axios.post(
        "${API_URL}/songs",
        deletedSong
      );

      getSongs();

      Swal.fire({
        icon: "success",
        title: "Canción restaurada",
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // CONFIRMAR ELIMINAR
  // =========================

  const confirmDelete = (id) => {

    Swal.fire({
      title: "¿Eliminar canción?",
      text: "Podrás deshacer la acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {

      if (result.isConfirmed) {

        deleteSong(id);
      }
    });
  };

// =========================
// FUNCIONES PLAYLISTS
// =========================

// Obtener cultos
const getPlaylists = async () => {

  try {

    const response = await axios.get(
      "${API_URL}/playlists"
    );

console.log("PLAYLISTS:");
console.log(response.data);
console.log(typeof response.data);

    setPlaylists(response.data);

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No fue posible cargar playlists"
    });
  }
};

// Crear culto
const createPlaylist = async () => {

  if (!playlistName.trim()) {

    Swal.fire({
      icon: "warning",
      title: "Nombre requerido",
      text: "Escribe un nombre para el culto"
    });

    return;
  }

  try {

    await axios.post(
  "${API_URL}/playlists",
  {
    name:
      playlistName,

    serviceDate:
      serviceDate
  }
);

    Swal.fire({
      icon: "success",
      title: "Culto creado",
      timer: 1500,
      showConfirmButton: false
    });

    setPlaylistName("");

    setServiceDate("");

    getPlaylists();

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo crear el culto"
    });
  }
};

// Eliminar culto
const deletePlaylist =
  async () => {

    if (!selectedPlaylist) {

      Swal.fire({
        icon: "warning",
        title:
          "Selecciona un culto"
      });

      return;
    }

    const result =
      await Swal.fire({
        title:
          "¿Eliminar culto?",
        text:
          "Esta acción no se puede deshacer",
        icon:
          "warning",
        showCancelButton:
          true,
        confirmButtonText:
          "Sí, eliminar",
        cancelButtonText:
          "Cancelar"
      });

    if (!result.isConfirmed)
      return;

    try {

      await axios.delete(
        `${API_URL}/playlists/${selectedPlaylist}`
      );

      Swal.fire({
        icon: "success",
        title:
          "Culto eliminado",
        timer: 1200,
        showConfirmButton:
          false
      });

      setSelectedPlaylist("");
      setPlaylistSongs([]);

      getPlaylists();

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "No se pudo eliminar"
      });
    }
};

// Obtener canciones del culto
const getPlaylistSongs = async (
  playlistId
) => {

  if (!playlistId) return;

  try {

    const response = await axios.get(
      `${API_URL}/playlist-songs/${playlistId}`
    );

    setPlaylistSongs(response.data);

  } catch (error) {

    console.error(error);
  }
};

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

    await axios.post(
      "${API_URL}/playlist-songs",
      {
        playlistId: Number(selectedPlaylist),
        songId: Number(selectedSong),
        orderNumber:
          playlistSongs.length + 1
      }
    );

      // AUMENTAR ESTADÍSTICA

    await axios.put(
      `${API_URL}/songs/${selectedSong}/play`
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

    await axios.delete(
      `${API_URL}/playlist-songs/${playlistSongId}`
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

      await axios.put(
        `${API_URL}/playlist-songs/${item.id}`,
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

      await axios.put(

        `${API_URL}/playlists/${selectedPlaylist}`,

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

  const upcomingServices = playlists
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
    );

  if (upcomingServices.length > 0) {

    setNextService(
      upcomingServices[0]
    );

  }

}, [playlists]);


// =========================
// VARIABLES AUXILIARES
// =========================
console.log(
  "PLAYLISTS:",
  playlists
);

const selectedPlaylistData =
  playlists.find(
    playlist =>
      playlist.id ===
      Number(selectedPlaylist)
  );

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
// CANCIONES SOBREUTILIZADAS
// =========================

const getOverusedSongs =
  async () => {

    try {

      const response =
        await axios.get(
          "${API_URL}/songs"
        );

      const songs =
        response.data

          .filter(
            song =>
              (song.timesPlayed || 0) >= 5
          )

          .sort(
            (a, b) =>
              b.timesPlayed -
              a.timesPlayed
          )

          .slice(0, 10);

      setOverusedSongs(
        songs
      );

    } catch (error) {

      console.error(error);

    }
};


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
<div className="tab-content">

  <Dashboard
    totalSongs={songs.length}
    totalServices={playlists.length}
    mostUsedSong={topSongs[0]}
  />

</div>
)}

{/* AGENDA */}
{activeTab === "agenda" && (

<div className="tab-content">

  <CalendarAgenda
  playlists={playlists}
  playlistSongs={playlistSongs}
  songs={songs}
  getPlaylistSongs={getPlaylistSongs}
/>

</div>

)}

{/* BUSCADOR */}

<SearchBar
  search={search}
  setSearch={setSearch}
/>

<TopSongs
  topSongs={topSongs}
  showTopSongs={showTopSongs}
  setShowTopSongs={setShowTopSongs}
/>

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

{activeTab === "playlist" && (

<>

{/* CULTOS */}
{activeTab === "playlist" && (
<div className="tab-content">
  <PlaylistManager
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
/>

{/* =========================
    HISTORIAL DE CANCIONES
========================= */}

{/* HISTORIAL */}
<div className="playlist-card">

  <h2 className="playlist-title">
    📊 Historial de Canciones
  </h2>

  <div className="playlist-row">

    <select
      value={
        selectedHistorySong
      }

      onChange={(e) => {

        const songId =
          e.target.value;

        setSelectedHistorySong(
          songId
        );

        getSongHistory(
          songId
        );
      }}
    >
      

<option value="">
Seleccionar canción
</option>

      {songs.map((song) => (

        <option
          key={song.id}
          value={song.id}
        >
          {song.name}
        </option>

      ))}

    </select>

  </div>

  <div
    style={{
      marginTop: "20px"
    }}
  >

    <h3>
      Veces usada:
      {" "}
      {songHistory.length}
    </h3>

    {songHistory.length >
      0 ? (

      songHistory.map(
        (usage, index) => (

        <div
          key={index}
          className="song-card"
          style={{
            marginBottom:
              "10px"
          }}
        >

          ⛪
          {" "}
          {
            usage.playlist
              ?.name
          }

          {" — "}

          {
            usage
              .serviceDate
          }

        </div>

      ))

    ) : (

      <p>
        No hay historial
      </p>

    )}

  </div>

</div>


{/* CANCIONES MUY UTILIZADAS */}

<div className="playlist-card">

  <h2
    className="playlist-title"
    style={{ cursor: "pointer" }}
    onClick={() =>
      setShowOverusedSongs(
        !showOverusedSongs
      )
    }
  >

    ⚠️ Canciones Muy Utilizadas

    {" "}

    {
      showOverusedSongs
        ? "▼"
        : "►"
    }

  </h2>

  {showOverusedSongs && (

    <>

      {overusedSongs.length === 0 ? (

        <p>
          No hay canciones repetidas
        </p>

      ) : (

        overusedSongs.map(
          (song) => (

            <div
              key={song.id}
              className="song-card"
            >

              🔥 {song.name}

              {" — "}

              {song.timesPlayed}

              usos

            </div>

          )
        )

      )}

    </>

  )}

</div>

</div>
)}

{/* CULTO ACTIVO */}

<div className="playlist-card">

  <h2 className="playlist-title">
    🎯 Culto Activo
  </h2>

  <div className="playlist-row">

    <select
      value={selectedPlaylist}
      onChange={(e) => {

        const playlistId = e.target.value;

        setSelectedPlaylist(playlistId);

        if (!playlistId) {

          setPlaylistSongs([]);
          return;

        }

        getPlaylistSongs(playlistId);

      }}
    >

      <option value="">
        Seleccionar culto
      </option>

      {playlists.map((playlist) => (

        <option
          key={playlist.id}
          value={playlist.id}
        >
          {playlist.name}
        </option>

      ))}

    </select>

  </div>

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "15px",
      flexWrap: "wrap"
    }}
  >

    <button
      className="action-btn btn-edit"
      onClick={startEditPlaylist}
    >
      ✏️ Editar
    </button>

    <button
      className="action-btn btn-delete"
      onClick={deletePlaylist}
    >
      🗑 Eliminar
    </button>

    <button
      className="action-btn btn-pdf"
      onClick={exportPlaylistPDF}
    >
      📄 PDF
    </button>

    <button
      className="action-btn btn-whatsapp"
      onClick={shareWhatsApp}
    >
      📲 WhatsApp
    </button>

  </div>

</div>

{/* ORDEN DEL SERVICIO */}
<div className="playlist-card">

  <h2
    className="playlist-title"
    style={{ cursor: "pointer" }}
    onClick={() =>
      setShowOrder(!showOrder)
    }
  >

  🎵 Orden del servicio

  {" "}

  {
    showOrder
      ? "▼"
      : "►"
  }

</h2>

{showOrder && (

  <>


{!selectedPlaylist && (

  <p
    style={{
      textAlign: "center",
      color: "#ccc",
      marginTop: "20px"
    }}
  >
    Selecciona un culto para visualizar el orden del servicio
  </p>

)}

{selectedPlaylistData && (

  <div
    style={{
      textAlign:
        "center",
      marginBottom:
        "20px",
      color:
        "white"
    }}
  >

    <h3>
      {
        selectedPlaylistData.name
      }
    </h3>

    <p>
      📅 {" "}
      {
        selectedPlaylistData
          .serviceDate
      }
    </p>

  </div>
)}

  {!selectedPlaylist ? null :

playlistSongs.length === 0 ? (
  

    <p>
      No hay canciones en este culto
    </p>

  ) : (

    <div>

      {playlistSongs.map(
        (item, index) => {

          const song =
            songs.find(
              s =>
                s.id ===
                item.songId
            );

          return (

            <div
              key={item.id}
              className="playlist-row"
            >

              <span
                style={{
                  color:
                    "white",
                  flex: 1
                }}
              >
                {index + 1}.{" "}
                {
                  song?.name
                }
              </span>

              <button
                onClick={() =>
                moveSong(
                index,
                "up"
                        )
            }
      >
          ⬆️
            </button>

          <button
            onClick={() =>
            moveSong(
            index,
              "down"
          )
        }
          >
          ⬇️
</button>

<button
  className="delete-btn"
    onClick={() =>
      removeSongFromPlaylist(
        item.id
    )
  }
>
  ❌
</button>

            </div>
          );
        }
      )}

    </div>

  )}

  </>
)}

</div>

{editingPlaylist && (

  <div
    className="playlist-row"
    style={{
      marginTop: "15px"
    }}
  >

    <input
      type="text"
      value={
        editingPlaylistName
      }
      onChange={(e) =>
        setEditingPlaylistName(
          e.target.value
        )
      }
    />

    <input
      type="date"
      value={
        editingServiceDate
      }
      onChange={(e) =>
        setEditingServiceDate(
          e.target.value
        )
      }
    />

    <button
      className="save-btn"
      onClick={
        updatePlaylist
      }
    >
      Guardar cambios
    </button>

  </div>

)}

</>

)}

{activeTab === "songs" && (
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
{showSongsList ? "▼" : "►" }
</h2>

</div>

{/* TABLA */}

{showSongsList && (
      <table>
        
        <thead>

          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Autor</th>
            <th>Tono</th>
            <th>BPM</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {songs
            .filter((song) =>
              song.name.toLowerCase().includes(search.toLowerCase()) ||
              song.author.toLowerCase().includes(search.toLowerCase()) ||
              song.keyTone.toLowerCase().includes(search.toLowerCase())
            )
            .map((song, index) => (

              <tr key={song.id}>

                <td>{index + 1}</td>
                <td>{song.name}</td>
                <td>{song.author}</td>
                <td>{song.keyTone}</td>
                <td>{song.bpm}</td>

                <td>

                  <button
                    className={
                      song.favorite
                        ? "favorite-btn active"
                        : "favorite-btn"
                    }
                    onClick={() => toggleFavorite(song)}
                  >
                    ★
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => editSong(song)}
                  >
                    Editar
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => confirmDelete(song.id)}
                  >
                    Eliminar
                  </button>
                  
                </td>

              </tr>

            ))}

        </tbody>

      </table>
)}

</div>
)}


<div className="bottom-nav">

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
    <span>Inicio</span>
  </button>

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
    <span>Cultos</span>
  </button>

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
    <span>Agenda</span>
  </button>

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
    <span>Canciones</span>
  </button>

</div>

</div>
);

}

export default App;