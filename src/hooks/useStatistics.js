// * ========================================================
// * IMPORTS
// * ========================================================

import { useCallback, useState } from "react";
import Swal from "sweetalert2";


// * ========================================================
// * HOOK
// * ========================================================

export function useStatistics() {

    // * ========================================================
    // * STATES
    // * ========================================================

    const [topSongs, setTopSongs] = useState([]);

    const [unusedSongs, setUnusedSongs] = useState([]);

    const [overusedSongs, setOverusedSongs] = useState([]);


    // * ========================================================
    // * HELPERS
    // * ========================================================

    const showError = useCallback((message) => {

        console.error(message);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: message
        });

    }, []);


    // * ========================================================
    // * TOP 5 CANCIONES
    // * ========================================================

    const getTopSongs = useCallback((songs = []) => {

        try {

            const data = Array.isArray(songs) ? songs : [];

            const sortedSongs = [...data]
                .filter(
                    (song) =>
                        (song.timesPlayed ?? 0) > 0
                )
                .sort(
                    (a, b) =>
                        (b.timesPlayed ?? 0) -
                        (a.timesPlayed ?? 0)
                )
                .slice(0, 5);

            setTopSongs(sortedSongs);

        } catch (error) {

            console.error(
                "Error al generar el Top de canciones:",
                error
            );

            showError(
                "No fue posible generar el Top de canciones."
            );

        }

    }, [showError]);


    // * ========================================================
    // * CANCIONES MENOS USADAS
    // * ========================================================

    const getUnusedSongs = useCallback((songs = []) => {

        try {

            const data = Array.isArray(songs) ? songs : [];

            const sortedSongs = [...data]
                .sort(
                    (a, b) =>
                        (a.timesPlayed ?? 0) -
                        (b.timesPlayed ?? 0)
                )
                .slice(0, 10);

            setUnusedSongs(sortedSongs);

        } catch (error) {

            console.error(
                "Error al generar las canciones menos usadas:",
                error
            );

            showError(
                "No fue posible cargar las canciones menos usadas."
            );

        }

    }, [showError]);


    // * ========================================================
    // * CANCIONES MÁS USADAS
    // * ========================================================

    const getOverusedSongs = useCallback((songs = []) => {

        try {

            const data = Array.isArray(songs) ? songs : [];

            const sortedSongs = [...data]
                .filter(
                    (song) =>
                        (song.timesPlayed ?? 0) >= 5
                )
                .sort(
                    (a, b) =>
                        (b.timesPlayed ?? 0) -
                        (a.timesPlayed ?? 0)
                )
                .slice(0, 10);

            setOverusedSongs(sortedSongs);

        } catch (error) {

            console.error(
                "Error al generar las canciones más usadas:",
                error
            );

            showError(
                "No fue posible cargar las canciones más usadas."
            );

        }

    }, [showError]);


    // * ========================================================
    // * RETURN
    // * ========================================================

    return {

        topSongs,

        unusedSongs,

        overusedSongs,

        getTopSongs,

        getUnusedSongs,

        getOverusedSongs

    };

}