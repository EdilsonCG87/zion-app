// ========================================================
// IMPORTS
// ========================================================

import {
    useCallback,
    useRef,
    useState
} from "react";

import API from "../services/api";
import Swal from "sweetalert2";


// ========================================================
// HOOK
// ========================================================

export function useReports() {

    // ========================================================
    // STATES
    // ========================================================

    const historyRequestId = useRef(0);

    const [songHistory, setSongHistory] = useState([]);

    const [selectedHistorySong, setSelectedHistorySong] =
        useState("");

    const [yearUsage, setYearUsage] = useState([]);

    const [yearStats, setYearStats] = useState({

        totalServices: 0,

        totalSongs: 0,

        uniqueSongs: 0,

        mostUsedSong: null,

        mostUsedCount: 0

    });

    const [monthlyStats, setMonthlyStats] = useState([]);


    // ========================================================
    // HISTORIAL DE UNA CANCIÓN
    // ========================================================
    //
    // Se utiliza un identificador de solicitud para impedir
    // que una respuesta antigua sobrescriba el historial de
    // una canción seleccionada posteriormente.
    //
    // ========================================================

    const getSongHistory = useCallback(async (songId) => {

        // ----------------------------------------------------
        // Generar identificador de esta solicitud
        // ----------------------------------------------------

        const requestId =
            ++historyRequestId.current;


        // ----------------------------------------------------
        // Limpiar inmediatamente el historial anterior
        // ----------------------------------------------------

        setSongHistory([]);


        // ----------------------------------------------------
        // Si no existe canción seleccionada
        // ----------------------------------------------------

        if (!songId) {
            return;
        }


        try {

            // ------------------------------------------------
            // Consultar historial
            // ------------------------------------------------

            const { data } = await API.get(
                `/song-usage/${songId}`
            );


            // ------------------------------------------------
            // Verificar que esta siga siendo la solicitud
            // vigente.
            // ------------------------------------------------

            if (
                requestId !== historyRequestId.current
            ) {
                return;
            }


            // ------------------------------------------------
            // Guardar historial
            // ------------------------------------------------

            setSongHistory(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            // ------------------------------------------------
            // Si ya existe una solicitud posterior,
            // no modificar el estado con este error.
            // ------------------------------------------------

            if (
                requestId !== historyRequestId.current
            ) {
                return;
            }


            console.error(
                "Error al obtener historial:",
                error
            );

            setSongHistory([]);

            Swal.fire({

                icon: "error",

                title: "Error",

                text:
                    "No fue posible cargar el historial."

            });
        }

    }, []);


    // ========================================================
    // REPORTE ANUAL
    // ========================================================

    const getYearUsage = useCallback(async (year) => {

        try {

            // ------------------------------------------------
            // Consultar utilización del año
            // ------------------------------------------------

            const { data } = await API.get(
                `/song-usage/by-year/${year}`
            );


            const usage =
                Array.isArray(data)
                    ? data
                    : [];


            setYearUsage(usage);


            // =================================================
            // ESTADÍSTICAS POR MES
            // =================================================

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


            const monthlyData =
                Array(12).fill(0);


            usage.forEach((item) => {

                if (!item.serviceDate) {
                    return;
                }


                // ------------------------------------------------
                // serviceDate esperado:
                // YYYY-MM-DD
                //
                // Se evita new Date() para impedir desplazamientos
                // por zona horaria.
                // ------------------------------------------------

                const parts =
                    String(item.serviceDate).split("-");


                if (parts.length !== 3) {
                    return;
                }


                const month =
                    Number(parts[1]);


                if (
                    Number.isInteger(month) &&
                    month >= 1 &&
                    month <= 12
                ) {

                    monthlyData[month - 1]++;

                }

            });


            setMonthlyStats(

                months.map(
                    (month, index) => ({

                        month,

                        count:
                            monthlyData[index]

                    })
                )

            );


            // =================================================
            // CANCIONES ÚNICAS
            // =================================================

            const uniqueSongs =
                new Set(

                    usage

                        .map(
                            (item) =>
                                item.song?.id
                        )

                        .filter(
                            (id) =>
                                id !== null &&
                                id !== undefined
                        )

                );


            // =================================================
            // CULTOS ÚNICOS
            // =================================================

            const uniqueServices =
                new Set(

                    usage

                        .map(
                            (item) =>
                                item.playlist?.id
                        )

                        .filter(
                            (id) =>
                                id !== null &&
                                id !== undefined
                        )

                );


            // =================================================
            // CANCIÓN MÁS UTILIZADA
            // =================================================

            const songCounter = {};


            usage.forEach((item) => {

                const name =
                    item.song?.name;


                if (!name) {
                    return;
                }


                songCounter[name] =
                    (songCounter[name] || 0) + 1;

            });


            let mostUsedSong = null;

            let mostUsedCount = 0;


            Object.entries(songCounter)
                .forEach(
                    ([name, count]) => {

                        if (
                            count >
                            mostUsedCount
                        ) {

                            mostUsedSong =
                                name;

                            mostUsedCount =
                                count;

                        }

                    }
                );


            // =================================================
            // RESUMEN
            // =================================================

            setYearStats({

                totalServices:
                    uniqueServices.size,

                totalSongs:
                    usage.length,

                uniqueSongs:
                    uniqueSongs.size,

                mostUsedSong,

                mostUsedCount

            });

        } catch (error) {

            console.error(
                "Error al generar reporte:",
                error
            );


            // ------------------------------------------------
            // Limpiar información para evitar mostrar datos
            // antiguos si la consulta falla.
            // ------------------------------------------------

            setYearUsage([]);

            setMonthlyStats([]);

            setYearStats({

                totalServices: 0,

                totalSongs: 0,

                uniqueSongs: 0,

                mostUsedSong: null,

                mostUsedCount: 0

            });


            Swal.fire({

                icon: "error",

                title: "Error",

                text:
                    "No fue posible generar el reporte."

            });

        }

    }, []);


    // ========================================================
    // RETURN
    // ========================================================

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