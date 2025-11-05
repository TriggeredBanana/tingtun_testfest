import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,     
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test tilkobling
db.getConnection((err, connection) => {
  if (err) {
    console.error("Feil ved tilkobling til databasen:", err);
  } else {
    console.log("Tilkoblet til MariaDB med connection pool!");
    connection.release();
  }
});

export default db;
