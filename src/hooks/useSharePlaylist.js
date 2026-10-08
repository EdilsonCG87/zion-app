// =========================
// IMPORTS
// =========================

import Swal from "sweetalert2";
import { Capacitor } from "@capacitor/core";
import {
    Filesystem,
    Directory
} from "@capacitor/filesystem";
import {
    Share
} from "@capacitor/share";

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

    const exportPlaylistPDF = async () => {

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

        try {

            // =========================
            // GENERAR PDF
            // =========================

            const { jsPDF } = await import("jspdf");

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

            // =========================
            // ANDROID / CAPACITOR
            // =========================

            if (Capacitor.isNativePlatform()) {

                const dataUri =
                    pdf.output("datauristring");

                const base64Data =
                    dataUri.split(",")[1];

                const fileName =
                    `orden-culto-zion-${Date.now()}.pdf`;

                const savedFile =
                    await Filesystem.writeFile({
                        path: fileName,
                        data: base64Data,
                        directory: Directory.Cache
                    });

                const fileUri =
                    await Filesystem.getUri({
                        path: fileName,
                        directory: Directory.Cache
                    });

                await Share.share({
                    title: "Orden del Culto - ZION Playlist",
                    text: "Orden del culto generada desde ZION Playlist.",
                    url: fileUri.uri,
                    dialogTitle: "Compartir o abrir PDF"
                });

                console.log(
                    "ZION PDF ANDROID:",
                    savedFile,
                    fileUri
                );

            } else {

                // =========================
                // NAVEGADOR / PC
                // =========================

                pdf.save(
                    "orden-culto-zion.pdf"
                );
            }

            // =========================
            // MENSAJE
            // =========================

            Swal.fire({
                icon: "success",
                title: "PDF exportado",
                text: Capacitor.isNativePlatform()
                    ? "El PDF está listo para abrir o compartir."
                    : "El PDF fue descargado correctamente.",
                timer: 1800,
                showConfirmButton: false
            });

        } catch (error) {

            console.error(
                "ZION PDF ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Error al exportar PDF",
                text: "No fue posible generar o abrir el PDF."
            });
        }
    };

    // =========================
    // RETURN
    // =========================

    return {

        shareWhatsApp,
        exportPlaylistPDF

    };
}