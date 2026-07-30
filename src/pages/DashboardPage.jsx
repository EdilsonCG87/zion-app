import Dashboard from "../components/Dashboard";
import TopSongs from "../components/TopSongs";

function DashboardPage({
    songs,
    playlists,
    topSongs,
    showTopSongs,
    setShowTopSongs
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
        </div>
    );
}
export default DashboardPage;