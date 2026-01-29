
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



// const { Pool } = require("pg");

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// pool
//   .connect()
//   .then(() => console.log("✅ PostgreSQL Connected Successfully (Neon)"))
//   .catch((err) =>
//     console.error("❌ PostgreSQL Connection Error:", err.message)
//   );

// module.exports = pool;




