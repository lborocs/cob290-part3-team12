
require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
//get the connection from the db config file
const connection = require("./db");

// Import Middleware
const authenticateToken = require("./authMiddleware");
app.use(express.json());

// Import Routes
const routes = require("./routes/index");
app.use("/", routes);

// Example of a protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => {
  res.send("API is working");
});

// Start the server
app
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
  });
