const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const signToken = require("../utils/signToken");

async function createUserWithPassword(email, username, password) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      `INSERT INTO users (email, username, display_name)
       VALUES ($1, $2, $2)
       RETURNING user_id, email, username, display_name, avatar_url, joined_at`,
      [email, username]
    );
    const user = userRes.rows[0];

    const hash = await bcrypt.hash(password, 12);
    await client.query(
      `INSERT INTO auth_local (user_id, password_hash) VALUES ($1, $2)`,
      [user.user_id, hash]
    );
    await client.query(`
      INSERT INTO stats (user_id)
      VALUES ($1)
    `, [user.user_id]);

    await client.query("COMMIT");
    return user;

  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body || {};
    console.log("Register attempt:", email, username);
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "email, username, password required" });
    }

    const dupRes = await pool.query(
      `SELECT 1 FROM users WHERE LOWER(email)=LOWER($1) OR LOWER(username)=LOWER($2)`,
      [email, username]
    );

    if (dupRes.rowCount > 0)
      return res.status(409).json({ error: "Email or username already in use" });

    const user = await createUserWithPassword(email, username, password);
    const token = signToken({ user_id: user.user_id });

    return res.json({ token, user });

  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {

  try {
    const { email, password } = req.body || {};
    console.log("Login attempt:", email);
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });

    const userRes = await pool.query(
      `SELECT user_id, email, username, display_name, avatar_url, joined_at
       FROM users WHERE LOWER(email)=LOWER($1)`,
      [email]
    );

    if (userRes.rowCount === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = userRes.rows[0];

    const passRes = await pool.query(
      `SELECT password_hash FROM auth_local WHERE user_id=$1`,
      [user.user_id]
    );

    if (passRes.rowCount === 0)
      return res.status(401).json({ error: "Password auth not set" });

    const ok = await bcrypt.compare(password, passRes.rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ user_id: user.user_id });

    return res.json({ token, user });

  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    if (!req.user?.user_id)
      return res.status(401).json({ error: "Unauthorized" });

    const userRes = await pool.query(
      `SELECT user_id, email, username, display_name, avatar_url, joined_at
       FROM users WHERE user_id=$1`,
      [req.user.user_id]
    );

    if (userRes.rowCount === 0)
      return res.status(404).json({ error: "Not found" });

    return res.json({ user: userRes.rows[0] });

  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
