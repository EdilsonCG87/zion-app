// * ========================================================
// * IMPORTS
// * ========================================================

import { useMemo } from "react";

const EMPTY_SONGS = [];

export function useStatistics(songs) {
    const songList = Array.isArray(songs) ? songs : EMPTY_SONGS;

    const topSongs = useMemo(
        () => [...songList]
            .filter((song) => (song?.timesPlayed ?? 0) > 0)
            .sort((a, b) => (b?.timesPlayed ?? 0) - (a?.timesPlayed ?? 0))
            .slice(0, 5),
        [songList]
    );

    const unusedSongs = useMemo(
        () => [...songList]
            .sort((a, b) => (a?.timesPlayed ?? 0) - (b?.timesPlayed ?? 0))
            .slice(0, 5),
        [songList]
    );

    return { topSongs, unusedSongs };
}
