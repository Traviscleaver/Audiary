// server/controllers/reviewController.js
const { pool } = require("../db");

// If you kept recalcUserStats in userController and exported it:
let recalcUserStats = null;
try {
  // userController in your project exports `_recalcUserStats` in the version we last generated.
  // If you don’t have it, no problem — we fall back to local recompute below.
  // eslint-disable-next-line global-require
  recalcUserStats = require("./userController")._recalcUserStats;
} catch (_) {
  recalcUserStats = null;
}

/**
 * Validate rating is either null/undefined/"" or a number within 0..5.
 * We allow one decimal place (DB is usually NUMERIC(2,1)).
 */
function parseRating(input) {
  if (input === undefined || input === null) return null;
  if (typeof input === "string" && input.trim() === "") return null;

  const n = Number(input);
  if (!Number.isFinite(n)) throw new Error("Invalid rating");

  // Clamp range
  if (n < 0 || n > 5) throw new Error("Rating must be between 0 and 5");

  // Optional: enforce 0.5 steps (commented out)
  // const doubled = Math.round(n * 2);
  // if (Math.abs(n * 2 - doubled) > 1e-9) throw new Error("Rating must be in 0.5 increments");

  // Keep 1 decimal to match NUMERIC(2,1)
  return Math.round(n * 10) / 10;
}

/**
 * Resolve target (song vs album) from request body.
 * Accepts any of:
 *  - { song_id } or { songId }
 *  - { album_id } or { albumId }
 *  - { targetType: "song"|"album", targetId }
 */
function resolveTarget(body) {
  const songId = body.song_id ?? body.songId ?? null;
  const albumId = body.album_id ?? body.albumId ?? null;

  const targetType = body.targetType ?? null;
  const targetId = body.targetId ?? body.id ?? null;

  let resolvedSongId = songId ? Number(songId) : null;
  let resolvedAlbumId = albumId ? Number(albumId) : null;

  if (!resolvedSongId && !resolvedAlbumId && targetType && targetId) {
    if (targetType === "song") resolvedSongId = Number(targetId);
    if (targetType === "album") resolvedAlbumId = Number(targetId);
  }

  if (resolvedSongId && !Number.isFinite(resolvedSongId)) resolvedSongId = null;
  if (resolvedAlbumId && !Number.isFinite(resolvedAlbumId)) resolvedAlbumId = null;

  // Exactly one must be provided
  if (!!resolvedSongId === !!resolvedAlbumId) {
    throw new Error("Provide exactly one of song_id or album_id");
  }

  return {
    target_type: resolvedSongId ? "song" : "album",
    song_id: resolvedSongId,
    album_id: resolvedAlbumId,
  };
}

/**
 * If you didn’t export recalcUserStats elsewhere, this local recompute keeps `stats`
 * consistent using reviews as the rating source.
 */
async function localRecalcUserStats(userId) {
  await pool.query(
    `
    UPDATE stats SET
      total_reviews = (SELECT COUNT(*) FROM reviews WHERE user_id = $1),

      -- ratings table removed; reviews.rating is the rating source
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
 * Hydrates a review row into a consistent shape the client can render.
 * Works for both song reviews and album reviews.
 */
function buildReviewSelectSql() {
  return `
    SELECT
      r.review_id,
      r.user_id,
      r.song_id,
      r.album_id,
      r.rating,
      r.content,
      r.created_at,
      r.updated_at,

      -- target type for UI
      CASE
        WHEN r.song_id IS NOT NULL THEN 'song'
        WHEN r.album_id IS NOT NULL THEN 'album'
        ELSE 'unknown'
      END AS target_type,

      -- user display
      u.username,
      u.display_name,
      u.avatar_url,

      -- song fields (only meaningful when song review)
      s.title AS song_title,
      s.spotify_id AS song_spotify_id,

      -- album fields:
      -- album review: r.album_id
      -- song review: s.album_id
      al.album_id AS resolved_album_id,
      al.title AS album_title,
      al.cover_url AS album_cover_url,
      al.spotify_id AS album_spotify_id,

      -- album artist
      ar.name AS artist_name,
      ar.spotify_id AS artist_spotify_id,

      -- likes
      (SELECT COUNT(*) FROM review_likes rl WHERE rl.review_id = r.review_id) AS likes_count
  `;
}

/**
 * GET /reviews/:reviewId
 * Public; if authOptional sets req.user, we also return liked_by_me.
 */
exports.getReviewById = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);
    if (!Number.isFinite(reviewId)) {
      return res.status(400).json({ error: "Invalid review id" });
    }

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
      LEFT JOIN albums al ON al.album_id = COALESCE(r.album_id, s.album_id)
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
 * GET /reviews/songs/:songId?limit=..&offset=..
 */
exports.listReviewsForSong = async (req, res) => {
  try {
    const songId = Number(req.params.songId);
    if (!Number.isFinite(songId)) return res.status(400).json({ error: "Invalid song id" });

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
      LEFT JOIN albums al ON al.album_id = COALESCE(r.album_id, s.album_id)
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
 * GET /reviews/albums/:albumId?limit=..&offset=..
 */
exports.listReviewsForAlbum = async (req, res) => {
  try {
    const albumId = Number(req.params.albumId);
    if (!Number.isFinite(albumId)) return res.status(400).json({ error: "Invalid album id" });

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
      LEFT JOIN albums al ON al.album_id = COALESCE(r.album_id, s.album_id)
      LEFT JOIN artists ar ON ar.artist_id = al.artist_id

      -- album reviews only (album target)
      WHERE r.album_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [albumId, limit, offset, viewerId]
    );

    return res.json({ reviews: result.rows });
  } catch (err) {
    console.error("listReviewsForAlbum error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /reviews
 *
 * Upserts a review for the logged-in user and the target.
 * This keeps client simple: "submit" can always call POST.
 *
 * Body accepts:
 *  - song_id OR album_id (recommended)
 *  - rating (0..5, nullable)
 *  - content (string, can be empty)
 *
 * Returns { review_id, created, review }
 */
exports.upsertReview = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = Number(req.user.user_id);

    const { song_id, album_id } = resolveTarget(req.body);
    const rating = parseRating(req.body.rating);
    const content = typeof req.body.content === "string" ? req.body.content : null;

    await client.query("BEGIN");

    // Ensure target exists (fail fast with 400 if missing)
    if (song_id) {
      const chk = await client.query(`SELECT song_id FROM songs WHERE song_id = $1 LIMIT 1`, [song_id]);
      if (!chk.rows[0]) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Song not found" });
      }
    } else if (album_id) {
      const chk = await client.query(`SELECT album_id FROM albums WHERE album_id = $1 LIMIT 1`, [album_id]);
      if (!chk.rows[0]) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Album not found" });
      }
    }

    // Find an existing review by this user for this exact target.
    const existing = await client.query(
      `
      SELECT review_id
      FROM reviews
      WHERE user_id = $1
        AND (
          ($2::int IS NOT NULL AND song_id = $2::int)
          OR
          ($3::int IS NOT NULL AND album_id = $3::int)
        )
      LIMIT 1
      `,
      [userId, song_id, album_id]
    );

    let reviewId;
    let created = false;

    if (existing.rows[0]) {
      reviewId = existing.rows[0].review_id;

      await client.query(
        `
        UPDATE reviews
        SET
          rating = $1,
          content = $2,
          updated_at = NOW()
        WHERE review_id = $3 AND user_id = $4
        `,
        [rating, content, reviewId, userId]
      );
    } else {
      created = true;

      const ins = await client.query(
        `
        INSERT INTO reviews (user_id, song_id, album_id, rating, content, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING review_id
        `,
        [userId, song_id, album_id, rating, content]
      );

      reviewId = ins.rows[0].review_id;

      // Add activity (optional but useful for feeds)
      await client.query(
        `
        INSERT INTO activities (user_id, type, target_id, description, created_at)
        VALUES ($1, 'review', $2, $3, NOW())
        `,
        [
          userId,
          reviewId,
          song_id
            ? `Reviewed a song`
            : `Reviewed an album`,
        ]
      );
    }

    await client.query("COMMIT");

    // Keep stats consistent (uses reviews as the rating source)
    await recomputeStats(userId);

    // Return hydrated review
    const hydrated = await pool.query(
      `
      ${buildReviewSelectSql()},
      false AS liked_by_me
      FROM reviews r
      JOIN users u ON u.user_id = r.user_id
      LEFT JOIN songs s ON s.song_id = r.song_id
      LEFT JOIN albums al ON al.album_id = COALESCE(r.album_id, s.album_id)
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

    // Surface friendly validation errors
    const msg = String(err?.message || "");
    if (
      msg.includes("Provide exactly one") ||
      msg.includes("Rating must be between") ||
      msg.includes("Invalid rating")
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
 * Owner-only update (rating/content).
 * If you don’t need PUT because POST upserts, you can keep it anyway for clarity.
 */
exports.updateReview = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const reviewId = Number(req.params.reviewId);
    if (!Number.isFinite(reviewId)) return res.status(400).json({ error: "Invalid review id" });

    const rating = parseRating(req.body.rating);
    const content = typeof req.body.content === "string" ? req.body.content : null;

    const updated = await pool.query(
      `
      UPDATE reviews
      SET
        rating = $1,
        content = $2,
        updated_at = NOW()
      WHERE review_id = $3 AND user_id = $4
      RETURNING review_id
      `,
      [rating, content, reviewId, userId]
    );

    if (!updated.rows[0]) return res.status(404).json({ error: "Review not found" });

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
 * Owner-only.
 */
exports.deleteReview = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const reviewId = Number(req.params.reviewId);
    if (!Number.isFinite(reviewId)) return res.status(400).json({ error: "Invalid review id" });

    const del = await pool.query(
      `
      DELETE FROM reviews
      WHERE review_id = $1 AND user_id = $2
      RETURNING review_id
      `,
      [reviewId, userId]
    );

    if (!del.rows[0]) return res.status(404).json({ error: "Review not found" });

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
    if (!Number.isFinite(reviewId)) return res.status(400).json({ error: "Invalid review id" });

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
    if (!Number.isFinite(reviewId)) return res.status(400).json({ error: "Invalid review id" });

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
