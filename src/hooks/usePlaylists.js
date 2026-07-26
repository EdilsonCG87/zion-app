// =========================
// IMPORTS
// =========================
import { useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";

// =========================
// HOOK
// =========================
export function usePlaylists() {

// =========================
// STATES
// =========================

const [playlists, setPlaylists] = useState([]);
const [playlistSongs, setPlaylistSongs] = useState([]);

const [playlistName, setPlaylistName] = useState("");
const [serviceDate, setServiceDate] = useState("");

const [selectedPlaylist, setSelectedPlaylist] = useState("");
const [selectedSong, setSelectedSong] = useState("");

    // =========================
    // FUNCIONES AUXILIARES
    // =========================

    const clearPlaylistForm = () => {

        setPlaylistName("");
        setServiceDate("");

    };

    // =========================
    // OBTENER CULTOS
    // =========================

    const getPlaylists = async () => {

        try {

            const response = await API.get("/playlists");

            setPlaylists(response.data);

        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",
                title: "Error",
                text: "No fue posible cargar los cultos."

            });

        }

    };

    // =========================
    // CREAR CULTO
    // =========================

    const createPlaylist = async () => {

        if (!playlistName.trim()) {

            Swal.fire({

                icon: "warning",
                title: "Nombre requerido",
                text: "Debes escribir un nombre para el culto."

            });

            return;

        }

        try {

            await API.post("/playlists", {

                name: playlistName.trim(),
                serviceDate

            });

            Swal.fire({

                icon: "success",
                title: "Culto creado",

                timer: 1500,
                showConfirmButton: false

            });

            clearPlaylistForm();

            await getPlaylists();

        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",
                title: "Error",
                text: "No fue posible crear el culto."

            });

        }

    };

    // =========================
    // ACTUALIZAR CULTO
    // =========================

    const updatePlaylist = async (data) => {

        try {

            await API.put(

                `/playlists/${selectedPlaylist}`,

                data

            );

            Swal.fire({

                icon: "success",
                title: "Culto actualizado",

                timer: 1500,
                showConfirmButton: false

            });

            await getPlaylists();

        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",
                title: "Error",
                text: "No fue posible actualizar el culto."

            });

        }

    };

    // =========================
    // ELIMINAR CULTO
    // =========================

    const deletePlaylist = async () => {

        if (!selectedPlaylist) {

            Swal.fire({

                icon: "warning",
                title: "Selecciona un culto"

            });

            return;

        }

        const result = await Swal.fire({

            title: "¿Eliminar culto?",

            text: "Esta acción no se puede deshacer.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Sí, eliminar",

            cancelButtonText: "Cancelar"

        });

        if (!result.isConfirmed) return;

        try {

            await API.delete(
    `/playlists/${selectedPlaylist}`
);

Swal.fire({

    icon: "success",
    title: "Culto eliminado",
    timer: 1200,
    showConfirmButton: false

});

setSelectedPlaylist("");

await getPlaylists();

        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",
                title: "Error",

                text:
                    error.response?.data?.message ||
                    "No fue posible eliminar el culto."

            });

        }

    };


// =========================
// OBTENER CANCIONES DEL CULTO
// =========================

const getPlaylistSongs = async (playlistId) => {

    if (!playlistId) {

        setPlaylistSongs([]);
        return;

    }

    try {

        const response = await API.get(
            `/playlist-songs/playlist/${playlistId}`
        );

        setPlaylistSongs(response.data);

    } catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",
            title: "Error",
            text: "No fue posible cargar las canciones del culto."

        });

    }

};

// =========================
// AGREGAR CANCIÓN AL CULTO
// =========================

const addSongToPlaylist = async () => {

    if (!selectedPlaylist || !selectedSong) {

        Swal.fire({

            icon: "warning",
            title: "Faltan datos",
            text: "Selecciona un culto y una canción."

        });

        return;

    }

    try {

        await API.post("/playlist-songs", {

            playlistId: Number(selectedPlaylist),
            songId: Number(selectedSong),
            orderNumber: playlistSongs.length + 1

        });

        await API.put(
            `/songs/${selectedSong}/play`
        );

        Swal.fire({

            icon: "success",
            title: "Canción agregada",

            timer: 1200,
            showConfirmButton: false

        });

        await getPlaylistSongs(selectedPlaylist);

    } catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",
            title: "Error",
            text: "No fue posible agregar la canción."

        });

    }

};

// =========================
// ELIMINAR CANCIÓN DEL CULTO
// =========================

const removeSongFromPlaylist = async (playlistSongId) => {

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

        await getPlaylistSongs(selectedPlaylist);

    } catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",
            title: "Error",
            text: "No fue posible eliminar la canción."

        });

    }

};


// =========================
// INICIAR EDICIÓN DE CULTO
// =========================

const startEditPlaylist = async () => {

    if (!selectedPlaylist) {

        Swal.fire({

            icon: "warning",
            title: "Selecciona un culto"

        });

        return;

    }

    const selected = playlists.find(

        playlist => playlist.id === Number(selectedPlaylist)

    );

    if (!selected) return;

    const result = await Swal.fire({

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

        preConfirm: () => ({

            name: document.getElementById("swal-name").value,

            serviceDate: document.getElementById("swal-date").value

        })

    });

    if (!result.isConfirmed) return;

    await updatePlaylist(result.value);

};

// =========================
// RETURN
// =========================

return {

    // Estados

    playlists,
    setPlaylists,

    playlistSongs,
    setPlaylistSongs,

    playlistName,
    setPlaylistName,

    serviceDate,
    setServiceDate,

    selectedPlaylist,
    setSelectedPlaylist,

    selectedSong,
    setSelectedSong,

    // Funciones

    getPlaylists,
    getPlaylistSongs,

    createPlaylist,
    updatePlaylist,
    deletePlaylist,

    addSongToPlaylist,
    removeSongFromPlaylist,
    
    startEditPlaylist

};

}

// =========================
// FIN DEL HOOK
// =========================