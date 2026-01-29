const { pool } = require("../db");

exports.addListenLater = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { song_id } = req.body;

    await pool.query(
      `
      INSERT INTO listen_later (user_id, song_id)
      VALUES ($1,$2)
      ON CONFLICT (user_id, song_id) DO NOTHING
      `,
      [userId, song_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("addListenLater error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeListenLater = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { song_id } = req.body;

    await pool.query(
      `
      DELETE FROM listen_later WHERE user_id=$1 AND song_id=$2
      `,
      [userId, song_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("removeListenLater error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getListenLater = async (req, res) => {
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
      `
      SELECT 
        l.song_id,
        l.added_at,
        s.title,
        a.title AS album_title,
        a.cover_url
      FROM listen_later l
      JOIN songs s ON s.song_id = l.song_id
      JOIN albums a ON a.album_id = s.album_id
      WHERE l.user_id=$1
      ORDER BY l.added_at DESC
      `,
      [userId]
    );

    res.json({ list: result.rows });
  } catch (err) {
    console.error("getListenLater error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
