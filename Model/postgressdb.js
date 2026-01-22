require("dotenv").config()
const {Pool} = require("pg")
const pool = new Pool({
    host: process.env.DB_HOST,     // server
  port: process.env.DB_PORT,     // default 5432
  user: process.env.DB_USER,     // username
  password: process.env.DB_PASSWORD, // password
  database: process.env.DB_DATABASE, // database name
})

pool.connect()
.then(()=>console.log("📌 PostgreSQL Connected Successfully"))
.catch(err =>console.log("❌ PostgreSQL Connection Error:", err.message));

module.exports = pool;


// Pool manages multiple DB connections.
// process.env.POSTGRES_URL keeps secrets out of code (put in .env).
// Exporting pool lets model functions run pool.query().


// const { Pool } = require("pg");

// // Load .env ONLY for local development
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// pool
//   .connect()
//   .then(() => console.log("📌 PostgreSQL Connected Successfully"))
//   .catch((err) =>
//     console.error("❌ PostgreSQL Connection Error:", err.message)
//   );

// module.exports = pool;
