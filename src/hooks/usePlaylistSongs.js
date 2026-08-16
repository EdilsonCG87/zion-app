// =========================
// IMPORTS
// =========================
import { useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";

// =========================
// HOOK
// =========================
export function usePlaylistSongs() {

// =========================
// STATES
// =========================

const [playlistSongs, setPlaylistSongs] = useState([]);

// =========================
// OBTENER CANCIONES DEL CULTO
// =========================

const getPlaylistSongs = async (playlistId) => {

    if (!playlistId) {
        setPlaylistSongs([]);
        return;
    }

    try {

const { data } = await API.get(
    `/playlist-songs/${playlistId}`
);

setPlaylistSongs(data);

return data;

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

    const addSongToPlaylist = async (

        playlistId,
        songId,
        onUpdated

    ) => {

        if (!playlistId || !songId) {

            Swal.fire({

                icon: "warning",
                title: "Faltan datos",
                text: "Selecciona un culto y una canción."

            });

            return;

        }

        try {

            await API.post("/playlist-songs", {

                playlistId: Number(playlistId),
                songId: Number(songId),
                orderNumber: playlistSongs.length + 1

            });

            // Incrementa contador de reproducciones
            await API.put(`/songs/${songId}/play`);

            await getPlaylistSongs(playlistId);

            // Actualizar estadísticas si existe callback
            if (onUpdated) {

                onUpdated();

            }

            Swal.fire({

                icon: "success",
                title: "Canción agregada",

                timer: 1200,
                showConfirmButton: false

            });

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

    const removeSongFromPlaylist = async (

        playlistSongId,
        playlistId

    ) => {

        const result = await Swal.fire({

            title: "¿Eliminar canción?",

            text: "La canción será retirada del culto.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Eliminar",

            cancelButtonText: "Cancelar"

        });

        if (!result.isConfirmed) return;

        try {

            await API.delete(
                `/playlist-songs/${playlistSongId}`
            );

            await getPlaylistSongs(playlistId);

            Swal.fire({

                icon: "success",

                title: "Canción eliminada",

                timer: 1200,

                showConfirmButton: false

            });

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
    // CAMBIAR ORDEN
    // =========================

    const moveSong = async (

        index,
        direction

    ) => {

        const updatedSongs = [...playlistSongs];

        const newIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (

            newIndex < 0 ||

            newIndex >= updatedSongs.length

        ) return;

        [

            updatedSongs[index],
            updatedSongs[newIndex]

        ] = [

            updatedSongs[newIndex],
            updatedSongs[index]

        ];

        const reorderedSongs = updatedSongs.map(

            (song, i) => ({

                ...song,

                orderNumber: i + 1

            })

        );

        try {

            await Promise.all(

                reorderedSongs.map(item =>

                    API.put(

                        `/playlist-songs/${item.id}`,

                        item

                    )

                )

            );

            setPlaylistSongs(reorderedSongs);

            Swal.fire({

                icon: "success",

                title: "Orden actualizado",

                timer: 900,

                showConfirmButton: false

            });

        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",

                title: "Error",

                text: "No fue posible cambiar el orden."

            });

        }

    };

    // =========================
    // RETURN
    // =========================

    return {

        playlistSongs,
        setPlaylistSongs,

        getPlaylistSongs,

        addSongToPlaylist,

        removeSongFromPlaylist,

        moveSong

    };

}

// =========================
// FIN DEL HOOK
// =========================