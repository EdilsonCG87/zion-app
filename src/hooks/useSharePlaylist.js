// =========================
// IMPORTS
// =========================
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

// =========================
// HOOK
// =========================
export function useSharePlaylist() {

    // =========================
    // COMPARTIR WHATSAPP
    // =========================

    const shareWhatsApp = (

        playlists,

        selectedPlaylist,

        playlistSongs,

        songs

    ) => {

        if (
            !selectedPlaylist ||
            playlistSongs.length === 0
        ) {

            Swal.fire({

                icon: "warning",

                title: "Sin información",

                text: "Selecciona un culto con canciones"

            });

            return;

        }

        const playlist = playlists.find(

            p => p.id === Number(selectedPlaylist)

        );

        let message =
`🎼 ZION Playlist

⛪ ${playlist?.name}

📅 ${playlist?.serviceDate}

`;

        playlistSongs.forEach((item, index) => {

            const song = songs.find(

                s => s.id === item.songId

            );

            message += `${index + 1}. ${song?.name}\n`;

        });

        message += "\n🙏 Bendiciones";

        const url =
            `https://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");

    };

    // =========================
    // EXPORTAR PDF
    // =========================

    const exportPlaylistPDF = (

        playlists,

        selectedPlaylist,

        playlistSongs,

        songs

    ) => {

        if (playlistSongs.length === 0) {

            Swal.fire({

                icon: "warning",

                title: "Sin canciones",

                text: "No hay canciones para exportar"

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

        const selected = playlists.find(

            p => p.id === Number(selectedPlaylist)

        );

        pdf.text(

            `Culto: ${selected?.name || "Sin nombre"}`,

            20,

            35

        );

        let y = 50;

        playlistSongs.forEach((item, index) => {

            const song = songs.find(

                s => s.id === item.songId

            );

            pdf.text(

                `${index + 1}. ${song?.name || "Canción"}`,

                20,

                y

            );

            y += 10;

        });

        pdf.save("orden-culto-zion.pdf");

        Swal.fire({

            icon: "success",

            title: "PDF exportado"

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

// =========================
// FIN DEL HOOK
// =========================