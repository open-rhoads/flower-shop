// Import required modules
const express = require('express');         // Express is the web framework
const cors = require('cors');               // Middleware to allow cross-origin requests
const sqlite3 = require('sqlite3').verbose(); // SQLite database driver
const fs = require("fs");
const { createDbConnection } = require("./db_conn.js"); // use helper file with db connection
// we do not need uuid as long as we have a unique session id column with an index (defined in initDB.js)

// multer for getting form data...a middleware so Express can process file uploads (default is JSON & URL encoded data only)
const multer = require("multer");
// Make sure ./uploads exists and use a safe absolute path
const path = require("path");

// Add express-session so we can scope carts per visitor (no login required)
const session = require('express-session');

const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir }); // Files saved in /uploads

const app = express(); // Create an Express app
const PORT = 3000;     // Define the port your server will run on

// Middleware setup: Order matters: CORS → JSON → session → routes.
// Allow requests from other origins (like your frontend)
// Allows front-end dev server (e.g., Live Server at 5500) to call the API on 3000
app.use(cors({origin: true, credentials: true })); 
app.use(express.json()); // use express.json to parse JSON request bodies
// enable/activate sessions 
app.use(
  session({
    secret: 'change-this-secret',   // put in env var later
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24 * 3 ,
      sameSite: 'lax' // default is fine for top-level navigations + fetch with credentials
    } // 3 days
  })
);
// Small helper so we don't repeat ourselves
function getSessionId(req) { 
  return req.sessionID; // set by express-session
}

// Connect to SQLite database (creates file if it doesn't exist)
const db = createDbConnection(); // use helper function from file with db connection

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// how to start and stop this
// navigate to the backend folder in terminal
// to start: node server.js
// to stop: Ctrl + C

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

  const q = Math.max(1, Number(quantity) || 1); // ensure quantity is greater of 1 or the quantity as Number...or just 1
  const sID = getSessionId(req); // use session ID helper to get the session ID of the current cart request

// Insert the item into the cart table
db.run(
  'INSERT INTO cart (product_id, quantity, session_id) VALUES (?, ?, ?)', 
  [product_id, q, sID], 
  function(err) {
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
  const sID = getSessionId(req);
  // SQL query to join cart and products tables
  const query = `
    SELECT cart.id, cart.quantity, products.name, products.price
    FROM cart
    JOIN products ON cart.product_id = products.id -- show products where the product id in cart matches ids in products
    WHERE cart.session_id = ? --and also where the session id in cart matches the one we pass in request
  `;
  // Execute the query with contextual session ID
  db.all(query, [sID], (err, rows) => {
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
  const sID = getSessionId(req);
  // SQL query to delete the item from the cart table, only with matching session ID
  const query = 'DELETE FROM cart WHERE id = ? AND session_id = ?';

  // Execute the query with the cart item ID  & session ID
  db.run(query, [cartItemId, sID], function(err) {
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

// Routes for checkout

// helper to Compute totals in CENTS (safer than floats)
function computeTotalsCents(items, shippingMethod = 'standard') {
  const subtotal_cents = items.reduce((sum, it) => {
    const price_cents = Math.round((Number(it.price) || 0) * 100);
    const qty = Math.max(0, Number(it.quantity) || 0);
    return sum + price_cents * qty;
  }, 0);
  const shipping_cents = shippingMethod === 'express' ? 1500 : 500;
  const tax_cents = 0; // simple for now
  const total_cents = subtotal_cents + shipping_cents + tax_cents;
  return { subtotal_cents, shipping_cents, tax_cents, total_cents };
}

// POST /checkout route
app.post('/checkout', (req, res) => {
  const sid = getSessionId(req);
  const { customer = {}, shippingAddress = {}, shippingMethod = 'standard' } = req.body || {};

  // 1) Get this session's cart with product info
  const cartQuery = `
    SELECT cart.id, cart.product_id, cart.quantity, p.name, p.price
    FROM cart
    JOIN products p ON cart.product_id = p.id
    WHERE cart.session_id = ?
  `;
  db.all(cartQuery, [sid], (err, cartRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!Array.isArray(cartRows) || cartRows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2) Compute totals (in cents) on the server (authoritative)
    const totals = computeTotalsCents(cartRows, shippingMethod);
    const createdAt = new Date().toISOString();

    // 3) Insert order (uses orders columns with separate address fields)
    const insertOrderSql = `
      INSERT INTO orders (
        name, email, phone,
        street, city, state, zip,
        subtotal_cents, tax_cents, shipping_cents, total_cents,
        created_at, shipping_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      String(customer.fullName || '').trim(),
      String(customer.email || '').trim(),
      '', // phone not captured in current form
      String(shippingAddress.street || '').trim(),
      String(shippingAddress.city || '').trim(),
      String(shippingAddress.state || '').trim(),
      String(shippingAddress.zip || '').trim(),
      totals.subtotal_cents,
      totals.tax_cents,
      totals.shipping_cents,
      totals.total_cents,
      createdAt,
      shippingMethod
    ];

    db.serialize(() => {
      db.run('BEGIN');
      db.run(insertOrderSql, params, function (err1) {
        if (err1) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err1.message });
        }
        const orderId = this.lastID; // INTEGER PRIMARY KEY from SQLite

        // 4) Insert order_items (snapshot price in cents)
        const insertItemSql = `
          INSERT INTO order_items (order_id, product_id, quantity, price_at_time_cents)
          VALUES (?, ?, ?, ?)
        `;
        const stmt = db.prepare(insertItemSql);
        try {
          cartRows.forEach(r => {
            const price_cents = Math.round((Number(r.price) || 0) * 100);
            stmt.run([orderId, r.product_id, r.quantity, price_cents]);
          });
        } catch (e) {
          stmt.finalize(() => db.run('ROLLBACK'));
          return res.status(500).json({ error: e.message });
        }
        stmt.finalize(err2 => {
          if (err2) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err2.message });
          }

          // 5) Clear this session's cart
          db.run('DELETE FROM cart WHERE session_id = ?', [sid], err3 => {
            if (err3) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err3.message });
            }

            db.run('COMMIT', err4 => {
              if (err4) return res.status(500).json({ error: err4.message });

              // 6) Respond with the shape checkout.js expects (convert cents -> dollars)
              res.json({
                id: orderId,
                createdAt,
                customer: {
                  fullName: String(customer.fullName || '').trim(),
                  email: String(customer.email || '').trim()
                },
                shippingAddress: {
                  street: String(shippingAddress.street || '').trim(),
                  city: String(shippingAddress.city || '').trim(),
                  state: String(shippingAddress.state || '').trim(),
                  zip: String(shippingAddress.zip || '').trim()
                },
                shippingMethod,
                items: cartRows.map(r => ({
                  id: r.product_id,
                  name: r.name,
                  price: Number(r.price), // dollars for FE display
                  quantity: r.quantity
                })),
                totals: {
                  subtotal: totals.subtotal_cents / 100,
                  shipping: totals.shipping_cents / 100,
                  tax: totals.tax_cents / 100,
                  grandTotal: totals.total_cents / 100
                }
              });
            });
          });
        });
      });
    });
  });
});

app.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  const getOrderSql = `
    SELECT id, name, email, phone,
           street, city, state, zip,
           subtotal_cents, tax_cents, shipping_cents, total_cents,
           created_at, shipping_method
    FROM orders
    WHERE id = ?
  `;
  // Join to products to show names alongside snapshot prices
  const getItemsSql = `
    SELECT oi.product_id, p.name, oi.quantity, oi.price_at_time_cents
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;

  db.get(getOrderSql, [orderId], (err1, o) => {
    if (err1) return res.status(500).json({ error: err1.message });
    if (!o)   return res.status(404).json({ error: 'Order not found' });

    db.all(getItemsSql, [orderId], (err2, items) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({
        id: o.id,
        createdAt: o.created_at,
        customer: { fullName: o.name, email: o.email },
        shippingAddress: { street: o.street, city: o.city, state: o.state, zip: o.zip },
        shippingMethod: o.shipping_method || 'standard',
        items: (items || []).map(it => ({
          id: it.product_id,
          name: it.name,
          price: it.price_at_time_cents / 100, // dollars for FE display
          quantity: it.quantity
        })),
        totals: {
          subtotal: o.subtotal_cents  / 100,
          shipping: o.shipping_cents  / 100,
          tax:      o.tax_cents       / 100,
          grandTotal: o.total_cents   / 100
        }
      });
    });
  });
});

