// =========================
// IMPORTS
// =========================
import { useState } from "react";
import Swal from "sweetalert2";
import API from "../services/api";

// =========================
// HOOK
// =========================
export function useStatistics() {

// =========================
// STATES
// =========================

    const [topSongs, setTopSongs] = useState([]);
    const [unusedSongs, setUnusedSongs] = useState([]);
    const [overusedSongs, setOverusedSongs] = useState([]);

// =========================
// HELPERS
// =========================

    const showError = (message) => {

        console.error(message);

        Swal.fire({

            icon: "error",
            title: "Error",
            text: message

        });

    };

// =========================
// TOP 5 CANCIONES
// =========================

    const getTopSongs = async () => {

        try {

            const { data } = await API.get("/songs");

            const sortedSongs = data

                .filter(song => (song.timesPlayed ?? 0) > 0)

                .sort(

                    (a, b) =>

                        (b.timesPlayed ?? 0) -

                        (a.timesPlayed ?? 0)

                )

                .slice(0, 5);

            setTopSongs(sortedSongs);

        } catch (error) {

            console.error(error);

            showError("No fue posible cargar el Top de canciones.");

        }

    };

// =========================
// CANCIONES MENOS USADAS
// =========================

    const getUnusedSongs = async () => {

        try {

            const { data } = await API.get("/songs");

            const songs = [...data]

                .sort(

                    (a, b) =>

                        (a.timesPlayed ?? 0) -

                        (b.timesPlayed ?? 0)

                )

                .slice(0, 10);

            setUnusedSongs(songs);

        } catch (error) {

            console.error(error);

            showError("No fue posible cargar las canciones menos usadas.");

        }

    };

// =========================
// CANCIONES MÁS USADAS
// =========================

    const getOverusedSongs = async () => {

        try {

            const { data } = await API.get("/songs");

            const songs = data

                .filter(

                    song =>

                        (song.timesPlayed ?? 0) >= 5

                )

                .sort(

                    (a, b) =>

                        (b.timesPlayed ?? 0) -

                        (a.timesPlayed ?? 0)

                )

                .slice(0, 10);

            setOverusedSongs(songs);

        } catch (error) {

            console.error(error);

            showError("No fue posible cargar las canciones más usadas.");

        }

    };

// =========================
// RETURN
// =========================

    return {

        topSongs,
        unusedSongs,
        overusedSongs,

        getTopSongs,
        getUnusedSongs,
        getOverusedSongs

    };

}