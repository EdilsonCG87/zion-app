import { useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

export function useReports() {

    // =========================
    // STATES
    // =========================

    const [songHistory, setSongHistory] = useState([]);
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

        try {

            if (!songId) {

                setSongHistory([]);
                return;

            }

            const response = await API.get(
                `/song-usage/${songId}`
            );

            setSongHistory(response.data);

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No fue posible cargar el historial"
            });

        }

    };

    // =========================
    // REPORTE POR AÑO
    // =========================

    const getYearUsage = async (year) => {

        try {

            const response = await API.get(
                `/song-usage/by-year/${year}`
            );

            const usageData = response.data;

            setYearUsage(usageData);

            const months = [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic"
            ];

            const monthlyData = Array(12).fill(0);

            usageData.forEach(item => {

                const date = new Date(item.serviceDate);

                monthlyData[
                    date.getMonth()
                ]++;

            });

            setMonthlyStats(

                months.map((month, index) => ({

                    month,

                    count: monthlyData[index]

                }))

            );

            const uniqueSongs = [

                ...new Set(

                    usageData.map(

                        item => item.song?.id

                    )

                )

            ];

            const songCount = {};

            usageData.forEach(item => {

                const songName = item.song?.name;

                if (!songName) return;

                songCount[songName] =

                    (songCount[songName] || 0) + 1;

            });

            let topSong = null;
            let topCount = 0;

            Object.entries(songCount).forEach(

                ([name, count]) => {

                    if (count > topCount) {

                        topSong = name;
                        topCount = count;

                    }

                }

            );

            const uniqueServices = [

                ...new Set(

                    usageData.map(

                        item => item.playlist?.id

                    )

                )

            ];

            setYearStats({

                totalServices: uniqueServices.length,

                totalSongs: usageData.length,

                uniqueSongs: uniqueSongs.length,

                mostUsedSong: topSong,

                mostUsedCount: topCount

            });

        } catch (error) {

            console.error(error);

        }

    };

    // =========================
    // EXPORTAR
    // =========================

    return {

        songHistory,
        yearUsage,
        yearStats,
        monthlyStats,

        getSongHistory,
        getYearUsage

    };

}