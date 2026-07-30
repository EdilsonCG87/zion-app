import PlaylistManager from "../components/playlist/PlaylistManager";
import PlaylistHistory from "../components/playlist/PlaylistHistory";
import OverusedSongs from "../components/OverusedSongs";
import ActivePlaylist from "../components/playlist/ActivePlaylist";

function PlaylistPage(props) {
    return (
        <div className="tab-content">
            <PlaylistManager {...props} />
            <PlaylistHistory {...props} />
            <OverusedSongs {...props} />
            <ActivePlaylist {...props} />
        </div>
    );
}

export default PlaylistPage;