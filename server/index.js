const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { pool } = require("./db"); // ✅ CommonJS import for your Postgres pool
const authRoutes = require("./routes/auth"); // ✅ CommonJS import for routes

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("Starting Audiary API server...");

// ===== ROUTES =====
app.use("/auth", authRoutes);

// ===== DB TEST ROUTE =====
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      serverTime: result.rows[0].now,
      message: "✅ Connected to Supabase database successfully!",
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ===== ROOT CHECK =====
app.get("/", (req, res) => {
  res.send("Audiary API running");
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
