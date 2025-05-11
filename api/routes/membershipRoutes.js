// all membership related routes
/*
 * create membership
 * edit membership
 * delete membership
 */

const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware");
const connection = require("../db");

/*  create membership
input:
- token
- recipient email
- group id

output:
- status indication

how:
- check token email membership level
- check recipient, groupchatId not in memberships
- check admin_only_add from groupchat table
- check permission from membership table
- add record to membership table
*/
router.post("/create-membership", authenticateToken, (req, res) => {
  let email = req.user.email;
  let recipientEmail = req.body.recipient_email;
  let groupchatId = req.body.groupchat_id;
  let currentTime = new Date();

  // Check membership, recipient existence, and group settings in a single query
  const checkQuery = `
        SELECT 
            m.permission AS user_permission, 
            g.admin_only_add,
            (SELECT COUNT(*) FROM Membership WHERE email = ? AND groupchat_id = ?) AS recipient_exists
        FROM Membership m
        JOIN Groupchat g ON g.groupchat_id = ?
        WHERE m.email = ? AND m.groupchat_id = ?;
    `;

  connection.query(
    checkQuery,
    [recipientEmail, groupchatId, groupchatId, email, groupchatId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "Group not found or requester not a member." });
      }

      const { user_permission, admin_only_add, recipient_exists } = results[0];

      if (recipient_exists > 0) {
        return res
          .status(400)
          .json({ error: "Recipient is already a member." });
      }
      if (admin_only_add && user_permission !== "admin") {
        return res.status(403).json({ error: "Insufficient permissions." });
      }

      // Add recipient to membership table
      const addMembershipQuery = `INSERT INTO Membership (email, groupchat_id, permission, last_active) VALUES (?, ?, 'member', ?)`;
      connection.query(
        addMembershipQuery,
        [recipientEmail, groupchatId, currentTime],
        (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({ message: "Membership created successfully." });
        }
      );
    }
  );
});

/*  edit membership level
input:
- token
- recipient id
- group id
- new level

output:
- status indication

how:
- check recipient email & groupchat it in memeberships
- check permission from membership table
- edit record in membership table
*/

router.put("/edit-membership-level", authenticateToken, (req, res) => {
  let email = req.user.email;
  let recipientEmail = req.body.recipient_email;
  let groupchatId = req.body.groupchat_id;
  let newLevel = req.body.new_level;

  // Check membership, recipient existence, and group settings in a single query
  const checkQuery = `
          SELECT 
              m.permission AS user_permission, 
              (SELECT COUNT(*) FROM Membership WHERE email = ? AND groupchat_id = ?) AS recipient_exists
          FROM Membership m
          WHERE email = ? AND groupchat_id = ?;
      `;

  connection.query(
    checkQuery,
    [recipientEmail, groupchatId, email, groupchatId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "Group not found or requester not a member." });
      }

      const { user_permission, recipient_exists } = results[0];

      if (recipient_exists == 0) {
        return res
          .status(400)
          .json({ error: "Recipient is not in the group." });
      }
      if (user_permission !== "admin") {
        return res.status(403).json({ error: "Insufficient permissions." });
      }

      // Add recipient to membership table
      const editMembershipQuery = `UPDATE Membership SET permission = ? WHERE email = ? AND groupchat_id = ?`;
      connection.query(
        editMembershipQuery,
        [newLevel, recipientEmail, groupchatId],
        (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({ message: "Membership updated successfully." });
        }
      );
    }
  );
});

/*  delete membership
input:
- token
- recipient id
- group id

output:
- status indication

how:
- check email, password against users
- check permission from membership table or if recipient email = email
- delete record from membership table
*/

router.delete("/delete-membership", authenticateToken, (req, res) => {
  let email = req.user.email;
  let recipientEmail = req.body.recipient_email;
  let groupchatId = req.body.groupchat_id;

  // Check membership, recipient existence, and group settings in a single query
  const checkQuery = `
            SELECT 
                m.permission AS user_permission, 
                (SELECT COUNT(*) FROM Membership WHERE email = ? AND groupchat_id = ?) AS recipient_exists
            FROM Membership m
            WHERE email = ? AND groupchat_id = ?;
        `;

  connection.query(
    checkQuery,
    [recipientEmail, groupchatId, email, groupchatId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "Group not found or requester not a member." });
      }

      const { user_permission, recipient_exists } = results[0];

      if (recipient_exists == 0) {
        return res
          .status(400)
          .json({ error: "Recipient is not in the group." });
      }
      if (user_permission !== "admin" && recipientEmail !== email) {
        return res.status(403).json({ error: "Insufficient permissions." });
      }

      // Add recipient to membership table
      const deleteMembershipQuery = `DELETE FROM Membership WHERE email = ? AND groupchat_id = ?;`;
      connection.query(
        deleteMembershipQuery,
        [recipientEmail, groupchatId],
        (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({ message: "Membership deleted successfully." });
        }
      );
    }
  );
});

module.exports = router;
