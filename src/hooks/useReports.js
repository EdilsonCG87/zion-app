// =========================
// IMPORTS
// =========================
import { useRef, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

// =========================
// HOOK
// =========================
export function useReports() {

    // =========================
    // STATES
    // =========================

    const historyRequestId = useRef(0);

    const [songHistory, setSongHistory] = useState([]);

    const [selectedHistorySong, setSelectedHistorySong] = useState("");

    const [yearUsage, setYearUsage] = useState([]);

    const [yearStats, setYearStats] = useState({

        totalServices: 0,

        totalSongs: 0,

        uniqueSongs: 0,

        mostUsedSong: null,

        mostUsedCount: 0

    });

    const [monthlyStats, setMonthlyStats] = useState([]);

// =========================
// HISTORIAL DE UNA CANCIÓN
// =========================

const getSongHistory = async (songId) => {

    // Limpiar inmediatamente
    // el historial anterior
    setSongHistory([]);

    if (!songId) {
        return;
    }

    try {

        const { data } = await API.get(
            `/song-usage/${songId}`
        );

        setSongHistory(
            Array.isArray(data)
                ? data
                : []
        );

    } catch (error) {

        console.error(error);

        setSongHistory([]);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No fue posible cargar el historial."
        });
    }
};

    // =========================
    // REPORTE ANUAL
    // =========================

    const getYearUsage = async (year) => {

        try {

            const { data } = await API.get(
                `/song-usage/by-year/${year}`
            );

            setYearUsage(data);

            // =========================
            // ESTADÍSTICAS POR MES
            // =========================

            const months = [

                "Ene", "Feb", "Mar", "Abr",
                "May", "Jun", "Jul", "Ago",
                "Sep", "Oct", "Nov", "Dic"

            ];

            const monthlyData = Array(12).fill(0);

            data.forEach(item => {

                const date = new Date(item.serviceDate);

                monthlyData[date.getMonth()]++;

            });

            setMonthlyStats(

                months.map((month, index) => ({

                    month,

                    count: monthlyData[index]

                }))

            );

            // =========================
            // CANCIONES ÚNICAS
            // =========================

            const uniqueSongs = new Set(

                data.map(item => item.song?.id)

            );

            // =========================
            // CULTO ÚNICOS
            // =========================

            const uniqueServices = new Set(

                data.map(item => item.playlist?.id)

            );

            // =========================
            // CANCIÓN MÁS USADA
            // =========================

            const songCounter = {};

            data.forEach(item => {

                const name = item.song?.name;

                if (!name) return;

                songCounter[name] =

                    (songCounter[name] || 0) + 1;

            });

            let mostUsedSong = null;

            let mostUsedCount = 0;

            Object.entries(songCounter).forEach(

                ([name, count]) => {

                    if (count > mostUsedCount) {

                        mostUsedSong = name;

                        mostUsedCount = count;

                    }

                }

            );

            // =========================
            // RESUMEN
            // =========================

            setYearStats({

                totalServices: uniqueServices.size,

                totalSongs: data.length,

                uniqueSongs: uniqueSongs.size,

                mostUsedSong,

                mostUsedCount

            });

        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",

                title: "Error",

                text: "No fue posible generar el reporte."

            });

        }

    };

    // =========================
    // RETURN
    // =========================

    return {

        selectedHistorySong,
        setSelectedHistorySong,

        songHistory,

        yearUsage,

        yearStats,

        monthlyStats,

        getSongHistory,

        getYearUsage

    };

}

// =========================
// FIN DEL HOOK
// =========================