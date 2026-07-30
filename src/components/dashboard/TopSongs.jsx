function TopSongs({
  topSongs,
  showTopSongs,
  setShowTopSongs
}) {
  return (
    <div className="form-container">

      <h3
        style={{ cursor: "pointer" }}
        onClick={() =>
          setShowTopSongs(!showTopSongs)
        }
      >
        ⭐ Canciones más usadas{" "}
        {showTopSongs ? "▼" : "►"}
      </h3>

      {showTopSongs && (

        topSongs.length === 0 ? (

          <p>No hay estadísticas</p>

        ) : (

          <div>

            {topSongs.map(
              (song, index) => (

                <div
                  key={song.id}
                  className="top-song-item"
                >

                  <div
                    className="top-song-header"
                  >

                    <span>
                      {index + 1}. {song.name}
                    </span>

                    <span>
                      {song.timesPlayed || 0}
                    </span>

                  </div>

                  <div
                    className="top-song-bar"
                  >

                    <div
                      className="top-song-fill"
                      style={{
                        width: `${Math.min(
                          (song.timesPlayed || 0) * 10,
                          100
                        )}%`
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        )

      )}

    </div>
  );
}

export default TopSongs;