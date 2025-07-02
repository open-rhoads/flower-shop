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
// OR npx nodemon server.js... what is this... recommended???
// install with: npm install -g nodemon... idk if I can do that 
// ohhh does it just simplify the command.... try it next
// to stop: Ctrl + C