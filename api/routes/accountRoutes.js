// all account related routes
// login & new account

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../db");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const query = "SELECT * FROM User WHERE email = ?";
  connection.query(query, [email], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.hashed_password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  });
});

// Registration endpoint
router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO User (email, hashed_password, first_name, last_name) VALUES (?, ?, ?, ?)";

    connection.query(
      query,
      [email, hashedPassword, first_name, last_name],
      (error, results) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already registered" });
          }
          return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
