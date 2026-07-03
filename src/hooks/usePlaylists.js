import { useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

export function usePlaylists() {

    const [playlists, setPlaylists] = useState([]);
    const getPlaylists = async () => {
        try {
            const response = await API.get("/playlists");
            setPlaylists(response.data);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No fue posible cargar playlists"
            });

        }

    };

    return {

        playlists,
        setPlaylists,
        getPlaylists

    };

}