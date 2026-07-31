// =========================
// IMPORTS
// =========================
import { useEffect, useState } from "react";

// =========================
// HOOK
// =========================
export function useNextService(playlists) {

    // =========================
    // STATES
    // =========================

    const [nextService, setNextService] = useState(null);
    const [daysRemaining, setDaysRemaining] = useState(null);

    // =========================
    // EFECTO
    // =========================

    useEffect(() => {

        if (!Array.isArray(playlists) || playlists.length === 0) {

            setNextService(null);
            setDaysRemaining(null);

            return;

        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = playlists
            .filter((playlist) => {

                if (!playlist.serviceDate) return false;

                const date = new Date(playlist.serviceDate);
                date.setHours(0, 0, 0, 0);

                return date >= today;

            })
            .sort(
                (a, b) =>
                    new Date(a.serviceDate) -
                    new Date(b.serviceDate)
            );

        if (upcoming.length === 0) {

            setNextService(null);
            setDaysRemaining(null);

            return;

        }

        const next = upcoming[0];

        setNextService(next);

        const days = Math.ceil(

            (
                new Date(next.serviceDate) -
                new Date()
            ) /

            (1000 * 60 * 60 * 24)

        );

        setDaysRemaining(days);

    }, [playlists]);

    // =========================
    // RETURN
    // =========================

    return {

        nextService,
        daysRemaining

    };

}

// =========================
// FIN DEL HOOK
// =========================