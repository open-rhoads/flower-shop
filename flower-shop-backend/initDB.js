// Import the sqlite3 module
const sqlite3 = require('sqlite3').verbose();

// Use helper file/function to connect to the database 
const { createDbConnection } = require("./db_conn.js");
const db = createDbConnection();

// Create tables
db.serialize(() => {
  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      name TEXT,
      img TEXT,
      alt TEXT,
      description TEXT,
      longDescription TEXT,
      price REAL
    )`
  );

  // Create cart table
  db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      quantity INTEGER,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`
  );

  // Create orders table (receipt)
  db.run(`CREATE TABLE IF NOT EXISTS orders (  
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      subtotal_cents INTEGER NOT NULL DEFAULT 0,
      tax_cents INTEGER NOT NULL DEFAULT 0,
      shipping_cents INTEGER NOT NULL DEFAULT 0,
      total_cents INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`
  );
  // Create order_items table (the parts of the receipt)
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      price_at_time_cents INTEGER NOT NULL, -- snapshot of unit price at purchase time
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`
  );
  // create indexes to support foreign keys
  db.run(`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id)`);
});

// Close the database connection
db.close((err) => {
  if (err) {
    return console.error('Error closing database:', err.message);
  }
  console.log('Database setup complete and connection closed.');
});
