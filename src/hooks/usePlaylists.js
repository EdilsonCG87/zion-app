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

    const [playlistName, setPlaylistName] = useState("");

    const [serviceDate, setServiceDate] = useState("");

    const [selectedPlaylist, setSelectedPlaylist] = useState("");

    const [selectedSong, setSelectedSong] = useState("");

// =========================
// LIMPIAR FORMULARIO
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

            const { data } = await API.get("/playlists");

            setPlaylists(data);

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

            await API.delete(`/playlists/${selectedPlaylist}`);

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
    // EDITAR CULTO
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

            title: "Editar culto",

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

            showCancelButton: true,

            confirmButtonText: "Guardar",

            cancelButtonText: "Cancelar",

            focusConfirm: false,

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
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        startEditPlaylist

    };

}

// =========================
// FIN DEL HOOK
// =========================