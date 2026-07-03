import { useState } from "react";
import API from "../services/api";

export function useStatistics() {

    // =========================
    // STATES
    // =========================

    const [topSongs, setTopSongs] = useState([]);
    const [unusedSongs, setUnusedSongs] = useState([]);
    const [overusedSongs, setOverusedSongs] = useState([]);

    // =========================
    // TOP 5 CANCIONES
    // =========================

    const getTopSongs = async () => {

        try {

            const response = await API.get("/songs");

            const sortedSongs = response.data

                .filter(song => song.timesPlayed !== null)

                .sort((a, b) => b.timesPlayed - a.timesPlayed)

                .slice(0, 5);

            setTopSongs(sortedSongs);

        } catch (error) {

            console.error(error);

        }

    };

    // =========================
    // CANCIONES MENOS USADAS
    // =========================

    const getUnusedSongs = async () => {

        try {

            const response = await API.get("/songs");

            const songs = [...response.data]

                .sort((a, b) =>

                    (a.timesPlayed || 0) -

                    (b.timesPlayed || 0)

                )

                .slice(0, 10);

            setUnusedSongs(songs);

        } catch (error) {

            console.error(error);

        }

    };

    // =========================
    // CANCIONES MÁS USADAS
    // =========================

    const getOverusedSongs = async () => {

        try {

            const response = await API.get("/songs");

            const songs = response.data

                .filter(song => (song.timesPlayed || 0) >= 5)

                .sort((a, b) => b.timesPlayed - a.timesPlayed)

                .slice(0, 10);

            setOverusedSongs(songs);

        } catch (error) {

            console.error(error);

        }

    };

    // =========================
    // EXPORTAR
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