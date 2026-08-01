// =========================
// IMPORTS
// =========================
import { useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";

// =========================
// HOOK
// =========================
export function useSongs() {

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

    // Estado privado del Hook
    const [deletedSong, setDeletedSong] = useState(null);

// =========================
// HELPERS
// =========================

    /**
     * Limpia completamente el formulario.
     */
    const clearForm = () => {

        setName("");
        setAuthor("");
        setKeyTone("");
        setBpm("");
        setEditingId(null);

    };

    /**
     * Muestra un mensaje de error uniforme.
     */
    const showError = (message) => {

    Swal.fire({

        icon: "error",
        title: "Error",
        text: message

    });

};

    /**
     * Muestra un mensaje de éxito uniforme.
     */
    const showSuccess = (title) => {
        Swal.fire({
            icon: "success",
            title,
            timer: 1500,
            showConfirmButton: false
        });
    };
    
// =========================
// OBTENER CANCIONES
// =========================

    const getSongs = async () => {
        try {
            const response = await API.get("/songs");
            setSongs(response.data || []);
        } 
        catch (error) {

    console.error(
        "Error al obtener canciones:",
        error
    );

    showError(

        error.response?.data?.message ||

        "No fue posible cargar las canciones."

    );

}
        }


// =========================
// GUARDAR CANCIÓN
// =========================

    const saveSong = async () => {

// -------------------------
// Validaciones
// -------------------------

        if (!name.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Nombre requerido",
                text: "Debes ingresar el nombre de la canción."
            });
            return;
        }

// -------------------------
// Objeto
// -------------------------

        const songData = {
            name: name.trim(),
            author: author.trim(),
            keyTone: keyTone.trim(),
            bpm
        };

        try {

// -------------------------
// Editar
// -------------------------

            if (editingId) {
                await API.put(
                    `/songs/${editingId}`,
                    songData
                );
                showSuccess(
                    "Canción actualizada"
                );
            }

// -------------------------
// Crear
// -------------------------

            else {
                await API.post(
                    "/songs",
                    songData
                );
                showSuccess(
                    "Canción guardada"
                );
            }
            clearForm();
            await getSongs();
        } 
        catch (error) {
            console.error(
                "Error al guardar canción:",
                error
            );
            showError(
                "No fue posible guardar la canción."
            );
        }
    };

// =========================
// EDITAR CANCIÓN
// =========================

    const editSong = (song) => {
        setName(song.name);
        setAuthor(song.author ?? "");
        setKeyTone(song.keyTone ?? "");
        setBpm(song.bpm ?? "");
        setEditingId(song.id);
    };

    // =========================
    // FAVORITA
    // =========================

    const toggleFavorite = async (song) => {

        try {
            await API.put(
                `/songs/${song.id}`,
                {
                    ...song,
                    favorite: !song.favorite
                }
            );

            await getSongs();

        } 
        catch (error) {

    console.error(
        "Error al actualizar favorita:",
        error
    );

    showError(

        error.response?.data?.message ||

        "No fue posible actualizar la canción."

    );

}
    };

    // =========================
    // ELIMINAR CANCIÓN
    // =========================

    const deleteSong = async (id) => {
        try {
            const songToDelete = songs.find(
                song => song.id === id
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

        } 
        catch (error) {

    console.error(
        "Error al actualizar favorita:",
        error
    );

    showError(

        error.response?.data?.message ||

        "No fue posible actualizar la canción."

    );

}
    };

// =========================
// DESHACER ELIMINACIÓN
// =========================

    const undoDelete = async () => {
        if (!deletedSong) return;
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
            
        } 
        catch (error) {

    console.error(
        "Error al actualizar favorita:",
        error
    );

    showError(

        error.response?.data?.message ||

        "No fue posible actualizar la canción."

    );

}
    };

// =========================
// CONFIRMAR ELIMINACIÓN
// =========================

const confirmDelete = (id) => {

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

};
// =========================
// RETURN
// =========================

return {

    // Estados
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

    // Funciones
    getSongs,
    saveSong,
    editSong,
    toggleFavorite,
    confirmDelete
};
}