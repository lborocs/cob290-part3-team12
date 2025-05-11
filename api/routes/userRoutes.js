// all user related routes
/*
 * get all users with their membership status for a specific group chat
 * get single user details
 */

const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware");
const connection = require("../db");

/*  get users with group chat membership
input:
- token
- groupchat_id

output:
- array of all users with their membership status
*/
router.get("/get-users/:groupchat_id", authenticateToken, (req, res) => {
  const groupchatId = req.params.groupchat_id;

  const usersQuery = `
    SELECT 
      u.email,
      u.first_name,
      u.last_name,
      m.permission,
      CASE 
        WHEN m.groupchat_id IS NOT NULL THEN true
        ELSE false
      END as is_member
    FROM User u
    LEFT JOIN Membership m ON u.email = m.email AND m.groupchat_id = ?
    ORDER BY u.first_name, u.last_name;
  `;

  connection.query(usersQuery, [groupchatId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ users: results });
  });
});

/*  get single user details
input:
- token
- email

output:
- user details (first_name, last_name, email)
*/
router.get("/get-user/:email", authenticateToken, (req, res) => {
  const email = req.params.email;

  const userQuery = `
    SELECT first_name, last_name, email
    FROM User
    WHERE email = ?;
  `;

  connection.query(userQuery, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

module.exports = router;
