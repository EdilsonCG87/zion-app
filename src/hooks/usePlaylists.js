import { useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

export function usePlaylists() {

const [playlists, setPlaylists] = useState([]);
const [playlistSongs, setPlaylistSongs] = useState([]);

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
                text: "No fue posible cargar playlists"
            });

        }

    };


    // =========================
    // CREAR CULTO
    // =========================

    const createPlaylist = async (

        playlistName,
        serviceDate,
        setPlaylistName,
        setServiceDate

    ) => {

        if (!playlistName.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Nombre requerido",
                text: "Escribe un nombre para el culto"
            });

            return;
        }

        try {

            await API.post("/playlists", {

                name: playlistName,

                serviceDate: serviceDate

            });

            Swal.fire({

                icon: "success",

                title: "Culto creado",

                timer: 1500,

                showConfirmButton: false

            });

            setPlaylistName("");

            setServiceDate("");

            await getPlaylists();

        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",

                title: "Error",

                text: "No se pudo crear el culto"

            });

        }

    };

// =========================
// OBTENER CANCIONES DEL CULTO
// =========================

const getPlaylistSongs = async (playlistId) => {

    if (!playlistId) return;

    try {

        const response = await API.get(

            `/playlist-songs/${playlistId}`

        );

        setPlaylistSongs(response.data);

    } catch (error) {

        console.error(error);

    }

};

// =========================
// ELIMINAR CULTO
// =========================

const deletePlaylist = async (

    selectedPlaylist,
    setSelectedPlaylist,
    
) => {

    if (!selectedPlaylist) {

        Swal.fire({
            icon: "warning",
            title: "Selecciona un culto"
        });

        return;
    }

    const result = await Swal.fire({

        title: "¿Eliminar culto?",

        text: "Esta acción no se puede deshacer",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Sí, eliminar",

        cancelButtonText: "Cancelar"

    });

    if (!result.isConfirmed)
        return;

    try {

        await API.delete(`/playlists/${selectedPlaylist}`);

        Swal.fire({

            icon: "success",

            title: "Culto eliminado",

            timer: 1200,

            showConfirmButton: false

        });

        setSelectedPlaylist("");

        setPlaylistSongs([]);

        await getPlaylists();

    } catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Error",

            text:
                error.response?.data?.message ||
                error.message

        });

    }

};

return {

    playlists,
    setPlaylists,

    playlistSongs,
    setPlaylistSongs,

    getPlaylists,
    createPlaylist,
    getPlaylistSongs,
    deletePlaylist

};

}