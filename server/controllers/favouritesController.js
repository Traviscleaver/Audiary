// controllers/favouritesController.js
const { pool } = require("../db");

// -----------------------------
// Type normalization
// DB enum values in your live DB appear to be: song | album | artist
// Client sends: Tracks | Albums | Artists
// -----------------------------
function normalizeType(type) {
  if (!type) return null;

  const t = String(type).trim();

  // Accept UI labels + enum-ish values
  if (t === "Tracks" || t === "Track" || t === "song") return "song";
  if (t === "Albums" || t === "Album" || t === "album") return "album";
  if (t === "Artists" || t === "Artist" || t === "artist") return "artist";

  return null;
}

function mapClientTypeToDbEnum(type) {
  // client sends: "Tracks" | "Albums" | "Artists"
  if (type === "Tracks") return "song";
  if (type === "Albums") return "album";
  if (type === "Artists") return "artist";
  return null;
}

async function getDbIdFromSpotify(itemType, spotifyId) {
  if (itemType === "song") {
    const r = await pool.query(
      `SELECT song_id AS id FROM songs WHERE spotify_id = $1 LIMIT 1`,
      [spotifyId]
    );
    return r.rows[0]?.id ?? null;
  }
  if (itemType === "album") {
    const r = await pool.query(
      `SELECT album_id AS id FROM albums WHERE spotify_id = $1 LIMIT 1`,
      [spotifyId]
    );
    return r.rows[0]?.id ?? null;
  }
  if (itemType === "artist") {
    const r = await pool.query(
      `SELECT artist_id AS id FROM artists WHERE spotify_id = $1 LIMIT 1`,
      [spotifyId]
    );
    return r.rows[0]?.id ?? null;
  }
  return null;
}

async function countUserFavouritesByType(userId, itemType) {
  const r = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM favorites
     WHERE user_id = $1 AND item_type = $2`,
    [userId, itemType]
  );
  return r.rows[0]?.count ?? 0;
}

async function findLowestFreeRank(client, userId, itemType) {
  // ranks are 1..3
  const r = await client.query(
    `
    SELECT rank
    FROM favorites
    WHERE user_id = $1 AND item_type = $2 AND rank IS NOT NULL
    `,
    [userId, itemType]
  );

  const used = new Set(r.rows.map((x) => Number(x.rank)));
  for (let i = 1; i <= 3; i++) {
    if (!used.has(i)) return i;
  }
  return null; // none free
}

// =======================================
// POST /favorites
// Add (set) favourite
// Body: { type, item_id, rank? }
// Enforce max 3 per type
// Rank behavior:
// - rank null -> auto pick lowest free (1..3)
// - rank 1..3 -> if occupied, swap ranks
// =======================================
exports.setFavourite = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.user_id;
    const { type, item_id, rank = null } = req.body;

    const itemType = normalizeType(type);
    const itemId = Number(item_id);

    // rank can be null or 1..3
    const desiredRank =
      rank === null || rank === undefined ? null : Number(rank);

    if (!itemType) {
      return res
        .status(400)
        .json({ error: "Invalid type. Use Tracks/Albums/Artists." });
    }
    if (!Number.isFinite(itemId)) {
      return res.status(400).json({ error: "Invalid item_id" });
    }
    if (
      desiredRank !== null &&
      (!Number.isFinite(desiredRank) || desiredRank < 1 || desiredRank > 3)
    ) {
      return res.status(400).json({ error: "Invalid rank (use 1..3 or null)" });
    }

    await client.query("BEGIN");

    // Does this favourite already exist?
    const existsRes = await client.query(
      `
      SELECT rank
      FROM favorites
      WHERE user_id = $1 AND item_type = $2 AND item_id = $3
      LIMIT 1
      `,
      [userId, itemType, itemId]
    );
    const alreadyExists = existsRes.rowCount > 0;

    // Enforce max 3 per type ONLY when inserting a new row
    if (!alreadyExists) {
      const currentCount = await countUserFavouritesByType(userId, itemType);
      if (currentCount >= 3) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          error: `Max favourites reached for ${itemType}.`,
          code: "FAV_MAX_REACHED",
          max: 3,
          count: currentCount,
        });
      }
    }

    // Decide final rank
    let finalRank = desiredRank;

    if (finalRank === null) {
      // auto-rank to lowest free slot (1..3)
      finalRank = await findLowestFreeRank(client, userId, itemType);
      // If none free but item already exists, keep its rank as-is
      if (finalRank === null && alreadyExists) {
        finalRank = existsRes.rows[0]?.rank ?? null;
      }
    }

    // If we’re setting a rank and something else already has it, swap.
    if (finalRank !== null) {
      const occupantRes = await client.query(
        `
        SELECT item_id
        FROM favorites
        WHERE user_id = $1 AND item_type = $2 AND rank = $3
        LIMIT 1
        `,
        [userId, itemType, finalRank]
      );

      const occupantItemId = occupantRes.rows[0]?.item_id ?? null;

      // Only swap if rank is taken by a different item
      if (occupantItemId !== null && Number(occupantItemId) !== itemId) {
        const prevRank = alreadyExists ? (existsRes.rows[0]?.rank ?? null) : null;

        // move occupant to our previous rank (or null if we didn't have one)
        await client.query(
          `
          UPDATE favorites
          SET rank = $1
          WHERE user_id = $2 AND item_type = $3 AND item_id = $4
          `,
          [prevRank, userId, itemType, occupantItemId]
        );
      }
    }

    // Upsert the favourite row and set rank/display
    const upsertRes = await client.query(
      `
      INSERT INTO favorites (user_id, item_type, item_id, rank, display)
      VALUES ($1, $2, $3, $4, TRUE)
      ON CONFLICT (user_id, item_type, item_id)
      DO UPDATE SET
        rank = EXCLUDED.rank,
        display = favorites.display,
        added_at = favorites.added_at
      RETURNING user_id, item_type, item_id, rank, display, added_at
      `,
      [userId, itemType, itemId, finalRank]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Favourite saved",
      favourite: upsertRes.rows[0],
    });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {}
    console.error("setFavourite error:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

// =======================================
// DELETE /favorites
// Remove favourite
// Body: { type, item_id }
// =======================================
exports.removeFavourite = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { type, item_id } = req.body;

    const itemType = normalizeType(type);
    const itemId = Number(item_id);

    if (!itemType) {
      return res
        .status(400)
        .json({ error: "Invalid type. Use Tracks/Albums/Artists." });
    }
    if (!Number.isFinite(itemId)) {
      return res.status(400).json({ error: "Invalid item_id" });
    }

    await pool.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1 AND item_type = $2 AND item_id = $3
      `,
      [userId, itemType, itemId]
    );

    return res.json({ message: "Favourite removed" });
  } catch (err) {
    console.error("removeFavourite error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /favorites
// Get logged-in user's favourites
// Includes rank + display and orders by rank
// =======================================
exports.getMyFavourites = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT item_type, item_id, rank, display, added_at
      FROM favorites
      WHERE user_id = $1
      ORDER BY rank ASC NULLS LAST, added_at DESC
      `,
      [userId]
    );

    return res.json({ favorites: result.rows });
  } catch (err) {
    console.error("getMyFavourites error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /favorites/exists?type=Tracks&spotifyId=...
// checks if current user has favourited the item (by spotify id)
// =======================================
exports.existsFavouriteBySpotifyId = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const type = req.query.type;
    const spotifyId = req.query.spotifyId;

    const item_type = mapClientTypeToDbEnum(type);
    if (!item_type) return res.status(400).json({ error: "Invalid type" });
    if (!spotifyId) return res.status(400).json({ error: "Missing spotifyId" });

    const item_id = await getDbIdFromSpotify(item_type, spotifyId);
    if (!item_id) {
      return res.json({ exists: false, item_id: null });
    }

    const existsRes = await pool.query(
      `
      SELECT EXISTS(
        SELECT 1
        FROM favorites
        WHERE user_id = $1 AND item_type = $2 AND item_id = $3
      ) AS exists
      `,
      [userId, item_type, item_id]
    );

    return res.json({
      exists: !!existsRes.rows[0]?.exists,
      item_id,
    });
  } catch (err) {
    console.error("existsFavouriteBySpotifyId error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /favorites/count?type=Tracks
// Returns { count, max, item_type }
// =======================================
exports.countMyFavouritesByType = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const itemType = normalizeType(req.query.type);
    if (!itemType) return res.status(400).json({ error: "Invalid type" });

    const count = await countUserFavouritesByType(userId, itemType);
    return res.json({ count, max: 3, item_type: itemType });
  } catch (err) {
    console.error("countMyFavouritesByType error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};



// =====================================================
// POST /favorites/reorder
// Body: { type: "Albums"|"Tracks"|"Artists", order: [{ item_id, rank }, ...] }
// rank must be 1..3, no duplicates
// =====================================================
exports.reorderFavourites = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.user_id;
    const { type, order } = req.body;

    const itemType = normalizeType(type);
    if (!itemType) {
      return res.status(400).json({ error: "Invalid type. Use Tracks/Albums/Artists." });
    }

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: "order array is required" });
    }

    // validate entries + ensure unique ranks
    const seenRanks = new Set();
    const itemIds = [];

    for (const row of order) {
      const id = Number(row.item_id);
      const r = Number(row.rank);

      if (!Number.isFinite(id) || !Number.isFinite(r)) {
        return res.status(400).json({ error: "Invalid order entry" });
      }
      if (![1, 2, 3].includes(r)) {
        return res.status(400).json({ error: "rank must be 1, 2, or 3" });
      }
      if (seenRanks.has(r)) {
        return res.status(409).json({ error: "Rank conflict", code: "FAV_RANK_CONFLICT" });
      }
      seenRanks.add(r);
      itemIds.push(id);
    }

    await client.query("BEGIN");

    // ensure all items belong to the user + correct type
    const owned = await client.query(
      `
      SELECT item_id
      FROM favorites
      WHERE user_id = $1 AND item_type = $2 AND item_id = ANY($3::int[])
      `,
      [userId, itemType, itemIds]
    );

    if (owned.rowCount !== itemIds.length) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "One or more favourites do not belong to you" });
    }

    // ✅ 2-phase update to avoid unique conflicts (if you add a unique rank rule later)
    await client.query(
      `
      UPDATE favorites
      SET rank = COALESCE(rank, 0) + 1000
      WHERE user_id = $1 AND item_type = $2 AND item_id = ANY($3::int[])
      `,
      [userId, itemType, itemIds]
    );

    for (const row of order) {
      await client.query(
        `
        UPDATE favorites
        SET rank = $1
        WHERE user_id = $2 AND item_type = $3 AND item_id = $4
        `,
        [Number(row.rank), userId, itemType, Number(row.item_id)]
      );
    }

    await client.query("COMMIT");
    return res.json({ ok: true });
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("reorderFavourites error:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};