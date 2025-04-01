//file that allows server.js to import all files in routes rather than importing each individually

const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router();

// Automatically import all route files in the `routes` folder
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== "index.js" && file.endsWith("Routes.js")) {
    console.log(`Importing route: ${file}`);  // Log the imported file name for debugging
    const route = require(path.join(__dirname, file));
    router.use(route);
  }
});


module.exports = router;
