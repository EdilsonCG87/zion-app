import Swal from "sweetalert2";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export function useSharePlaylist({
    playlists,
    selectedPlaylist,
    playlistSongs,
    songs
}) {
    const safePlaylists = Array.isArray(playlists)
        ? playlists
        : [];

    const safePlaylistSongs = Array.isArray(playlistSongs)
        ? playlistSongs
        : [];

    const safeSongs = Array.isArray(songs)
        ? songs
        : [];

    const selected = safePlaylists.find(
        playlist =>
            playlist.id === Number(selectedPlaylist)
    );

    // =====================================================
    // COMPARTIR POR WHATSAPP
    // =====================================================

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

            message += `${index + 1}. ${
                song?.name ?? "Canción"
            }\n`;
        });

        message += "\n🙏 Bendiciones";

        window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    // =====================================================
    // EXPORTAR PDF
    // =====================================================

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
            const { jsPDF } = await import("jspdf");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            // =================================================
            // CONFIGURACIÓN DE PÁGINA
            // =================================================

            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();

            const margin = 20;

            // =================================================
            // COLORES ZION
            // =================================================

            const azulOscuro = [24, 43, 73];
            const azul = [43, 76, 120];
            const grisTexto = [75, 85, 99];
            const grisClaro = [243, 245, 248];
            const blanco = [255, 255, 255];

            // =================================================
            // ENCABEZADO
            // =================================================

            pdf.setFillColor(
                azulOscuro[0],
                azulOscuro[1],
                azulOscuro[2]
            );

            pdf.rect(
                0,
                0,
                pageWidth,
                42,
                "F"
            );

            // Marca ZION
            pdf.setTextColor(
                blanco[0],
                blanco[1],
                blanco[2]
            );

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(24);

            pdf.text(
                "ZION",
                margin,
                18
            );

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");

            pdf.text(
                "IGLESIA PRESBITERIANA",
                margin,
                26
            );

            pdf.setFontSize(9);

            pdf.text(
                "Orden del Culto",
                pageWidth - margin,
                18,
                {
                    align: "right"
                }
            );

            // =================================================
            // INFORMACIÓN DEL CULTO
            // =================================================

            let y = 58;

            pdf.setTextColor(
                azulOscuro[0],
                azulOscuro[1],
                azulOscuro[2]
            );

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(17);

            pdf.text(
                selected?.name ?? "Culto",
                margin,
                y
            );

            y += 9;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(11);

            pdf.setTextColor(
                grisTexto[0],
                grisTexto[1],
                grisTexto[2]
            );

            pdf.text(
                `Fecha: ${selected?.serviceDate ?? ""}`,
                margin,
                y
            );

            // =================================================
            // LÍNEA SEPARADORA
            // =================================================

            y += 9;

            pdf.setDrawColor(
                azul[0],
                azul[1],
                azul[2]
            );

            pdf.setLineWidth(0.6);

            pdf.line(
                margin,
                y,
                pageWidth - margin,
                y
            );

            // =================================================
            // TÍTULO DE CANCIONES
            // =================================================

            y += 13;

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(13);

            pdf.setTextColor(
                azulOscuro[0],
                azulOscuro[1],
                azulOscuro[2]
            );

            pdf.text(
                "Canciones",
                margin,
                y
            );

            y += 8;

            // =================================================
            // LISTA DE CANCIONES
            // =================================================

            safePlaylistSongs.forEach(
                (item, index) => {
                    const song = safeSongs.find(
                        song =>
                            song.id === item.songId
                    );

                    const songName =
                        song?.name ?? "Canción";

                    // Salto de página
                    if (y > pageHeight - 30) {
                        pdf.addPage();

                        y = 25;

                        // Encabezado pequeño
                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );

                        pdf.setFontSize(11);

                        pdf.setTextColor(
                            azulOscuro[0],
                            azulOscuro[1],
                            azulOscuro[2]
                        );

                        pdf.text(
                            "ZION — Orden del Culto",
                            margin,
                            y
                        );

                        y += 10;
                    }

                    // Fondo de la fila
                    pdf.setFillColor(
                        grisClaro[0],
                        grisClaro[1],
                        grisClaro[2]
                    );

                    pdf.roundedRect(
                        margin,
                        y - 6,
                        pageWidth - margin * 2,
                        11,
                        2,
                        2,
                        "F"
                    );

                    // Número
                    pdf.setFillColor(
                        azul[0],
                        azul[1],
                        azul[2]
                    );

                    pdf.circle(
                        margin + 6,
                        y - 0.5,
                        3.5,
                        "F"
                    );

                    pdf.setTextColor(
                        blanco[0],
                        blanco[1],
                        blanco[2]
                    );

                    pdf.setFont(
                        "helvetica",
                        "bold"
                    );

                    pdf.setFontSize(8);

                    pdf.text(
                        String(index + 1),
                        margin + 6,
                        y + 2,
                        {
                            align: "center"
                        }
                    );

                    // Nombre canción
                    pdf.setTextColor(
                        azulOscuro[0],
                        azulOscuro[1],
                        azulOscuro[2]
                    );

                    pdf.setFont(
                        "helvetica",
                        "normal"
                    );

                    pdf.setFontSize(10.5);

                    pdf.text(
                        songName,
                        margin + 13,
                        y + 1
                    );

                    y += 15;
                }
            );

            // =================================================
            // PIE DE PÁGINA
            // =================================================

            const totalPages =
                pdf.internal.getNumberOfPages();

            for (
                let page = 1;
                page <= totalPages;
                page++
            ) {
                pdf.setPage(page);

                pdf.setDrawColor(
                    210,
                    214,
                    220
                );

                pdf.setLineWidth(0.3);

                pdf.line(
                    margin,
                    pageHeight - 18,
                    pageWidth - margin,
                    pageHeight - 18
                );

                pdf.setFont(
                    "helvetica",
                    "normal"
                );

                pdf.setFontSize(8);

                pdf.setTextColor(
                    110,
                    118,
                    128
                );

                pdf.text(
                    "ZION Iglesia Presbiteriana",
                    margin,
                    pageHeight - 11
                );

                pdf.text(
                    `Página ${page} de ${totalPages}`,
                    pageWidth - margin,
                    pageHeight - 11,
                    {
                        align: "right"
                    }
                );
            }

            // =================================================
            // ANDROID
            // =================================================

            if (Capacitor.isNativePlatform()) {
                const dataUri =
                    pdf.output("datauristring");

                const base64Data =
                    dataUri.split(",")[1];

                const fileName =
                    `orden-culto-zion-${Date.now()}.pdf`;

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
                    title:
                        "Orden del Culto - ZION Playlist",
                    text:
                        "Orden del culto generada desde ZION Playlist.",
                    url: fileUri.uri,
                    dialogTitle:
                        "Compartir o abrir PDF"
                });

                console.log(
                    "ZION PDF ANDROID:",
                    fileUri.uri
                );
            } else {
                // =================================================
                // NAVEGADOR / PC
                // =================================================

                pdf.save(
                    "orden-culto-zion.pdf"
                );
            }

            Swal.fire({
                icon: "success",
                title: "PDF generado",
                text:
                    Capacitor.isNativePlatform()
                        ? "El PDF está listo para guardar, compartir o imprimir."
                        : "El PDF se ha descargado correctamente.",
                timer: 1600,
                showConfirmButton: false
            });

        } catch (error) {
            console.error(
                "ZION PDF ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Error al generar PDF",
                text:
                    "No fue posible generar el archivo PDF."
            });
        }
    };

    return {
        shareWhatsApp,
        exportPlaylistPDF
    };
}