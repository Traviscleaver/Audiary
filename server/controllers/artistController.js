const { pool } = require("../db");

// Helper
async function fetchArtistById(artistId) {
  const result = await pool.query(
    `
    SELECT
      ar.artist_id,
      ar.spotify_id,
      ar.mbid,
      ar.name,
      ar.image_url,
      ar.followers,
      ar.genres,
      ar.last_fetched
    FROM artists ar
    WHERE ar.artist_id = $1
    LIMIT 1
    `,
    [artistId]
  );

  return result.rows[0];
}

// GET /artists/:artistId
exports.getArtistById = async (req, res) => {
  try {
    const artistId = Number(req.params.artistId);
    if (!Number.isFinite(artistId)) {
      return res.status(400).json({ error: "Invalid artistId" });
    }

    const artist = await fetchArtistById(artistId);
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    return res.json({ artist });
  } catch (err) {
    console.error("getArtistById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
