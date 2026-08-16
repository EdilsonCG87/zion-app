import React from "react";

function CalendarAgenda({
    playlists,
    playlistSongs,
    songs,
    getPlaylistSongs
}) {

    // =========================
    // STATES
    // =========================

    const [currentDate, setCurrentDate] =
        React.useState(new Date());

    const [selectedService, setSelectedService] =
        React.useState(null);

    const [selectedSongs, setSelectedSongs] =
        React.useState([]);


    // =========================
    // DATOS DEL CALENDARIO
    // =========================

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();


    // =========================
    // FECHA ACTUAL
    // =========================

    const today = new Date();

    const currentDay =
        today.getDate();

    const currentMonth =
        today.getMonth();

    const currentYear =
        today.getFullYear();


    // =========================
    // PRIMER DÍA DEL MES
    // =========================

    const firstDay =
        (
            new Date(
                year,
                month,
                1
            ).getDay() + 6
        ) % 7;


    // =========================
    // DÍAS DEL MES
    // =========================

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const days = [];


    // Espacios antes del primer día

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        days.push(null);

    }


    // Días reales

    for (
        let i = 1;
        i <= daysInMonth;
        i++
    ) {

        days.push(i);

    }


    // =========================
    // ESTADO DEL CULTO
    // =========================

    const getServiceStatus = (
        serviceDate
    ) => {

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const service =
            new Date(serviceDate);

        service.setHours(
            0,
            0,
            0,
            0
        );


        if (
            service.getTime() <
            today.getTime()
        ) {

            return "done";

        }


        if (
            service.getTime() ===
            today.getTime()
        ) {

            return "today";

        }


        return "future";

    };


    // =========================
    // OBTENER CANCIONES DEL CULTO
    // =========================

    const getSongsForService =
        async (playlistId) => {

            try {

                const playlistItems =
                    await getPlaylistSongs(
                        playlistId
                    );


                const serviceSongs =
                    playlistItems
                        .map(item =>
                            songs.find(
                                song =>
                                    song.id ===
                                    item.songId
                            )
                        )
                        .filter(Boolean);


                setSelectedSongs(
                    serviceSongs
                );

            }
            catch (error) {

                console.error(
                    "Error al cargar canciones del culto:",
                    error
                );


                setSelectedSongs([]);

            }

        };


    // =========================
    // BUSCAR CULTO POR DÍA
    // =========================

    const hasService = (day) => {

        return playlists.find(
            (playlist) => {

                const [
                    yearStr,
                    monthStr,
                    dayStr
                ] =
                    playlist.serviceDate
                        .split("-");


                const serviceDate =
                    new Date(
                        Number(yearStr),
                        Number(monthStr) - 1,
                        Number(dayStr)
                    );


                return (

                    serviceDate.getDate() ===
                    day &&

                    serviceDate.getMonth() ===
                    month &&

                    serviceDate.getFullYear() ===
                    year

                );

            }
        );

    };


    // =========================
    // MESES
    // =========================

    const months = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    // =========================
    // AÑOS DISPONIBLES
    // =========================

    const currentCalendarYear =
        new Date().getFullYear();


    const years = [];

    for (
        let y =
            currentCalendarYear - 5;

        y <=
            currentCalendarYear + 5;

        y++
    ) {

        years.push(y);

    }


    // =========================
    // CAMBIAR MES
    // =========================

    const handleMonthChange = (
        event
    ) => {

        const newMonth =
            Number(event.target.value);


        setSelectedService(null);

        setSelectedSongs([]);


        setCurrentDate(
            new Date(
                year,
                newMonth,
                1
            )
        );

    };


    // =========================
    // CAMBIAR AÑO
    // =========================

    const handleYearChange = (
        event
    ) => {

        const newYear =
            Number(event.target.value);


        setSelectedService(null);

        setSelectedSongs([]);


        setCurrentDate(
            new Date(
                newYear,
                month,
                1
            )
        );

    };


    // =========================
    // MES ANTERIOR
    // =========================

    const previousMonth = () => {

        setSelectedService(null);

        setSelectedSongs([]);


        setCurrentDate(
            new Date(
                year,
                month - 1,
                1
            )
        );

    };


    // =========================
    // MES SIGUIENTE
    // =========================

    const nextMonth = () => {

        setSelectedService(null);

        setSelectedSongs([]);


        setCurrentDate(
            new Date(
                year,
                month + 1,
                1
            )
        );

    };


    // =========================
    // RENDER
    // =========================

    return (

        <div className="calendar-card">

            {/* =========================
                TÍTULO
            ========================= */}

            <h2>
                📅 Agenda del Mes
            </h2>


            {/* =========================
                CABECERA
            ========================= */}

            <div className="calendar-header">


                {/* MES ANTERIOR */}

                <button
                    onClick={
                        previousMonth
                    }
                >
                    ◀
                </button>


                {/* SELECTORES */}

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap"
                    }}
                >

                    {/* SELECTOR MES */}

                    <select
                        value={month}
                        onChange={
                            handleMonthChange
                        }
                        style={{
                            padding: "10px 14px",
                            borderRadius: "10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >

                        {months.map(
                            (
                                monthName,
                                index
                            ) => (

                                <option
                                    key={index}
                                    value={index}
                                >

                                    {monthName}

                                </option>

                            )
                        )}

                    </select>


                    {/* SELECTOR AÑO */}

                    <select
                        value={year}
                        onChange={
                            handleYearChange
                        }
                        style={{
                            padding: "10px 14px",
                            borderRadius: "10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >

                        {years.map(
                            (yearValue) => (

                                <option
                                    key={
                                        yearValue
                                    }
                                    value={
                                        yearValue
                                    }
                                >

                                    {yearValue}

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* MES SIGUIENTE */}

                <button
                    onClick={
                        nextMonth
                    }
                >
                    ▶
                </button>

            </div>


            {/* =========================
                CALENDARIO
            ========================= */}

            <div className="calendar-grid">


                {/* DÍAS DE LA SEMANA */}

                <div className="calendar-weekday">
                    L
                </div>

                <div className="calendar-weekday">
                    M
                </div>

                <div className="calendar-weekday">
                    Mi
                </div>

                <div className="calendar-weekday">
                    J
                </div>

                <div className="calendar-weekday">
                    V
                </div>

                <div className="calendar-weekday">
                    S
                </div>

                <div className="calendar-weekday">
                    D
                </div>


                {/* DÍAS */}

                {days.map(
                    (day, index) => {

                        const service =
                            day
                                ? hasService(day)
                                : null;


                        return (

                            <div

                                key={index}

                                className={`
                                    calendar-day
                                    ${
                                        day &&
                                        day ===
                                            currentDay &&
                                        month ===
                                            currentMonth &&
                                        year ===
                                            currentYear
                                            ? "today"
                                            : ""
                                    }
                                `}

                                onClick={
                                    async () => {

                                        if (
                                            !service
                                        ) {
                                            return;
                                        }


                                        setSelectedService(
                                            service
                                        );


                                        await getSongsForService(
                                            service.id
                                        );

                                    }
                                }

                            >

                                {day}


                                {/* INDICADOR DE CULTO */}

                                {service && (

                                    <span
                                        className="service-dot"
                                    >

                                        {
                                            getServiceStatus(
                                                service.serviceDate
                                            ) ===
                                            "done"

                                                ? "🟢"

                                                : getServiceStatus(
                                                    service.serviceDate
                                                ) ===
                                                "today"

                                                    ? "🟡"

                                                    : "🔵"
                                        }

                                    </span>

                                )}

                            </div>

                        );

                    }
                )}

            </div>


            {/* =========================
                LEYENDA
            ========================= */}

            <div className="calendar-legend">

                <span className="service-dot">
                    🔵 Programado
                </span>

                <span className="service-dot">
                    🟢 Realizado
                </span>

                <span className="service-dot">
                    🟡 Hoy
                </span>

            </div>


            {/* =========================
                INFORMACIÓN DEL CULTO
            ========================= */}

            {selectedService && (

                <div
                    className="selected-service-card"
                >

                    <h3>
                        🎵{" "}
                        {selectedService.name}
                    </h3>


                    <p>
                        📅{" "}
                        {
                            selectedService.serviceDate
                        }
                    </p>


                    <p>

                        Estado:{" "}

                        {
                            getServiceStatus(
                                selectedService.serviceDate
                            ) ===
                            "done"

                                ? "🟢 Realizado"

                                : getServiceStatus(
                                    selectedService.serviceDate
                                ) ===
                                "today"

                                    ? "🟡 Hoy"

                                    : "🔵 Programado"
                        }

                    </p>


                    <p>

                        🎼 Canciones:{" "}

                        {
                            selectedSongs.length
                        }

                    </p>


                    {/* LISTADO DE CANCIONES */}

                    {selectedSongs.length >
                        0 && (

                        <ul
                            style={{
                                marginTop:
                                    "15px",
                                textAlign:
                                    "left"
                            }}
                        >

                            {selectedSongs.map(
                                (song) => (

                                    <li
                                        key={
                                            song.id
                                        }
                                    >

                                        🎵{" "}
                                        {song.name}

                                    </li>

                                )
                            )}

                        </ul>

                    )}

                </div>

            )}

        </div>

    );

}

export default CalendarAgenda;