// Import the sqlite3 module and enable verbose mode for better debugging
const sqlite3 = require('sqlite3').verbose();

// Open a connection to the SQLite database file
const path = require("path");
const { createDbConnection } = require("./db_conn.js");
const db = createDbConnection();

// Import the products array from your local products-data.js file
const { products } = require('../scripts/products-data.js');

// Start a serialized transaction to ensure queries run in order
db.serialize(() => {
  // Prepare an SQL statement for inserting product data into the products table
  // placeholders will tell the DB driver to escape and sanitize values that will be sent
  // and then when you run the statement ('template'), you're sort of filling in the blanks
  const stmt = db.prepare(`
    INSERT INTO products (category, name, img, alt, description, longDescription, price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Loop through each product in the array and insert it into the database
  products.forEach(product => {
    stmt.run(
      product.category,         // category (e.g., "Flowers", "Succulents", "Tools")
      product.name,             // product name
      product.img,              // image path or URL
      product.alt,              // alt text for accessibility
      product.description,      // short description
      product.longDescription,  // detailed description
      product.price             // price as a number (e.g., 12.99)
    );
  });

  // Finalize the prepared statement to release resources
  stmt.finalize();
});

// Close the database connection after all inserts are done
db.close((err) => {
  if (err) return console.error('Error closing DB:', err.message);
  console.log('Database seeding complete.');
});

// Summary
// sqlite3.Database(): Opens or creates the database file.
// db.serialize(): Ensures all DB operations inside it run sequentially.
// db.prepare(): Prepares a reusable SQL statement with placeholders (?).
// stmt.run(): Executes the prepared statement with actual values.
// stmt.finalize(): Closes the prepared statement.
// db.close(): Closes the database connection.
