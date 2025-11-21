const { pool } = require("../db");

exports.pinItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { item_type, item_id } = req.body;

    await pool.query(
      `
      INSERT INTO user_pins (user_id, item_type, item_id)
      VALUES ($1,$2,$3)
      ON CONFLICT (user_id, item_type, item_id) DO NOTHING
      `,
      [userId, item_type, item_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("pinItem error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.unpinItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { item_type, item_id } = req.body;

    await pool.query(
      `DELETE FROM user_pins WHERE user_id=$1 AND item_type=$2 AND item_id=$3`,
      [userId, item_type, item_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("unpinItem error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPinnedItems = async (req, res) => {
  try {
    const username = req.params.username;

    const r = await pool.query(
      `SELECT user_id FROM users WHERE LOWER(username)=LOWER($1)`,
      [username]
    );

    if (r.rowCount === 0)
      return res.status(404).json({ error: "User not found" });

    const userId = r.rows[0].user_id;

    const result = await pool.query(
      `SELECT item_type, item_id, pinned_at FROM user_pins WHERE user_id=$1`,
      [userId]
    );

    res.json({ pins: result.rows });
  } catch (err) {
    console.error("getPinnedItems error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
