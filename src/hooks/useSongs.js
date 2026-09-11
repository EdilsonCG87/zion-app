// ========================================================
// IMPORTS
// ========================================================

import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";


// ========================================================
// HOOK
// ========================================================

export function useSongs() {

    // ========================================================
    // STATES
    // ========================================================

    const [songs, setSongs] = useState([]);
    const [search, setSearch] = useState("");

    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [keyTone, setKeyTone] = useState("");
    const [bpm, setBpm] = useState("");

    const [editingId, setEditingId] = useState(null);

    // Estado privado del Hook
    const [deletedSong, setDeletedSong] = useState(null);


    // ========================================================
    // HELPERS
    // ========================================================

    const clearForm = useCallback(() => {

        setName("");
        setAuthor("");
        setKeyTone("");
        setBpm("");
        setEditingId(null);

    }, []);


    const showError = useCallback((message) => {

        console.error(message);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: message
        });

    }, []);


    const showSuccess = useCallback((title) => {

        Swal.fire({
            icon: "success",
            title,
            timer: 1500,
            showConfirmButton: false
        });

    }, []);


    // ========================================================
    // OBTENER CANCIONES
    // ========================================================
    //
    // Esta función es la única responsable de consultar
    // GET /songs desde este Hook.
    //
    // useCallback mantiene estable su referencia.
    //
    // ========================================================

    const getSongs = useCallback(async () => {

        try {

            const response = await API.get("/songs");

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setSongs(data);

            return data;

        } catch (error) {

            console.error(
                "Error al obtener canciones:",
                error
            );

            showError(
                error.response?.data?.message ||
                "No fue posible cargar las canciones."
            );

            return [];

        }

    }, [showError]);


    // ========================================================
    // GUARDAR CANCIÓN
    // ========================================================

    const saveSong = useCallback(async () => {

        // ----------------------------------------------------
        // Validación
        // ----------------------------------------------------

        if (!name.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Nombre requerido",
                text: "Debes ingresar el nombre de la canción."
            });

            return;
        }


        // ----------------------------------------------------
        // Datos
        // ----------------------------------------------------

        const songData = {
            name: name.trim(),
            author: author.trim(),
            keyTone: keyTone.trim(),
            bpm
        };


        try {

            // ------------------------------------------------
            // Editar
            // ------------------------------------------------

            if (editingId) {

                await API.put(
                    `/songs/${editingId}`,
                    songData
                );

                showSuccess(
                    "Canción actualizada"
                );

            }

            // ------------------------------------------------
            // Crear
            // ------------------------------------------------

            else {

                await API.post(
                    "/songs",
                    songData
                );

                showSuccess(
                    "Canción guardada"
                );
            }


            // ------------------------------------------------
            // Limpiar formulario
            // ------------------------------------------------

            clearForm();

            // ------------------------------------------------
            // Actualizar lista
            // ------------------------------------------------

            await getSongs();

        } catch (error) {

            console.error(
                "Error al guardar canción:",
                error
            );

            showError(
                "No fue posible guardar la canción."
            );
        }

    }, [
        name,
        author,
        keyTone,
        bpm,
        editingId,
        clearForm,
        getSongs,
        showSuccess,
        showError
    ]);


    // ========================================================
    // EDITAR CANCIÓN
    // ========================================================

    const editSong = useCallback((song) => {

        setName(song.name);

        setAuthor(
            song.author ?? ""
        );

        setKeyTone(
            song.keyTone ?? ""
        );

        setBpm(
            song.bpm ?? ""
        );

        setEditingId(song.id);

    }, []);


    // ========================================================
    // FAVORITA
    // ========================================================

    const toggleFavorite = useCallback(async (song) => {

        try {

            await API.put(
                `/songs/${song.id}`,
                {
                    ...song,
                    favorite: !song.favorite
                }
            );

            await getSongs();

        } catch (error) {

            console.error(
                "Error al actualizar favorita:",
                error
            );

            showError(
                error.response?.data?.message ||
                "No fue posible actualizar la canción."
            );
        }

    }, [
        getSongs,
        showError
    ]);


    // ========================================================
    // DESHACER ELIMINACIÓN
    // ========================================================

    const undoDelete = useCallback(async () => {

        if (!deletedSong) {
            return;
        }

        try {

            await API.post(
                "/songs",
                deletedSong
            );

            await getSongs();

            showSuccess(
                "Canción restaurada"
            );

            setDeletedSong(null);

        } catch (error) {

            console.error(
                "Error al restaurar canción:",
                error
            );

            showError(
                error.response?.data?.message ||
                "No fue posible restaurar la canción."
            );
        }

    }, [
        deletedSong,
        getSongs,
        showSuccess,
        showError
    ]);


    // ========================================================
    // ELIMINAR CANCIÓN
    // ========================================================

    const deleteSong = useCallback(async (id) => {

        try {

            const songToDelete = songs.find(
                (song) => song.id === id
            );

            setDeletedSong(songToDelete);

            await API.delete(
                `/songs/${id}`
            );

            await getSongs();

            const result = await Swal.fire({

                icon: "success",

                title: "Canción eliminada",

                text: "Puedes deshacer la acción.",

                showCancelButton: true,

                confirmButtonText: "Deshacer",

                cancelButtonText: "Cerrar"

            });


            if (result.isConfirmed) {

                await undoDelete();

            }

        } catch (error) {

            console.error(
                "Error al eliminar canción:",
                error
            );

            showError(
                error.response?.data?.message ||
                "No fue posible eliminar la canción."
            );
        }

    }, [
        songs,
        getSongs,
        undoDelete,
        showError
    ]);


    // ========================================================
    // CONFIRMAR ELIMINACIÓN
    // ========================================================

    const confirmDelete = useCallback((id) => {

        Swal.fire({

            title: "¿Eliminar canción?",

            text: "Podrás deshacer la acción.",

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

    }, [
        deleteSong
    ]);


    // ========================================================
    // RETURN
    // ========================================================

    return {

        // ----------------------------------------------------
        // Estados
        // ----------------------------------------------------

        songs,
        setSongs,

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
        setEditingId,

        // ----------------------------------------------------
        // Funciones
        // ----------------------------------------------------

        getSongs,

        saveSong,

        editSong,

        toggleFavorite,

        confirmDelete

    };
}