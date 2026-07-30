import PlaylistManager from "../components/playlist/PlaylistManager";
import PlaylistHistory from "../components/playlist/PlaylistHistory";
import OverusedSongs from "../components/dashboard/OverusedSongs";
import ActivePlaylist from "../components/playlist/ActivePlaylist";

function PlaylistPage(props) {
    return (
        <div className="tab-content">
            <PlaylistManager {...props} />
            <ActivePlaylist {...props} />
            <PlaylistSongs {...props} />
            <PlaylistHistory {...props} />            
        </div>
    );
}

export default PlaylistPage;