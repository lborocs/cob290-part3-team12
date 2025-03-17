require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to MySQL as ID", connection.threadId);
});

// sample API endpoint
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
