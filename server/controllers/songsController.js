// controllers/songController.js
const { pool } = require("../db");

// =======================================
// Helper: Fetch song by id (with album + artist)
// =======================================
async function fetchSongById(songId) {
  const result = await pool.query(
    `
    SELECT
      s.song_id,
      s.spotify_id,
      s.mbid,
      s.title,
      s.duration,
      s.track_number,
      s.isrc,
      s.popularity,
      s.preview_url,
      s.spotify_url,
      s.last_fetched,

      a.album_id,
      a.title AS album_title,
      a.release_year,
      a.cover_url,
      a.total_tracks,

      ar.artist_id,
      ar.name AS artist_name,
      ar.image_url AS artist_image_url,

      (SELECT COUNT(*) FROM ratings WHERE song_id = s.song_id) AS ratings_count,
      (SELECT COALESCE(AVG(rating), 0) FROM ratings WHERE song_id = s.song_id) AS avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE song_id = s.song_id) AS reviews_count

    FROM songs s
    LEFT JOIN albums a ON a.album_id = s.album_id
    LEFT JOIN artists ar ON ar.artist_id = a.artist_id
    WHERE s.song_id = $1
    LIMIT 1
    `,
    [songId]
  );

  return result.rows[0];
}

// =======================================
// Helper: Fetch song by spotify_id (optional)
// =======================================
async function fetchSongBySpotifyId(spotifyId) {
  const result = await pool.query(
    `
    SELECT
      s.song_id,
      s.spotify_id,
      s.mbid,
      s.title,
      s.duration,
      s.track_number,
      s.isrc,
      s.popularity,
      s.preview_url,
      s.spotify_url,
      s.last_fetched,

      a.album_id,
      a.title AS album_title,
      a.release_year,
      a.cover_url,
      a.total_tracks,

      ar.artist_id,
      ar.name AS artist_name,

      (SELECT COUNT(*) FROM ratings WHERE song_id = s.song_id) AS ratings_count,
      (SELECT COALESCE(AVG(rating), 0) FROM ratings WHERE song_id = s.song_id) AS avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE song_id = s.song_id) AS reviews_count
    FROM songs s
    LEFT JOIN albums a ON a.album_id = s.album_id
    LEFT JOIN artists ar ON ar.artist_id = a.artist_id
    WHERE s.spotify_id = $1
    LIMIT 1
    `,
    [spotifyId]
  );

  return result.rows[0];
}

// =======================================
// GET /songs/:songId
// Public song details
// =======================================
exports.getSongById = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) {
      return res.status(400).json({ error: "Invalid songId" });
    }

    const song = await fetchSongById(songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    return res.json({ song });
  } catch (err) {
    console.error("getSongById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /songs/spotify/:spotifyId
// Public song details by spotify id
// =======================================
exports.getSongBySpotifyId = async (req, res) => {
  try {
    const spotifyId = req.params.spotifyId;
    if (!spotifyId) return res.status(400).json({ error: "Missing spotifyId" });

    const song = await fetchSongBySpotifyId(spotifyId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    return res.json({ song });
  } catch (err) {
    console.error("getSongBySpotifyId error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /songs/:songId/ratings
// =======================================
exports.getSongRatings = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) {
      return res.status(400).json({ error: "Invalid songId" });
    }

    const song = await fetchSongById(songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    const result = await pool.query(
      `
      SELECT
        r.user_id,
        r.song_id,
        r.rating,
        r.rated_at,

        u.username,
        u.display_name,
        u.avatar_url
      FROM ratings r
      JOIN users u ON u.user_id = r.user_id
      WHERE r.song_id = $1
      ORDER BY r.rated_at DESC
      LIMIT 200
      `,
      [songId]
    );

    return res.json({ ratings: result.rows });
  } catch (err) {
    console.error("getSongRatings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /songs/:songId/reviews
// =======================================
exports.getSongReviews = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) {
      return res.status(400).json({ error: "Invalid songId" });
    }

    const song = await fetchSongById(songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    const result = await pool.query(
      `
      SELECT
        r.review_id,
        r.user_id,
        r.song_id,
        r.rating,
        r.content,
        r.created_at,
        r.updated_at,

        u.username,
        u.display_name,
        u.avatar_url

      FROM reviews r
      JOIN users u ON u.user_id = r.user_id
      WHERE r.song_id = $1
      ORDER BY r.created_at DESC
      LIMIT 200
      `,
      [songId]
    );

    return res.json({ reviews: result.rows });
  } catch (err) {
    console.error("getSongReviews error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /songs/:songId/diary
// (who listened + notes) — public feed-ish
// =======================================
exports.getSongDiaryEntries = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) {
      return res.status(400).json({ error: "Invalid songId" });
    }

    const song = await fetchSongById(songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    const result = await pool.query(
      `
      SELECT
        d.entry_id,
        d.user_id,
        d.song_id,
        d.listened_at,
        d.rating,
        d.review_id,
        d.notes,

        u.username,
        u.display_name,
        u.avatar_url

      FROM diary_entries d
      JOIN users u ON u.user_id = d.user_id
      WHERE d.song_id = $1
      ORDER BY d.listened_at DESC
      LIMIT 200
      `,
      [songId]
    );

    return res.json({ diary: result.rows });
  } catch (err) {
    console.error("getSongDiaryEntries error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /songs/:songId/stats
// =======================================
exports.getSongStats = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) {
      return res.status(400).json({ error: "Invalid songId" });
    }

    const song = await fetchSongById(songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    // stats come from subqueries (same as helper), but keeping a dedicated endpoint
    const stats = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM ratings WHERE song_id = $1) AS ratings_count,
        (SELECT COALESCE(AVG(rating), 0) FROM ratings WHERE song_id = $1) AS avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE song_id = $1) AS reviews_count,
        (SELECT COUNT(*) FROM diary_entries WHERE song_id = $1) AS diary_count
      `,
      [songId]
    );

    return res.json({ stats: stats.rows[0] || {} });
  } catch (err) {
    console.error("getSongStats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /songs/:songId/full
// Song + recent ratings + recent reviews + recent diary
// =======================================
exports.getSongFull = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) {
      return res.status(400).json({ error: "Invalid songId" });
    }

    const song = await fetchSongById(songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    const [ratings, reviews, diary] = await Promise.all([
      pool.query(
        `
        SELECT
          r.user_id,
          r.song_id,
          r.rating,
          r.rated_at,
          u.username,
          u.display_name,
          u.avatar_url
        FROM ratings r
        JOIN users u ON u.user_id = r.user_id
        WHERE r.song_id = $1
        ORDER BY r.rated_at DESC
        LIMIT 50
        `,
        [songId]
      ),

      pool.query(
        `
        SELECT
          rv.review_id,
          rv.user_id,
          rv.song_id,
          rv.rating,
          rv.content,
          rv.created_at,
          rv.updated_at,
          u.username,
          u.display_name,
          u.avatar_url
        FROM reviews rv
        JOIN users u ON u.user_id = rv.user_id
        WHERE rv.song_id = $1
        ORDER BY rv.created_at DESC
        LIMIT 50
        `,
        [songId]
      ),

      pool.query(
        `
        SELECT
          d.entry_id,
          d.user_id,
          d.song_id,
          d.listened_at,
          d.rating,
          d.review_id,
          d.notes,
          u.username,
          u.display_name,
          u.avatar_url
        FROM diary_entries d
        JOIN users u ON u.user_id = d.user_id
        WHERE d.song_id = $1
        ORDER BY d.listened_at DESC
        LIMIT 100
        `,
        [songId]
      ),
    ]);

    return res.json({
      song,
      ratings: ratings.rows,
      reviews: reviews.rows,
      diary: diary.rows,
    });
  } catch (err) {
    console.error("getSongFull error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// POST /songs
// Create a song (basic insert; useful for seeding/import)
// =======================================
exports.createSong = async (req, res) => {
  try {
    const {
      spotify_id,
      mbid,
      album_id,
      title,
      duration,
      track_number,
      isrc,
      popularity,
      preview_url,
      spotify_url,
    } = req.body;

    if (!album_id || !title) {
      return res.status(400).json({ error: "album_id and title are required" });
    }

    const result = await pool.query(
      `
      INSERT INTO songs (
        spotify_id, mbid, album_id, title, duration, track_number,
        isrc, popularity, preview_url, spotify_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING song_id
      `,
      [
        spotify_id || null,
        mbid || null,
        album_id,
        title,
        duration || null,
        track_number || null,
        isrc || null,
        popularity || null,
        preview_url || null,
        spotify_url || null,
      ]
    );

    const song = await fetchSongById(result.rows[0].song_id);
    return res.status(201).json({ message: "Song created", song });
  } catch (err) {
    console.error("createSong error:", err);

    // Unique violation (spotify_id, mbid)
    if (err.code === "23505") {
      return res.status(400).json({ error: "Song already exists" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// PUT /songs/:songId
// Update song fields
// =======================================
exports.updateSong = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) {
      return res.status(400).json({ error: "Invalid songId" });
    }

    const {
      album_id,
      title,
      duration,
      track_number,
      isrc,
      popularity,
      preview_url,
      spotify_url,
    } = req.body;

    const existing = await fetchSongById(songId);
    if (!existing) return res.status(404).json({ error: "Song not found" });

    await pool.query(
      `
      UPDATE songs
      SET
        album_id = COALESCE($1, album_id),
        title = COALESCE($2, title),
        duration = COALESCE($3, duration),
        track_number = COALESCE($4, track_number),
        isrc = COALESCE($5, isrc),
        popularity = COALESCE($6, popularity),
        preview_url = COALESCE($7, preview_url),
        spotify_url = COALESCE($8, spotify_url),
        last_fetched = NOW()
      WHERE song_id = $9
      `,
      [
        album_id || null,
        title || null,
        duration || null,
        track_number || null,
        isrc || null,
        popularity || null,
        preview_url || null,
        spotify_url || null,
        songId,
      ]
    );

    const song = await fetchSongById(songId);
    return res.json({ message: "Song updated", song });
  } catch (err) {
    console.error("updateSong error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// DELETE /songs/:songId
// =======================================
exports.deleteSong = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) {
      return res.status(400).json({ error: "Invalid songId" });
    }

    const existing = await fetchSongById(songId);
    if (!existing) return res.status(404).json({ error: "Song not found" });

    await pool.query(`DELETE FROM songs WHERE song_id = $1`, [songId]);

    return res.json({ message: "Song deleted" });
  } catch (err) {
    console.error("deleteSong error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
