function Dashboard({
totalSongs,
totalServices,
mostUsedSong
}) {

return (
<div className="stats-container">
<div className="stat-card">
<h3>🎵 Canciones</h3>
<h2>{totalSongs}</h2>
</div>

<div className="stat-card">
<h3>⛪ Cultos</h3>
<h2>{totalServices}</h2>
</div>

<div className="stat-card">
<h3>🔥 Más usada</h3>
<h2>
{mostUsedSong?.name || "-"}
</h2>
</div>
</div>
);
}
export default Dashboard;