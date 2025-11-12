require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const app = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

const { JWT_SECRET = "dev-secret", PORT = 3000 } = process.env;

app.get("/", (_req, res) => res.json({ ok: true, service: "Audiary API" }));

// POST /auth/guest — issues a short-lived guest JWT
app.post("/auth/guest", async (_req, res) => {
  try {
    const token = jwt.sign({ guest: true }, JWT_SECRET, { expiresIn: "3d" });
    console.log("[/auth/guest] issued guest token");
    return res.json({ token, guest: true });
  } catch (err) {
    console.error("guest error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// sanity check endpoint to verify Authorization header works
app.get("/auth/me", (req, res) => {
  const hdr = req.headers.authorization || "";
  const [, token] = hdr.split(" ");
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.guest) return res.json({ guest: true, user: null });
    return res.json({ guest: false, user: { user_id: payload.user_id } });
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
