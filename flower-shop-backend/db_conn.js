// db.js
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "flower_shop.db");

/**
 * Factory that returns a new SQLite connection with FK enforcement enabled.
 * Use this in scripts (init/seed) and in server.js.
 */
function createDbConnection() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite:", DB_PATH);
    }
  });

  // Ensure Foreign Key constraints are enforced on this connection
  // SQLite does not enforce foreign key constraints by default

  db.run("PRAGMA foreign_keys = ON;");

  return db;
}

module.exports = { createDbConnection, DB_PATH }; // make available to other files
