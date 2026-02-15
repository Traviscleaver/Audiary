// controllers/profileBlocksController.js
const { pool } = require("../db");

// Allowed block types for now.
// (Playlist supported by schema, but you said don't worry about it yet.)
const ALLOWED_BLOCK_TYPES = new Set(["favorites", "stats", "playlist"]);

// You can keep this loose since you said you might add more favorite blocks later.
function normalizeBlockType(t) {
  if (!t) return null;
  const v = String(t).trim().toLowerCase();
  return ALLOWED_BLOCK_TYPES.has(v) ? v : null;
}

function normalizeSubtype(s) {
  if (s === null || s === undefined) return null;
  const v = String(s).trim();
  return v.length ? v : null;
}

// =====================================================
// GET /profile/blocks
// Returns ordered blocks for current user
// =====================================================
exports.getMyProfileBlocks = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const r = await pool.query(
      `
      SELECT profile_block_id, block_type, subtype, ref_id, rank, display, created_at
      FROM profile_blocks
      WHERE user_id = $1
      ORDER BY rank ASC
      `,
      [userId]
    );

    // Client shows "Profile is empty" if blocks.length === 0
    return res.json({ blocks: r.rows });
  } catch (err) {
    console.error("getMyProfileBlocks error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =====================================================
// POST /profile/blocks
// Body: { block_type, subtype, ref_id }
// =====================================================
exports.createProfileBlock = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const block_type = normalizeBlockType(req.body.block_type);
    const subtype = normalizeSubtype(req.body.subtype);
    const ref_id =
      req.body.ref_id === null || req.body.ref_id === undefined
        ? null
        : Number(req.body.ref_id);

    if (!block_type) {
      return res.status(400).json({ error: "Invalid block_type" });
    }

    // Enforce your check constraint rules:
    // favorites: subtype required, ref_id null
    // stats: subtype required, ref_id null
    // playlist: ref_id required, subtype null
    if (block_type === "favorites" || block_type === "stats") {
      if (!subtype) {
        return res.status(400).json({ error: "subtype is required" });
      }
      if (ref_id !== null) {
        return res.status(400).json({ error: "ref_id must be null for this block_type" });
      }
    }

    if (block_type === "playlist") {
      if (!Number.isFinite(ref_id)) {
        return res.status(400).json({ error: "ref_id (playlist_id) is required" });
      }
      if (subtype !== null) {
        return res.status(400).json({ error: "subtype must be null for playlist blocks" });
      }
    }

    // Rank = max(rank)+1 (or 1 if none)
    const nextRankRes = await pool.query(
      `
      SELECT COALESCE(MAX(rank), 0) + 1 AS next_rank
      FROM profile_blocks
      WHERE user_id = $1
      `,
      [userId]
    );

    const nextRank = nextRankRes.rows[0]?.next_rank ?? 1;

    const insertRes = await pool.query(
      `
      INSERT INTO profile_blocks (user_id, block_type, subtype, ref_id, rank, display, created_at)
      VALUES ($1, $2, $3, $4, $5, TRUE, NOW())
      RETURNING profile_block_id, block_type, subtype, ref_id, rank, display, created_at
      `,
      [userId, block_type, subtype, ref_id, nextRank]
    );

    return res.status(201).json({ block: insertRes.rows[0] });
  } catch (err) {
    // Unique violations -> "duplicate block" message
    if (err && err.code === "23505") {
      return res.status(409).json({
        error: "This block already exists for your profile.",
        code: "BLOCK_DUPLICATE",
      });
    }

    console.error("createProfileBlock error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =====================================================
// PATCH /profile/blocks/:id
// Body: { display?, rank? }
// Minimal: allow updating display and/or rank.
// =====================================================
exports.updateProfileBlock = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const display =
      req.body.display === undefined ? undefined : Boolean(req.body.display);

    const rank =
      req.body.rank === undefined || req.body.rank === null
        ? undefined
        : Number(req.body.rank);

    if (display === undefined && rank === undefined) {
      return res.status(400).json({ error: "Nothing to update" });
    }
    if (rank !== undefined && !Number.isFinite(rank)) {
      return res.status(400).json({ error: "Invalid rank" });
    }

    // Simple update. If rank conflicts with another block, DB unique index will throw 23505.
    const r = await pool.query(
      `
      UPDATE profile_blocks
      SET
        display = COALESCE($1, display),
        rank    = COALESCE($2, rank)
      WHERE profile_block_id = $3 AND user_id = $4
      RETURNING profile_block_id, block_type, subtype, ref_id, rank, display, created_at
      `,
      [display === undefined ? null : display, rank === undefined ? null : rank, id, userId]
    );

    if (r.rowCount === 0) return res.status(404).json({ error: "Block not found" });

    return res.json({ block: r.rows[0] });
  } catch (err) {
    if (err && err.code === "23505") {
      return res.status(409).json({
        error: "Rank conflict or duplicate block.",
        code: "BLOCK_CONFLICT",
      });
    }
    console.error("updateProfileBlock error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// =====================================================
// POST /profile/blocks/reorder
// Body: { order: [{ profile_block_id, rank }, ...] }
// =====================================================
exports.reorderProfileBlocks = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.user_id;
    const order = Array.isArray(req.body.order) ? req.body.order : null;

    if (!order || order.length === 0) {
      return res.status(400).json({ error: "order array is required" });
    }

    // Validate input + ensure no duplicate ranks in payload
    const seenRanks = new Set();
    for (const row of order) {
      const id = Number(row.profile_block_id);
      const rank = Number(row.rank);
      if (!Number.isFinite(id) || !Number.isFinite(rank)) {
        return res.status(400).json({ error: "Invalid order entry" });
      }
      if (seenRanks.has(rank)) {
        return res.status(409).json({ error: "Rank conflict", code: "BLOCK_CONFLICT" });
      }
      seenRanks.add(rank);
    }

    await client.query("BEGIN");

    // Ensure all belong to this user (and lock them to avoid concurrent reorder)
    const ids = order.map((r) => Number(r.profile_block_id));
    const owned = await client.query(
      `
      SELECT profile_block_id
      FROM profile_blocks
      WHERE user_id = $1 AND profile_block_id = ANY($2::int[])
      FOR UPDATE
      `,
      [userId, ids]
    );

    if (owned.rowCount !== ids.length) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "One or more blocks do not belong to you" });
    }

    // -------------------------------------------------
    // ✅ Step 1: move all involved blocks to temp ranks
    // (negative ranks avoid collisions with existing 1..n)
    // -------------------------------------------------
    for (let i = 0; i < order.length; i++) {
      const id = Number(order[i].profile_block_id);
      const tmpRank = -(i + 1);

      await client.query(
        `
        UPDATE profile_blocks
        SET rank = $1
        WHERE user_id = $2 AND profile_block_id = $3
        `,
        [tmpRank, userId, id]
      );
    }

    // -------------------------------------------------
    // ✅ Step 2: apply final ranks
    // -------------------------------------------------
    for (const row of order) {
      await client.query(
        `
        UPDATE profile_blocks
        SET rank = $1
        WHERE user_id = $2 AND profile_block_id = $3
        `,
        [Number(row.rank), userId, Number(row.profile_block_id)]
      );
    }

    await client.query("COMMIT");
    return res.json({ ok: true });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {}

    if (err && err.code === "23505") {
      return res.status(409).json({ error: "Rank conflict", code: "BLOCK_CONFLICT" });
    }

    console.error("reorderProfileBlocks error:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

// =====================================================
// DELETE /profile/blocks/:id
// =====================================================
exports.deleteProfileBlock = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const r = await pool.query(
      `
      DELETE FROM profile_blocks
      WHERE profile_block_id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (r.rowCount === 0) return res.status(404).json({ error: "Block not found" });

    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteProfileBlock error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
