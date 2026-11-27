// const mysql = require("mysql2");
// require("dotenv").config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3307, // Port 3307 yahan pass hoga
// });

// module.exports = pool.promise();

const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const caPath = process.env.DB_SSL_CA_PATH
  ? path.resolve(process.cwd(), process.env.DB_SSL_CA_PATH)
  : path.resolve(__dirname, "../certs/ca.pem");

const sslConfig = fs.existsSync(caPath)
  ? {
      ca: fs.readFileSync(caPath),
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    }
  : {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    };

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 4000,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();