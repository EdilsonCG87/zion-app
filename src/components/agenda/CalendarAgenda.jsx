import React from "react";
function CalendarAgenda({
playlists,
playlistSongs,
songs,
getPlaylistSongs
}) {

const [currentDate, setCurrentDate] = React.useState(new Date());
const [selectedService, setSelectedService] = React.useState(null);
const [selectedSongs, setSelectedSongs] = React.useState([]);
const month = currentDate.getMonth();
const year = currentDate.getFullYear();
const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
const daysInMonth = new Date(year, month + 1, 0 ).getDate();
const days = [];

for (let i = 0; i < firstDay; i++) {
    days.push(null); }

for (let i = 1; i <= daysInMonth; i++) {
    days.push(i); }

const getServiceStatus = (serviceDate) => {
const today = new Date(); today.setHours(0, 0, 0, 0);
const service = new Date(serviceDate); service.setHours(0, 0, 0, 0);

if (service.getTime() < today.getTime()) {
return "done";
}
    if (service.getTime() === today.getTime()) {
        return "today";
    }

    return "future";
};

const getSongsForService = async (playlistId) => {

    try {

        const playlistItems =
            await getPlaylistSongs(playlistId);

        const serviceSongs =
            playlistItems
                .map(item =>
                    songs.find(
                        song =>
                            song.id === item.songId
                    )
                )
                .filter(Boolean);

        setSelectedSongs(serviceSongs);

    } catch (error) {

        console.error(
            "Error al cargar canciones del culto:",
            error
        );

        setSelectedSongs([]);

    }

};


const hasService = (day) => {

return playlists.find((playlist) => {

    const [yearStr, monthStr, dayStr] =
    playlist.serviceDate.split("-");

    const serviceDate =
    new Date(
        Number(yearStr),
        Number(monthStr) - 1,
        Number(dayStr)
    );

    return (
    serviceDate.getDate() === day &&
    serviceDate.getMonth() === month &&
    serviceDate.getFullYear() === year
    );

});

};

return (

<div className="calendar-card">

<h2>
📅 Agenda del Mes
</h2>

<div className="calendar-header">

<button
    onClick={() => {

        setSelectedService(null);
        setSelectedSongs([]);

        setCurrentDate(
            new Date(
                year,
                month - 1,
                1
            )
        );

    }}
>
    ◀
</button>

<h3>
    {currentDate.toLocaleDateString(
    "es-ES",
    {
        month: "long",
        year: "numeric"
    }
    )}
</h3>

<button
    onClick={() => {

        setSelectedService(null);
        setSelectedSongs([]);

        setCurrentDate(
            new Date(
                year,
                month + 1,
                1
            )
        );

    }}
>
    ▶
</button>

</div>

<div className="calendar-grid">

<div className="calendar-weekday">L</div>
<div className="calendar-weekday">M</div>
<div className="calendar-weekday">Mi</div>
<div className="calendar-weekday">J</div>
<div className="calendar-weekday">V</div>
<div className="calendar-weekday">S</div>
<div className="calendar-weekday">D</div>

{days.map((day,index)=>{

const service =
day
? hasService(day)
: null;

return (

<div
    key={index}
    className={`calendar-day ${
        day &&
        day === currentDay &&
        month === currentMonth &&
        year === currentYear
        ? "today"
        : ""
    }`}
    onClick={async () => {

    if (!service) return;

    setSelectedService(service);

    await getSongsForService(
        service.id
    );

}}
>

    {day}

{service && (

    <span className="service-dot">

        {
            getServiceStatus(
                service.serviceDate
            ) === "done"
                ? "🟢"
                : getServiceStatus(
                    service.serviceDate
                ) === "today"
                ? "🟡"
                : "🔵"
        }

    </span>

)}

</div>
);
})}

</div>

<div className="calendar-legend">

<span className="service-dot">🔵 Programado</span>
<span className="service-dot">🟢 Realizado</span>
<span className="service-dot">🟡 Hoy</span>

</div>

{selectedService && (

<div className="selected-service-card">

    <h3>
        🎵 {selectedService.name}
    </h3>

    <p>
        📅 {selectedService.serviceDate}
    </p>

    <p>

        Estado:{" "}

        {
            getServiceStatus(
                selectedService.serviceDate
            ) === "done"
                ? "🟢 Realizado"
                : getServiceStatus(
                    selectedService.serviceDate
                ) === "today"
                ? "🟡 Hoy"
                : "🔵 Programado"
        }

    </p>

    <p>

        🎼 Canciones:
        {" "}
        {selectedSongs.length}

    </p>

    {selectedSongs.length > 0 && (

        <ul
            style={{
                marginTop: "15px",
                textAlign: "left"
            }}
        >

            {selectedSongs.map(
                (song) => (

                <li
                    key={song.id}
                >
                    🎵 {song.name}
                </li>

            ))}

        </ul>

    )}

</div>

)}

    </div>
);
}
export default CalendarAgenda;