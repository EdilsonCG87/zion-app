import PlaylistManager from "../components/PlaylistManager";
import PlaylistHistory from "../components/PlaylistHistory";
import OverusedSongs from "../components/OverusedSongs";
import ActivePlaylist from "../components/ActivePlaylist";

function PlaylistPage(props) {

    return (

        <div className="tab-content">

            <PlaylistManager
                {...props}
            />

            <PlaylistHistory
                {...props}
            />

            <OverusedSongs
                {...props}
            />

            <ActivePlaylist
                {...props}
            />

        </div>

    );

}

export default PlaylistPage;