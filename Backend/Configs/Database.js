const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const pool = mysql.createPool({
  connectionLimit: 30,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 20000,
  charset: "utf8mb4",
  timezone: "Z",
});

module.exports = pool;
