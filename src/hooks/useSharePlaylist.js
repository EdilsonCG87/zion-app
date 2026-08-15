// =========================
// IMPORTS
// =========================
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

// =========================
// HOOK
// =========================
export function useSharePlaylist({
    playlists,
    selectedPlaylist,
    playlistSongs,
    songs
}) {

    // =========================
    // DATOS SEGUROS
    // =========================

    const safePlaylists = Array.isArray(playlists)
        ? playlists
        : [];

    const safePlaylistSongs = Array.isArray(playlistSongs)
        ? playlistSongs
        : [];

    const safeSongs = Array.isArray(songs)
        ? songs
        : [];

    // =========================
    // OBTENER CULTO SELECCIONADO
    // =========================

    const selected = safePlaylists.find(
        playlist =>
            playlist.id === Number(selectedPlaylist)
    );

    // =========================
    // COMPARTIR POR WHATSAPP
    // =========================

    const shareWhatsApp = () => {

        if (
            !selectedPlaylist ||
            safePlaylistSongs.length === 0
        ) {

            Swal.fire({
                icon: "warning",
                title: "Sin información",
                text: "Selecciona un culto con canciones."
            });

            return;
        }

        let message = `🎼 ZION Playlist

⛪ ${selected?.name ?? "Culto"}

📅 ${selected?.serviceDate ?? ""}

`;

        safePlaylistSongs.forEach((item, index) => {

            const song = safeSongs.find(
                song => song.id === item.songId
            );

            message += `${index + 1}. ${song?.name ?? "Canción"}\n`;

        });

        message += "\n🙏 Bendiciones";

        window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            "_blank"
        );

    };

    // =========================
    // EXPORTAR PDF
    // =========================

    const exportPlaylistPDF = () => {

        if (
            !selectedPlaylist ||
            safePlaylistSongs.length === 0
        ) {

            Swal.fire({
                icon: "warning",
                title: "Sin canciones",
                text: "No hay canciones para exportar."
            });

            return;
        }

        const pdf = new jsPDF();

        pdf.setFontSize(18);

        pdf.text(
            "ZION Playlist - Orden del Culto",
            20,
            20
        );

        pdf.setFontSize(12);

        pdf.text(
            `Culto: ${selected?.name ?? "Sin nombre"}`,
            20,
            35
        );

        pdf.text(
            `Fecha: ${selected?.serviceDate ?? ""}`,
            20,
            43
        );

        let y = 58;

        safePlaylistSongs.forEach((item, index) => {

            const song = safeSongs.find(
                song => song.id === item.songId
            );

            pdf.text(
                `${index + 1}. ${song?.name ?? "Canción"}`,
                20,
                y
            );

            y += 10;

            // =========================
            // NUEVA PÁGINA
            // =========================

            if (y > 270) {

                pdf.addPage();

                y = 20;

            }

        });

        pdf.save(
            "orden-culto-zion.pdf"
        );

        Swal.fire({
            icon: "success",
            title: "PDF exportado",
            timer: 1200,
            showConfirmButton: false
        });

    };

    // =========================
    // RETURN
    // =========================

    return {

        shareWhatsApp,
        exportPlaylistPDF

    };

}