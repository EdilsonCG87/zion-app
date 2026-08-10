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

            const response = await API.get("/playlists");

            let data = response.data;

            // ---------------------------------
            // El backend puede devolver:
            // 1. Un arreglo directamente
            // 2. Un JSON convertido en string
            // ---------------------------------

            if (typeof data === "string") {

                try {

                    data = JSON.parse(data);

                } catch (parseError) {

                    console.error(
                        "La respuesta de /playlists no contiene JSON válido:",
                        parseError
                    );

                    setPlaylists([]);

                    Swal.fire({

                        icon: "error",

                        title: "Error",

                        text:
                            "El servidor devolvió una respuesta inválida para los cultos."

                    });

                    return;

                }

            }

            // ---------------------------------
            // Verificar que realmente sea array
            // ---------------------------------

            if (!Array.isArray(data)) {

                console.error(
                    "La respuesta de /playlists no es un arreglo:",
                    data
                );

                setPlaylists([]);

                Swal.fire({

                    icon: "error",

                    title: "Error",

                    text:
                        "No fue posible interpretar la lista de cultos."

                });

                return;

            }

            // ---------------------------------
            // Guardar cultos
            // ---------------------------------

            setPlaylists(data);

        } catch (error) {

            console.error(
                "Error al obtener cultos:",
                error
            );

            setPlaylists([]);

            Swal.fire({

                icon: "error",

                title: "Error",

                text:
                    error.response?.data?.message ||
                    "No fue posible cargar los cultos."

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

                text:
                    "Debes escribir un nombre para el culto."

            });

            return;

        }

        try {

            await API.post(

                "/playlists",

                {

                    name: playlistName.trim(),

                    serviceDate

                }

            );

            Swal.fire({

                icon: "success",

                title: "Culto creado",

                timer: 1500,

                showConfirmButton: false

            });

            clearPlaylistForm();

            await getPlaylists();

        } catch (error) {

            console.error(
                "Error al crear culto:",
                error
            );

            Swal.fire({

                icon: "error",

                title: "Error",

                text:
                    error.response?.data?.message ||
                    "No fue posible crear el culto."

            });

        }

    };

    // =========================
    // ACTUALIZAR CULTO
    // =========================

    const updatePlaylist = async (data) => {

        if (!selectedPlaylist) {

            Swal.fire({

                icon: "warning",

                title: "Selecciona un culto"

            });

            return;

        }

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

            console.error(
                "Error al actualizar culto:",
                error
            );

            Swal.fire({

                icon: "error",

                title: "Error",

                text:
                    error.response?.data?.message ||
                    "No fue posible actualizar el culto."

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

            text:
                "Esta acción no se puede deshacer.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Sí, eliminar",

            cancelButtonText: "Cancelar"

        });

        if (!result.isConfirmed) {

            return;

        }

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

            console.error(
                "Error al eliminar culto:",
                error
            );

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

            playlist =>
                playlist.id === Number(selectedPlaylist)

        );

        if (!selected) {

            Swal.fire({

                icon: "warning",

                title: "Culto no encontrado",

                text:
                    "No fue posible encontrar el culto seleccionado."

            });

            return;

        }

        const result = await Swal.fire({

            title: "Editar culto",

            html: `

                <input
                    id="swal-name"
                    class="swal2-input"
                    placeholder="Nombre"
                    value="${selected.name ?? ""}"
                >

                <input
                    id="swal-date"
                    type="date"
                    class="swal2-input"
                    value="${selected.serviceDate ?? ""}"
                >

            `,

            showCancelButton: true,

            confirmButtonText: "Guardar",

            cancelButtonText: "Cancelar",

            focusConfirm: false,

            preConfirm: () => {

                const name =
                    document.getElementById(
                        "swal-name"
                    ).value.trim();

                const serviceDate =
                    document.getElementById(
                        "swal-date"
                    ).value;

                if (!name) {

                    Swal.showValidationMessage(
                        "El nombre del culto es obligatorio."
                    );

                    return false;

                }

                return {

                    name,

                    serviceDate

                };

            }

        });

        if (!result.isConfirmed) {

            return;

        }

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