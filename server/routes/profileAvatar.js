const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const authRequired = require("../middleware/authRequired");
const { pool } = require("../db");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post("/profile/avatar", authRequired, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.user_id; // your JWT middleware sets this
    if (!req.file) return res.status(400).json({ error: "Missing file" });

    const ext = (req.file.originalname.split(".").pop() || "jpg").toLowerCase();
    const path = `users/${userId}/avatar.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, req.file.buffer, {
        contentType: req.file.mimetype || "image/jpeg",
        upsert: true,
      });

    if (upErr) return res.status(400).json({ error: upErr.message });

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`; // cache-bust

    // Save into your DB
    const updated = await pool.query(
      `UPDATE users SET avatar_url = $1 WHERE user_id = $2
       RETURNING user_id, username, display_name, email, avatar_url, joined_at`,
      [avatarUrl, userId]
    );

    return res.json({ user: updated.rows[0] });
  } catch (e) {
    console.error("avatar upload error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
