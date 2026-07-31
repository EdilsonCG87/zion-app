import PlaylistManager from "../components/playlist/PlaylistManager";
import ActivePlaylist from "../components/playlist/ActivePlaylist";
import PlaylistSongs from "../components/playlist/PlaylistSongs";
import PlaylistHistory from "../components/playlist/PlaylistHistory";
//import OverusedSongs from "../components/dashboard/OverusedSongs";

function PlaylistPage(props) {

    return (

        <div className="tab-content">

            <PlaylistManager {...props} />

            <ActivePlaylist {...props} />

            <PlaylistSongs {...props} />

            <PlaylistHistory {...props} />

            {/* Lo dejamos preparado para cuando implementemos las estadísticas */}
            {/* <OverusedSongs {...props} /> */}

        </div>

    );

}

export default PlaylistPage;