const { pool } = require("../db");

// Block a user
exports.blockUser = async (req, res) => {
  try {
    const blockerId = req.user.user_id;
    const targetUsername = req.params.username;

    const r = await pool.query(
      `SELECT user_id FROM users WHERE LOWER(username)=LOWER($1)`,
      [targetUsername]
    );

    if (r.rowCount === 0)
      return res.status(404).json({ error: "User not found" });

    const targetId = r.rows[0].user_id;

    await pool.query(
      `
      INSERT INTO user_blocks (blocker_id, blocked_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [blockerId, targetId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("blockUser error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Unblock
exports.unblockUser = async (req, res) => {
  try {
    const blockerId = req.user.user_id;
    const targetUsername = req.params.username;

    const r = await pool.query(
      `SELECT user_id FROM users WHERE LOWER(username)=LOWER($1)`,
      [targetUsername]
    );

    if (r.rowCount === 0)
      return res.status(404).json({ error: "User not found" });

    const targetId = r.rows[0].user_id;

    await pool.query(
      `DELETE FROM user_blocks WHERE blocker_id=$1 AND blocked_id=$2`,
      [blockerId, targetId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("unblockUser error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
