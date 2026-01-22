




const { Pool } = require("pg");

// Load .env only in local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => console.log("✅ PostgreSQL Connected Successfully (Neon)"))
  .catch((err) =>
    console.error("❌ PostgreSQL Connection Error:", err.message)
  );

module.exports = pool;




