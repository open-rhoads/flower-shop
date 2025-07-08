// Import the sqlite3 module
const sqlite3 = require('sqlite3').verbose();

// Connect to the database (creates the file if it doesn't exist)
const db = new sqlite3.Database('./flower_shop.db', (err) => {
  if (err) {
    return console.error('Error opening database:', err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create tables
db.serialize(() => {
  // Create products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT
  )`);

  // Create cart table
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Create orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT,
    total REAL,
    created_at TEXT
  )`);
});

// Close the database connection
db.close((err) => {
  if (err) {
    return console.error('Error closing database:', err.message);
  }
  console.log('Database setup complete and connection closed.');
});
