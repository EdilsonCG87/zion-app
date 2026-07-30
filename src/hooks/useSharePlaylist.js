import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

export function useSharePlaylist({

    playlists,

    selectedPlaylist,

    playlistSongs,

    songs

}) {

    const shareWhatsApp = () => {

        if (!selectedPlaylist || playlistSongs.length === 0) {

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

        window.open(

            `https://wa.me/?text=${encodeURIComponent(message)}`,

            "_blank"

        );

    };

    const exportPlaylistPDF = () => {

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

        const playlist = playlists.find(

            p => p.id === Number(selectedPlaylist)

        );

        pdf.text(

            `Culto: ${playlist?.name ?? "Sin nombre"}`,

            20,

            35

        );

        let y = 50;

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

        });

        pdf.save("orden-culto-zion.pdf");

        Swal.fire({

            icon: "success",

            title: "PDF exportado"

        });

    };

    return {

        shareWhatsApp,

        exportPlaylistPDF

    };

}