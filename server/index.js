// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user"); 
// const { pool } = require("./db"); 

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// console.log("Starting Audiary API server...");

// // ===== ROUTES =====
// app.use("/auth", authRoutes);
// app.use("/", userRoutes);                      

// // ===== DB TEST ROUTE =====
// app.get("/db-test", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json({
//       success: true,
//       serverTime: result.rows[0].now,
//       message: "✅ Connected to Supabase database successfully!",
//     });
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Audiary API running");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on ${PORT}`));
const app = require("./app");

const PORT = process.env.PORT || 3000;

console.log("Starting Audiary API server...");
app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on ${PORT}`));

