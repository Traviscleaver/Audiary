const { pool } = require("../db");

// Get user_id from username
async function fetchUserId(username) {
  const r = await pool.query(
    `SELECT user_id FROM users WHERE LOWER(username)=LOWER($1) LIMIT 1`,
    [username]
  );
  return r.rows[0]?.user_id || null;
}

/* =========================================
   FOLLOW USER
   ========================================= */
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.user_id;
    const targetUsername = req.params.username;

    const targetId = await fetchUserId(targetUsername);
    if (!targetId) return res.status(404).json({ error: "User not found" });

    if (targetId === followerId)
      return res.status(400).json({ error: "Cannot follow yourself" });

    await pool.query(
      `
      INSERT INTO follows (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [followerId, targetId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("followUser error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================
   UNFOLLOW USER
   ========================================= */
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.user_id;
    const targetUsername = req.params.username;

    const targetId = await fetchUserId(targetUsername);
    if (!targetId) return res.status(404).json({ error: "User not found" });

    await pool.query(
      `DELETE FROM follows WHERE follower_id=$1 AND following_id=$2`,
      [followerId, targetId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("unfollowUser error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================
   GET FOLLOWERS
   ========================================= */
exports.getFollowers = async (req, res) => {
  try {
    const targetUsername = req.params.username;
    const userId = await fetchUserId(targetUsername);

    if (!userId) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.username,
        u.display_name,
        u.avatar_url,
        f.followed_at
      FROM follows f
      JOIN users u ON u.user_id = f.follower_id
      WHERE f.following_id=$1
      ORDER BY f.followed_at DESC
      `,
      [userId]
    );

    return res.json({ followers: result.rows });
  } catch (err) {
    console.error("getFollowers error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================
   GET FOLLOWING
   ========================================= */
exports.getFollowing = async (req, res) => {
  try {
    const targetUsername = req.params.username;
    const userId = await fetchUserId(targetUsername);

    if (!userId) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.username,
        u.display_name,
        u.avatar_url,
        f.followed_at
      FROM follows f
      JOIN users u ON u.user_id = f.following_id
      WHERE f.follower_id=$1
      ORDER BY f.followed_at DESC
      `,
      [userId]
    );

    return res.json({ following: result.rows });
  } catch (err) {
    console.error("getFollowing error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
