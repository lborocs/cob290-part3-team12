// file to configure and setup the connection with the db

const mysql = require("mysql2");
require("dotenv").config();

console.log(
  process.env.DB_HOST,
  " <- if this is undefined make sure you run 'node server.js' from inside the api directory"
);

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to MySQL as ID", connection.threadId);
});

module.exports = connection;
