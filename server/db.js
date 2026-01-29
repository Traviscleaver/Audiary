require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  console.error("Unexpected PG error", err);
  process.exit(1);
});
module.exports = { pool };
