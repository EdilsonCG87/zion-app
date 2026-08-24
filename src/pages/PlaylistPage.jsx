import PlaylistManager from "../components/playlist/PlaylistManager";

import ActivePlaylist from "../components/playlist/ActivePlaylist";

import PlaylistSongs from "../components/playlist/PlaylistSongs";

// =========================
// COMPONENTE
// =========================

function PlaylistPage(props) {

    return (

        <div className="tab-content">

            <PlaylistManager {...props} />

            <ActivePlaylist {...props} />

            <PlaylistSongs {...props} />

        </div>

    );

}

export default PlaylistPage;