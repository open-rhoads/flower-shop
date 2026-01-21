// Import required modules
const express = require('express');         // Express is the web framework
const bodyParser = require('body-parser');  // Middleware to parse JSON request bodies
const cors = require('cors');               // Middleware to allow cross-origin requests
const sqlite3 = require('sqlite3').verbose(); // SQLite database driver

const app = express(); // Create an Express app
const PORT = 3000;     // Define the port your server will run on

// Middleware setup
app.use(cors());               // Allow requests from other origins (like your frontend)
app.use(bodyParser.json());    // Automatically parse JSON in incoming requests

// Connect to SQLite database (creates file if it doesn't exist)
const db = new sqlite3.Database('./flower_shop.db', (err) => {
  if (err) {
    return console.error(err.message); // Log error if connection fails
  }
  console.log('Connected to the SQLite database.');
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// how to start and stop this
// navigate to the backend folder in terminal
// to start: node server.js
// to stop: Ctrl + C

// multer for getting form data...a middleware so Express can process file uploads (default is JSON & URL encoded data only)
const multer = require("multer");
const upload = multer({ dest: "/uploads" }); // Files saved in /uploads

// Route to get all products
app.get('/products', (req, res) => {
  // Query all products from the database
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      // If there's an error, send a 500 response
      return res.status(500).json({ error: err.message });
    }
    // Send the list of products as JSON
    res.json(rows);
  });
});

// Route to add an item to the cart
app.post('/cart', (req, res) => {
  const { product_id, quantity } = req.body; // Extract product ID and quantity from request body

  // Insert the item into the cart table
  db.run('INSERT INTO cart (product_id, quantity) VALUES (?, ?)', [product_id, quantity], function(err) {
    if (err) {
      // If there's an error, send a 500 response
      return res.status(500).json({ error: err.message });
    }
    // Send back the ID of the newly inserted cart item
    res.json({ id: this.lastID });
  });
});

// Route to get all items in the cart
app.get('/cart', (req, res) => {
  // SQL query to join cart and products tables
  const query = `
    SELECT cart.id, cart.quantity, products.name, products.price
    FROM cart
    JOIN products ON cart.product_id = products.id
  `;
  // Execute the query
  db.all(query, [], (err, rows) => {
    if (err) {
      // If there's an error, send a 500 response with the error message
      return res.status(500).json({ error: err.message });
    }
    // If successful, send the resulting rows (cart items with product info) as JSON
    res.json(rows);
  });
});

// Route to delete an item from the cart by its cart ID
app.delete('/cart/:id', (req, res) => { // does this id need to be a variable...
  const cartItemId = req.params.id; // Get the cart item ID from the URL

  // SQL query to delete the item from the cart table
  const query = 'DELETE FROM cart WHERE id = ?';

  // Execute the query with the cart item ID
  db.run(query, [cartItemId], function(err) {
    if (err) {
      // If there's an error, send a 500 response with the error message
      return res.status(500).json({ error: err.message });
    }

    // If successful, send a confirmation message
    res.json({ message: 'Item removed from cart', deletedId: cartItemId });
  });
});

// Route to process form submissions
app.post("/contact", upload.single("attachment"), (req, res) => {
  const { name, message, email, phone, subscribe } = req.body;
  const file = req.file; // Uploaded file info

  console.log("Contact form submitted:", { name, message, email, phone, subscribe, file });
  // TODO: Send email or store in DB
  res.json({ success: true });
});
