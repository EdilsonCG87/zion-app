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
    console.log("playlists:", playlists);
    console.log("Array:", Array.isArray(playlists));

// =========================
// OBTENER CULTO SELECCIONADO
// =========================

    const selected = Array.isArray(playlists)
    ? playlists.find(
        playlist => playlist.id === Number(selectedPlaylist)
      )
    : null;
// =========================
// COMPARTIR POR WHATSAPP
// =========================

    const shareWhatsApp = () => {

        if (!selectedPlaylist || playlistSongs.length === 0) {

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

        playlistSongs.forEach((item, index) => {

            const song = songs.find(
                s => s.id === item.songId
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

        if (!selectedPlaylist || playlistSongs.length === 0) {

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

        playlistSongs.forEach((item, index) => {

            const song = songs.find(
                s => s.id === item.songId
            );

            pdf.text(
                `${index + 1}. ${song?.name ?? "Canción"}`,
                20,
                y
            );

            y += 10;

            // Nueva página cuando se llena
            if (y > 270) {
                pdf.addPage();
                y = 20;
            }

        });

        pdf.save("orden-culto-zion.pdf");

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