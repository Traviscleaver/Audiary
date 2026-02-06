// controllers/favouritesController.js
const { pool } = require("../db");

// UI types -> DB enum types
function normalizeType(type) {
  if (!type) return null;

  // accept both UI labels and DB enum values
  const t = String(type).trim();

  if (t === "Tracks" || t === "Track" || t === "song") return "song";
  if (t === "Albums" || t === "Album" || t === "album") return "album";
  if (t === "Artists" || t === "Artist" || t === "artist") return "artist";

  return null;
}

// =======================================
// POST /favorites
// Add (set) favourite
// Body: { type: "Tracks"|"Albums"|"Artists" (or song/album/artist), item_id: number }
// Note: ensure/import happens BEFORE calling this.
// =======================================
exports.setFavourite = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const { type, item_id } = req.body;

    const itemType = normalizeType(type);
    const itemId = Number(item_id);

    if (!itemType) {
      return res.status(400).json({ error: "Invalid type. Use Tracks/Albums/Artists." });
    }
    if (!Number.isFinite(itemId)) {
      return res.status(400).json({ error: "Invalid item_id" });
    }

    // Insert if missing; if already exists, keep it (idempotent)
    const result = await pool.query(
      `
      INSERT INTO favorites (user_id, item_type, item_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, item_type, item_id)
      DO UPDATE SET added_at = favorites.added_at
      RETURNING user_id, item_type, item_id, added_at
      `,
      [userId, itemType, itemId]
    );

    return res.status(201).json({
      message: "Favourite saved",
      favourite: result.rows[0],
    });
  } catch (err) {
    console.error("setFavourite error:", err);
    return res.status(500).json({ error: "Internal server error" });
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
      return res.status(400).json({ error: "Invalid type. Use Tracks/Albums/Artists." });
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
// =======================================
exports.getMyFavourites = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT item_type, item_id, added_at
      FROM favorites
      WHERE user_id = $1
      ORDER BY added_at DESC
      `,
      [userId]
    );

    return res.json({ favorites: result.rows });
  } catch (err) {
    console.error("getMyFavourites error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};




function mapClientTypeToDbEnum(type) {
  // client sends: "Tracks" | "Albums" | "Artists"
  if (type === "Tracks") return "song";
  if (type === "Albums") return "album";
  if (type === "Artists") return "artist";
  return null;
}

async function getDbIdFromSpotify(itemType, spotifyId) {
  if (itemType === "song") {
    const r = await pool.query(`SELECT song_id AS id FROM songs WHERE spotify_id = $1 LIMIT 1`, [spotifyId]);
    return r.rows[0]?.id ?? null;
  }
  if (itemType === "album") {
    const r = await pool.query(`SELECT album_id AS id FROM albums WHERE spotify_id = $1 LIMIT 1`, [spotifyId]);
    return r.rows[0]?.id ?? null;
  }
  if (itemType === "artist") {
    const r = await pool.query(`SELECT artist_id AS id FROM artists WHERE spotify_id = $1 LIMIT 1`, [spotifyId]);
    return r.rows[0]?.id ?? null;
  }
  return null;
}

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

    // Find DB id for this spotify item
    const item_id = await getDbIdFromSpotify(item_type, spotifyId);
    if (!item_id) {
      // not even in DB → cannot be favourited
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