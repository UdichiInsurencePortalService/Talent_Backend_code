

const { Pool } = require("pg");

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




