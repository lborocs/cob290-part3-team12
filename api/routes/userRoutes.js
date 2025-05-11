// all user related routes
/*
 * get all users with their membership status for a specific group chat
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

module.exports = router;
