import { useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

export function useSongs() {
    // =========================
    // STATES
    // =========================
    const [songs, setSongs] = useState([]);
    const [search, setSearch] = useState("");
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [keyTone, setKeyTone] = useState("");
    const [bpm, setBpm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [deletedSong, setDeletedSong] = useState(null);

    // aquí irán todas las funciones

// =========================
// OBTENER CANCIONES
// =========================

const getSongs = async () => {

    try {

        const response = await API.get("/songs");

        setSongs(response.data);

    } catch (error) {

        console.error(error);

    }

};
    return {

    songs,
    setSongs,

    search,
    setSearch,

    name,
    setName,

    author,
    setAuthor,

    keyTone,
    setKeyTone,

    bpm,
    setBpm,

    editingId,
    setEditingId,

    deletedSong,
    setDeletedSong,

    getSongs

};

}