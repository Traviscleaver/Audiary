// controllers/userController.js
const { pool } = require("../db");

// ===============================
// Helper: Fetch user by username
// ===============================
async function fetchUserByUsername(username) {
  const result = await pool.query(
    `
    SELECT 
      u.user_id,
      u.username,
      u.display_name,
      u.avatar_url,
      u.joined_at,

      p.first_name,
      p.last_name,
      p.bio,
      p.location,
      p.website,
      p.banner_url,

      (SELECT COUNT(*) FROM follows WHERE following_id = u.user_id) AS followers_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.user_id) AS following_count

    FROM users u
    LEFT JOIN user_profiles p ON p.user_id = u.user_id
    WHERE LOWER(u.username) = LOWER($1)
    LIMIT 1
    `,
    [username]
  );

  return result.rows[0];
}

// ===============================
// GET /profile (self)
// ===============================
exports.getProfileSelf = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT 
        u.user_id,
        u.username,
        u.display_name,
        u.email,
        u.avatar_url,
        u.joined_at,

        p.first_name,
        p.last_name,
        p.bio,
        p.location,
        p.website,
        p.banner_url,

        (SELECT COUNT(*) FROM follows WHERE following_id = u.user_id) AS followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.user_id) AS following_count

      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.user_id
      WHERE u.user_id = $1
      `,
      [userId]
    );

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("getProfileSelf error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/profile (public)
// =======================================
exports.getProfilePublic = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ user });
  } catch (err) {
    console.error("getProfilePublic error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/ratings
// =======================================
exports.getUserRatings = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT 
        r.song_id,
        r.rating,
        r.rated_at,
        s.title AS song_title,
        a.title AS album_title,
        a.cover_url
      FROM ratings r
      JOIN songs s ON s.song_id = r.song_id
      JOIN albums a ON a.album_id = s.album_id
      WHERE r.user_id = $1
      ORDER BY r.rated_at DESC
      LIMIT 100
      `,
      [user.user_id]
    );

    return res.json({ ratings: result.rows });
  } catch (err) {
    console.error("getUserRatings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/reviews
// =======================================
exports.getUserReviews = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT 
        r.review_id,
        r.song_id,
        r.rating,
        r.content,
        r.created_at,
        r.updated_at,

        s.title AS song_title,
        a.title AS album_title,
        a.cover_url
      FROM reviews r
      JOIN songs s ON s.song_id = r.song_id
      JOIN albums a ON a.album_id = s.album_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      LIMIT 100
      `,
      [user.user_id]
    );

    return res.json({ reviews: result.rows });
  } catch (err) {
    console.error("getUserReviews error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/search?q=<query>&limit=<limit>
// =======================================
exports.searchUsers = async (req, res) => {
  try {
    const qRaw = String(req.query.q || "").trim();
    const q = qRaw.toLowerCase();
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);

    if (q.length < 2) return res.json({ users: [] });

    const result = await pool.query(
      `
      SELECT
        u.user_id,
        u.username,
        u.display_name,
        u.avatar_url,
        u.joined_at,
        (SELECT COUNT(*) FROM follows WHERE following_id = u.user_id) AS followers_count
      FROM users u
      WHERE
        LOWER(u.username) LIKE $1
        OR LOWER(u.display_name) LIKE $1
      ORDER BY
        CASE
          WHEN LOWER(u.username) LIKE $2 THEN 0
          WHEN LOWER(u.username) LIKE $1 THEN 1
          WHEN LOWER(u.display_name) LIKE $1 THEN 2
          ELSE 3
        END,
        LOWER(u.username) ASC
      LIMIT $3
      `,
      [`%${q}%`, `${q}%`, limit]
    );

    return res.json({ users: result.rows });
  } catch (err) {
    console.error("searchUsers error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/playlists
// =======================================
exports.getUserPlaylists = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT p.playlist_id, p.title, p.description, p.is_public, p.created_at,
             COUNT(ps.song_id) AS song_count
      FROM playlists p
      LEFT JOIN playlist_songs ps ON ps.playlist_id = p.playlist_id
      WHERE p.user_id = $1
      GROUP BY p.playlist_id
      ORDER BY p.created_at DESC
      `,
      [user.user_id]
    );

    return res.json({ playlists: result.rows });
  } catch (err) {
    console.error("getUserPlaylists error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/diary
// =======================================
exports.getUserDiary = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT 
        d.entry_id,
        d.listened_at,
        d.rating,
        d.notes,

        s.song_id,
        s.title AS song_title,

        a.title AS album_title,
        a.cover_url
      FROM diary_entries d
      JOIN songs s ON s.song_id = d.song_id
      JOIN albums a ON a.album_id = s.album_id
      WHERE d.user_id = $1
      ORDER BY d.listened_at DESC
      LIMIT 200
      `,
      [user.user_id]
    );

    return res.json({ diary: result.rows });
  } catch (err) {
    console.error("getUserDiary error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/favorites
// =======================================
// =======================================
// GET /users/:username/favorites (HYDRATED)
// =======================================
exports.getUserFavorites = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT
        f.item_type,
        f.item_id,
        f.added_at,

        -- unified display fields
        COALESCE(s.title, al.title, ar.name) AS title,

        -- image to display
        COALESCE(al.cover_url, ar.image_url) AS image_url,

        -- optional subtitle (artist name)
        COALESCE(ar2.name, ar.name) AS subtitle

      FROM favorites f

      -- SONG favorite: join song -> album -> artist
      LEFT JOIN songs s
        ON f.item_type = 'song' AND s.song_id = f.item_id
      LEFT JOIN albums al
        ON (
          (f.item_type = 'album' AND al.album_id = f.item_id)
          OR
          (f.item_type = 'song' AND al.album_id = s.album_id)
        )
      LEFT JOIN artists ar
        ON (f.item_type = 'artist' AND ar.artist_id = f.item_id)

      -- artist for album/song (separate alias so we can subtitle songs/albums)
      LEFT JOIN artists ar2
        ON (al.artist_id = ar2.artist_id)

      WHERE f.user_id = $1
      ORDER BY f.added_at DESC
      `,
      [user.user_id]
    );

    return res.json({ favorites: result.rows });
  } catch (err) {
    console.error("getUserFavorites error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/activity
// =======================================
exports.getUserActivity = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT activity_id, type, target_id, description, created_at
      FROM activities
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [user.user_id]
    );

    return res.json({ activity: result.rows });
  } catch (err) {
    console.error("getUserActivity error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/stats
// =======================================
exports.getUserStats = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await pool.query(
      `
      SELECT *
      FROM stats
      WHERE user_id = $1
      `,
      [user.user_id]
    );

    return res.json({ stats: result.rows[0] || {} });
  } catch (err) {
    console.error("getUserStats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// GET /users/:username/full
// =======================================
exports.getFullProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found" });

    const [
      stats,
      playlists,
      ratings,
      reviews,
      diary,
      favorites,
      activity,
    ] = await Promise.all([

      pool.query(`SELECT * FROM stats WHERE user_id = $1`, [user.user_id]),

      pool.query(
        `
        SELECT p.playlist_id, p.title, p.description, p.is_public, p.created_at,
               COUNT(ps.song_id) AS song_count
        FROM playlists p
        LEFT JOIN playlist_songs ps ON ps.playlist_id = p.playlist_id
        WHERE p.user_id = $1
        GROUP BY p.playlist_id
        `,
        [user.user_id]
      ),

      pool.query(
        `
        SELECT 
          r.song_id,
          r.rating,
          r.rated_at,
          s.title AS song_title,
          a.title AS album_title,
          a.cover_url
        FROM ratings r
        JOIN songs s ON s.song_id = r.song_id
        JOIN albums a ON a.album_id = s.album_id
        WHERE r.user_id = $1
        ORDER BY r.rated_at DESC
        LIMIT 50
        `,
        [user.user_id]
      ),

      pool.query(
        `
        SELECT 
          r.review_id,
          r.song_id,
          r.rating,
          r.content,
          r.created_at,

          s.title AS song_title,
          a.title AS album_title,
          a.cover_url
        FROM reviews r
        JOIN songs s ON s.song_id = r.song_id
        JOIN albums a ON a.album_id = s.album_id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
        `,
        [user.user_id]
      ),

      pool.query(
        `
        SELECT 
          d.entry_id,
          d.listened_at,
          d.rating,
          d.notes,
          s.song_id,
          s.title AS song_title,
          a.cover_url
        FROM diary_entries d
        JOIN songs s ON s.song_id = d.song_id
        JOIN albums a ON a.album_id = s.album_id
        WHERE d.user_id = $1
        ORDER BY d.listened_at DESC
        LIMIT 200
        `,
        [user.user_id]
      ),

      pool.query(
        `
        SELECT item_type, item_id, added_at
        FROM favorites
        WHERE user_id = $1
        `,
        [user.user_id]
      ),

      pool.query(
        `
        SELECT activity_id, type, target_id, description, created_at
        FROM activities
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 50
        `,
        [user.user_id]
      ),
    ]);

    return res.json({
      user,
      stats: stats.rows[0] || {},
      playlists: playlists.rows,
      ratings: ratings.rows,
      reviews: reviews.rows,
      diary: diary.rows,
      favorites: favorites.rows,
      activity: activity.rows,
    });
  } catch (err) {
    console.error("getFullProfile error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =======================================
// PUT /profile  (UPDATE NAME/BIO/LOCATION)
// =======================================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const {
      email,
      username,
      display_name,
      avatar_url,
      first_name,
      last_name,
      bio,
      location,
      website,
      banner_url,
    } = req.body;

    // Update USERS table
    const updatedUser = await pool.query(
      `
      UPDATE users
      SET
        email = COALESCE($1, email),
        username = COALESCE($2, username),
        display_name = COALESCE($3, display_name),
        avatar_url = COALESCE($4, avatar_url)
      WHERE user_id = $5
      RETURNING user_id, username, display_name, email, avatar_url, joined_at
      `,
      [email, username, display_name, avatar_url, userId]
    );

    // Update USER_PROFILES table
    await pool.query(
      `
      INSERT INTO user_profiles (
        user_id, first_name, last_name, bio, location, website, banner_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
        bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
        location = COALESCE(EXCLUDED.location, user_profiles.location),
        website = COALESCE(EXCLUDED.website, user_profiles.website),
        banner_url = COALESCE(EXCLUDED.banner_url, user_profiles.banner_url),
        last_updated = NOW()
      `,
      [userId, first_name, last_name, bio, location, website, banner_url]
    );

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (err) {
    console.error("updateProfile error:", err);

    if (err.code === "23505") {
      if (err.constraint === "users_email_lower_idx") {
        return res.status(400).json({ error: "Email already taken" });
      }
      if (err.constraint === "users_username_lower_idx") {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};


async function recalcUserStats(userId) {
  await pool.query(`
    UPDATE stats SET
      total_reviews = (SELECT COUNT(*) FROM reviews WHERE user_id = $1),
      total_ratings = (SELECT COUNT(*) FROM ratings WHERE user_id = $1),
      avg_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM ratings
        WHERE user_id = $1
      ),
      total_songs_listened = (
        SELECT COUNT(*) FROM diary_entries WHERE user_id = $1
      ),
      total_artists = (
        SELECT COUNT(DISTINCT a.artist_id)
        FROM diary_entries d
        JOIN songs s ON s.song_id = d.song_id
        JOIN albums al ON al.album_id = s.album_id
        JOIN artists a ON a.artist_id = al.artist_id
        WHERE d.user_id = $1
      ),
      last_updated = NOW()
    WHERE user_id = $1
  `, [userId]);
}