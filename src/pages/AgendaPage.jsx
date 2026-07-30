import CalendarAgenda from "../components/agenda/CalendarAgenda";

function AgendaPage(props) {
    const {
        playlists,
        playlistSongs,
        songs,
        getPlaylistSongs
    } = props;
    return (
        <div className="tab-content">
            <CalendarAgenda
                playlists={playlists}
                playlistSongs={playlistSongs}
                songs={songs}
                getPlaylistSongs={getPlaylistSongs}
            />
        </div>
    );
}
export default AgendaPage;