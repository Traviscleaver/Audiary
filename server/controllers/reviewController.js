// server/controllers/reviewController.js
const { pool } = require("../db");

// Optional stats recompute (kept from your existing controller)
let recalcUserStats = null;
try {
  // eslint-disable-next-line global-require
  recalcUserStats = require("./userController")._recalcUserStats;
} catch (_) {
  recalcUserStats = null;
}

function parseRating(input) {
  if (input === undefined || input === null) return null;
  if (typeof input === "string" && input.trim() === "") return null;

  const n = Number(input);
  if (!Number.isFinite(n)) throw new Error("Invalid rating");
  if (n < 0 || n > 5) throw new Error("Rating must be between 0 and 5");
  return Math.round(n * 10) / 10;
}

/**
 * Your DB (screenshot) has ONLY song_id on reviews.
 * So we accept { song_id | songId } and reject album_id for now.
 */
function resolveTarget(body) {
  const songId = body.song_id ?? body.songId ?? null;
  const albumId = body.album_id ?? body.albumId ?? null;

  if (albumId) {
    throw new Error(
      "This database schema only supports song reviews (album_id is not in reviews table)."
    );
  }

  const resolvedSongId = songId ? Number(songId) : null;
  if (!resolvedSongId || !Number.isFinite(resolvedSongId)) {
    throw new Error("Provide song_id");
  }

  return { song_id: resolvedSongId };
}

async function localRecalcUserStats(userId) {
  await pool.query(
    `
    UPDATE stats SET
      total_reviews = (SELECT COUNT(*) FROM reviews WHERE user_id = $1),
      total_ratings = (
        SELECT COUNT(*)
        FROM reviews
        WHERE user_id = $1 AND rating IS NOT NULL
      ),
      avg_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE user_id = $1 AND rating IS NOT NULL
      ),
      total_songs_listened = (
        SELECT COUNT(*) FROM diary_entries WHERE user_id = $1
      ),
      total_artists = (
        SELECT COUNT(DISTINCT ar.artist_id)
        FROM diary_entries d
        JOIN songs s ON s.song_id = d.song_id
        JOIN albums al ON al.album_id = s.album_id
        JOIN artists ar ON ar.artist_id = al.artist_id
        WHERE d.user_id = $1
      ),
      last_updated = NOW()
    WHERE user_id = $1
    `,
    [userId]
  );
}

async function recomputeStats(userId) {
  if (typeof recalcUserStats === "function") return recalcUserStats(userId);
  return localRecalcUserStats(userId);
}

/**
 * One consistent hydrated review row:
 * - review fields
 * - user fields
 * - song fields
 * - album + artist fields via songs->albums->artists
 * - likes_count (all time)
 */
function buildReviewSelectSql() {
  return `
    SELECT
      r.review_id,
      r.user_id,
      r.song_id,
      r.rating,
      r.title, -- ✅ added
      r.content,
      r.created_at,
      r.updated_at,

      'song' AS target_type,

      u.username,
      u.display_name,
      u.avatar_url,

      s.title AS song_title,
      s.spotify_id AS song_spotify_id,

      al.album_id AS album_id,
      al.title AS album_title,
      al.cover_url AS album_cover_url,
      al.spotify_id AS album_spotify_id,

      ar.name AS artist_name,
      ar.spotify_id AS artist_spotify_id,

      (SELECT COUNT(*) FROM review_likes rl WHERE rl.review_id = r.review_id) AS likes_count
  `;
}

/**
 * ✅ GET /reviews/top?limit=..&offset=..
 * Top liked reviews from last 7 days.
 *
 * NOTE: Uses review_likes.liked_at (your likeReview inserts liked_at).
 * If your column is named created_at instead, change rl.liked_at -> rl.created_at.
 */
exports.listTopReviewsWeekly = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 50);
    const offset = Math.max(Number(req.query.offset || 0), 0);
    const viewerId = req.user?.user_id ? Number(req.user.user_id) : -1;

    const result = await pool.query(
      `
      WITH week_likes AS (
        SELECT
          rl.review_id,
          COUNT(*)::int AS likes_week
        FROM review_likes rl
        WHERE rl.liked_at >= NOW() - INTERVAL '7 days'
        GROUP BY rl.review_id
      )
      ${buildReviewSelectSql()},
      COALESCE(wl.likes_week, 0) AS likes_week,
      (SELECT EXISTS(
        SELECT 1 FROM review_likes rl2
        WHERE rl2.review_id = r.review_id AND rl2.user_id = $3
      )) AS liked_by_me

      FROM reviews r
      JOIN users u ON u.user_id = r.user_id
      LEFT JOIN songs s ON s.song_id = r.song_id
      LEFT JOIN albums al ON al.album_id = s.album_id
      LEFT JOIN artists ar ON ar.artist_id = al.artist_id
      LEFT JOIN week_likes wl ON wl.review_id = r.review_id

      ORDER BY COALESCE(wl.likes_week, 0) DESC, r.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset, viewerId]
    );

    return res.json({ reviews: result.rows });
  } catch (err) {
    console.error("listTopReviewsWeekly error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /reviews/:reviewId
 */
exports.getReviewById = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);
    if (!Number.isFinite(reviewId))
      return res.status(400).json({ error: "Invalid review id" });

    const viewerId = req.user?.user_id ? Number(req.user.user_id) : -1;

    const result = await pool.query(
      `
      ${buildReviewSelectSql()},
      (SELECT EXISTS(
        SELECT 1 FROM review_likes rl
        WHERE rl.review_id = r.review_id AND rl.user_id = $2
      )) AS liked_by_me
      FROM reviews r
      JOIN users u ON u.user_id = r.user_id
      LEFT JOIN songs s ON s.song_id = r.song_id
      LEFT JOIN albums al ON al.album_id = s.album_id
      LEFT JOIN artists ar ON ar.artist_id = al.artist_id
      WHERE r.review_id = $1
      LIMIT 1
      `,
      [reviewId, viewerId]
    );

    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: "Review not found" });

    return res.json({ review: row });
  } catch (err) {
    console.error("getReviewById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /reviews/songs/:songId
 */
exports.listReviewsForSong = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId))
      return res.status(400).json({ error: "Invalid song id" });

    const limit = Math.min(Number(req.query.limit || 50), 100);
    const offset = Math.max(Number(req.query.offset || 0), 0);
    const viewerId = req.user?.user_id ? Number(req.user.user_id) : -1;

    const result = await pool.query(
      `
      ${buildReviewSelectSql()},
      (SELECT EXISTS(
        SELECT 1 FROM review_likes rl
        WHERE rl.review_id = r.review_id AND rl.user_id = $4
      )) AS liked_by_me
      FROM reviews r
      JOIN users u ON u.user_id = r.user_id
      LEFT JOIN songs s ON s.song_id = r.song_id
      LEFT JOIN albums al ON al.album_id = s.album_id
      LEFT JOIN artists ar ON ar.artist_id = al.artist_id
      WHERE r.song_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [songId, limit, offset, viewerId]
    );

    return res.json({ reviews: result.rows });
  } catch (err) {
    console.error("listReviewsForSong error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /reviews
 * Upsert by (user_id, song_id)
 */
exports.upsertReview = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = Number(req.user.user_id);

    const { song_id } = resolveTarget(req.body);
    const rating = parseRating(req.body.rating);

    const title =
      typeof req.body.title === "string" ? req.body.title.trim() : null; // ✅ added
    const content =
      typeof req.body.content === "string" ? req.body.content : null;

    await client.query("BEGIN");

    // Ensure song exists
    const chk = await client.query(
      `SELECT song_id FROM songs WHERE song_id = $1 LIMIT 1`,
      [song_id]
    );
    if (!chk.rows[0]) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Song not found" });
    }

    // Existing?
    const existing = await client.query(
      `
      SELECT review_id
      FROM reviews
      WHERE user_id = $1 AND song_id = $2
      LIMIT 1
      `,
      [userId, song_id]
    );

    let reviewId;
    let created = false;

    if (existing.rows[0]) {
      reviewId = existing.rows[0].review_id;

      await client.query(
        `
        UPDATE reviews
        SET rating = $1, title = $2, content = $3, updated_at = NOW()
        WHERE review_id = $4 AND user_id = $5
        `,
        [rating, title, content, reviewId, userId]
      );
    } else {
      created = true;

      const ins = await client.query(
        `
        INSERT INTO reviews (user_id, song_id, rating, title, content, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING review_id
        `,
        [userId, song_id, rating, title, content]
      );

      reviewId = ins.rows[0].review_id;

      // Optional activity
      await client.query(
        `
        INSERT INTO activities (user_id, type, target_id, description, created_at)
        VALUES ($1, 'review', $2, $3, NOW())
        `,
        [userId, reviewId, "Reviewed a song"]
      );
    }

    await client.query("COMMIT");

    await recomputeStats(userId);

    const hydrated = await pool.query(
      `
      ${buildReviewSelectSql()},
      false AS liked_by_me
      FROM reviews r
      JOIN users u ON u.user_id = r.user_id
      LEFT JOIN songs s ON s.song_id = r.song_id
      LEFT JOIN albums al ON al.album_id = s.album_id
      LEFT JOIN artists ar ON ar.artist_id = al.artist_id
      WHERE r.review_id = $1
      LIMIT 1
      `,
      [reviewId]
    );

    return res.status(created ? 201 : 200).json({
      review_id: reviewId,
      created,
      review: hydrated.rows[0] || null,
    });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {}

    console.error("upsertReview error:", err);
    const msg = String(err?.message || "");
    if (
      msg.includes("Provide song_id") ||
      msg.includes("Rating must be between") ||
      msg.includes("Invalid rating") ||
      msg.includes("schema only supports song reviews")
    ) {
      return res.status(400).json({ error: msg });
    }
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

/**
 * PUT /reviews/:reviewId
 */
exports.updateReview = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const reviewId = Number(req.params.reviewId);
    if (!Number.isFinite(reviewId))
      return res.status(400).json({ error: "Invalid review id" });

    const rating = parseRating(req.body.rating);
    const title =
      typeof req.body.title === "string" ? req.body.title.trim() : null; // ✅ added
    const content =
      typeof req.body.content === "string" ? req.body.content : null;

    const updated = await pool.query(
      `
      UPDATE reviews
      SET rating = $1, title = $2, content = $3, updated_at = NOW()
      WHERE review_id = $4 AND user_id = $5
      RETURNING review_id
      `,
      [rating, title, content, reviewId, userId]
    );

    if (!updated.rows[0])
      return res.status(404).json({ error: "Review not found" });

    await recomputeStats(userId);
    return res.json({ ok: true, review_id: reviewId });
  } catch (err) {
    console.error("updateReview error:", err);
    const msg = String(err?.message || "");
    if (msg.includes("Rating must be") || msg.includes("Invalid rating")) {
      return res.status(400).json({ error: msg });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /reviews/:reviewId
 */
exports.deleteReview = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const reviewId = Number(req.params.reviewId);
    if (!Number.isFinite(reviewId))
      return res.status(400).json({ error: "Invalid review id" });

    const del = await pool.query(
      `
      DELETE FROM reviews
      WHERE review_id = $1 AND user_id = $2
      RETURNING review_id
      `,
      [reviewId, userId]
    );

    if (!del.rows[0])
      return res.status(404).json({ error: "Review not found" });

    await recomputeStats(userId);
    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteReview error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /reviews/:reviewId/like
 */
exports.likeReview = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const reviewId = Number(req.params.reviewId);
    if (!Number.isFinite(reviewId))
      return res.status(400).json({ error: "Invalid review id" });

    await pool.query(
      `
      INSERT INTO review_likes (review_id, user_id, liked_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (review_id, user_id) DO NOTHING
      `,
      [reviewId, userId]
    );

    return res.json({ ok: true, liked: true });
  } catch (err) {
    console.error("likeReview error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /reviews/:reviewId/like
 */
exports.unlikeReview = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const reviewId = Number(req.params.reviewId);
    if (!Number.isFinite(reviewId))
      return res.status(400).json({ error: "Invalid review id" });

    await pool.query(
      `
      DELETE FROM review_likes
      WHERE review_id = $1 AND user_id = $2
      `,
      [reviewId, userId]
    );

    return res.json({ ok: true, liked: false });
  } catch (err) {
    console.error("unlikeReview error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
