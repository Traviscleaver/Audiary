const { pool } = require("../db");

// Helper
async function fetchAlbumById(albumId) {
  const result = await pool.query(
    `
    SELECT
      a.album_id,
      a.spotify_id,
      a.mbid,
      a.title,
      a.release_year,
      a.cover_url,
      a.total_tracks,
      a.last_fetched,

      ar.artist_id,
      ar.name AS artist_name,
      ar.image_url AS artist_image_url

    FROM albums a
    LEFT JOIN artists ar ON ar.artist_id = a.artist_id
    WHERE a.album_id = $1
    LIMIT 1
    `,
    [albumId]
  );

  return result.rows[0];
}

// GET /albums/:albumId
exports.getAlbumById = async (req, res) => {
  try {
    const albumId = Number(req.params.albumId);
    if (!Number.isFinite(albumId)) {
      return res.status(400).json({ error: "Invalid albumId" });
    }

    const album = await fetchAlbumById(albumId);
    if (!album) return res.status(404).json({ error: "Album not found" });

    return res.json({ album });
  } catch (err) {
    console.error("getAlbumById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
