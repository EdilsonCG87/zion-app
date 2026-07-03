import { useState } from "react";
import API from "../services/api";

export function useDashboard() {

    const [totalSongs, setTotalSongs] = useState(0);
    const [totalServices, setTotalServices] = useState(0);
    const [mostUsedSong, setMostUsedSong] = useState(null);

    const loadDashboard = async () => {

        try {

            const songsResponse = await API.get("/songs");
            const playlistsResponse = await API.get("/playlists");

            const songs = songsResponse.data;

            setTotalSongs(songs.length);
            setTotalServices(playlistsResponse.data.length);

            const sortedSongs = [...songs].sort(
                (a, b) => (b.timesPlayed || 0) - (a.timesPlayed || 0)
            );

            setMostUsedSong(sortedSongs[0] || null);

        } catch (error) {

            console.error("Dashboard:", error);

        }

    };

    return {

        totalSongs,
        totalServices,
        mostUsedSong,
        loadDashboard

    };

}