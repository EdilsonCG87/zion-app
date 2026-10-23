
import Dashboard from "../components/dashboard/Dashboard";
import TopSongs from "../components/dashboard/TopSongs";

function DashboardPage({
    songs,
    playlists,
    topSongs,
    unusedSongs,
    showTopSongs,
    setShowTopSongs,
    showUnusedSongs,
    setShowUnusedSongs
}) {
    return (
        <div className="tab-content">
            <Dashboard
                totalSongs={songs.length}
                totalServices={playlists.length}
                mostUsedSong={topSongs[0]}
            />

            <TopSongs
                topSongs={topSongs}
                showTopSongs={showTopSongs}
                setShowTopSongs={setShowTopSongs}
            />

            <TopSongs
                topSongs={unusedSongs}
                showTopSongs={showUnusedSongs}
                setShowTopSongs={setShowUnusedSongs}
                title="Canciones menos utilizadas"
                icon="🎵"
                emptyMessage="No hay canciones registradas"
            />
        </div>
    );
}

export default DashboardPage;
