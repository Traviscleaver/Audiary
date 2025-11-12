const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("./db");

const router = express.Router();
const JWT_TTL = "15d";

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_TTL });
}

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

    await client.query("COMMIT");
    return user;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

function parseAuthHeader(req) {
  const hdr = req.headers.authorization || "";
  const parts = hdr.split(" ");
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return null;
}

function authOptional(req, _res, next) {
  const token = parseAuthHeader(req);
  if (!token) return next();
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_) {
    // ignore invalid token in optional middleware
  }
  next();
}

function authRequired(req, res, next) {
  const token = parseAuthHeader(req);
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* --------- POST /auth/register --------- */
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body || {};
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "email, username, password required" });
    }

    const dupRes = await pool.query(
      `SELECT 1 FROM users WHERE LOWER(email)=LOWER($1) OR LOWER(username)=LOWER($2)`,
      [email, username]
    );
    if (dupRes.rowCount > 0) {
      return res.status(409).json({ error: "Email or username already in use" });
    }

    const user = await createUserWithPassword(email, username, password);
    const token = signToken({ user_id: user.user_id });
    return res.json({ token, user });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* --------- POST /auth/login --------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const userRes = await pool.query(
      `SELECT u.user_id, u.email, u.username, u.display_name, u.avatar_url, u.joined_at
       FROM users u WHERE LOWER(u.email)=LOWER($1)`,
      [email]
    );
    if (userRes.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = userRes.rows[0];

    const passRes = await pool.query(
      `SELECT password_hash FROM auth_local WHERE user_id=$1`,
      [user.user_id]
    );
    if (passRes.rowCount === 0) {
      return res.status(401).json({ error: "Password auth not set for this user" });
    }

    const ok = await bcrypt.compare(password, passRes.rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ user_id: user.user_id });
    return res.json({ token, user });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* --------- POST /auth/guest (Skip login) --------- */
router.post("/guest", async (_req, res) => {
  try {
    const token = jwt.sign({ guest: true }, process.env.JWT_SECRET, {
      expiresIn: "3d"
    });
    return res.json({ token, guest: true });
  } catch (err) {
    console.error("guest error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* --------- GET /auth/me --------- */
router.get("/me", authOptional, async (req, res) => {
  try {
    if (req.user?.guest) {
      return res.json({ guest: true, user: null });
    }
    if (!req.user?.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userRes = await pool.query(
      `SELECT user_id, email, username, display_name, avatar_url, joined_at
       FROM users WHERE user_id=$1`,
      [req.user.user_id]
    );
    if (userRes.rowCount === 0) return res.status(404).json({ error: "Not found" });

    return res.json({ guest: false, user: userRes.rows[0] });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* Example of a protected route (future use)
router.get("/protected", authRequired, (req, res) => {
  return res.json({ ok: true, user: req.user });
});
*/

module.exports = router;
