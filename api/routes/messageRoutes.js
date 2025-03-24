// all message related routes
/*
 * get messages
 * create message
 * edit message
 * delete message
 */

const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware");
const connection = require("../db");

/*  get messages
input:
- token
- group id

output:
- put every message in a json

how:
- check token
- query messages where group id
- update groupchat id last active
- return results
*/
router.get("/get-messages", authenticateToken, (req, res) => {
  let email = req.user.email;
  let groupchatID = req.query.groupchat_id;
  let currentTime = new Date();

  // Check if the user is a member of the group chat
  const checkMembershipQuery = `
      SELECT COUNT(*) AS is_member FROM Membership WHERE email = ? AND groupchat_id = ?;
    `;

  connection.query(
    checkMembershipQuery,
    [email, groupchatID],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (results[0].is_member === 0) {
        return res
          .status(403)
          .json({ error: "You are not a member of this group chat" });
      }

      // Update the user's last active timestamp
      const updateLastActiveQuery = `
        UPDATE Membership SET last_active = ? WHERE email = ? AND groupchat_id = ?;
      `;

      connection.query(updateLastActiveQuery, [
        currentTime,
        email,
        groupchatID,
      ]);

      // Fetch messages from the group chat
      const getMessagesQuery = `
        SELECT 
          m.message_id, 
          m.sender_email, 
          m.time_sent, 
          m.contents, 
          m.edited, 
          m.attachment_url,
          u.first_name,
          u.last_name
        FROM Message m
        JOIN User u ON m.sender_email = u.email
        WHERE m.groupchat_id = ?
        ORDER BY m.time_sent ASC;
      `;

      connection.query(getMessagesQuery, [groupchatID], (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        res.json({ messages: results });
      });
    }
  );
});

/*  create message:
input:
- token
- message contents
- group id

output:
- status indication
- message id

how:
- check email, password against users
- check email, groupchatid in membership table
- add record to messages
*/
router.post("/create-message", authenticateToken, (req, res) => {
  let email = req.user.email;
  let groupchatId = req.body.groupchat_id;
  let currentTime = new Date();
  let messageContents = req.body.message_contents;
  let attachmentUrl = req.body.attachment_url || null; // Allow NULL if not provided

  // Check if the user is a member of the group
  const checkMembershipQuery = `
        SELECT COUNT(*) AS is_member FROM Membership WHERE email = ? AND groupchat_id = ?;
      `;

  connection.query(
    checkMembershipQuery,
    [email, groupchatId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (results[0].is_member === 0) {
        return res
          .status(403)
          .json({ error: "You are not a member of this group chat" });
      }

      // Insert the new message into the Message table
      const createMessageQuery = `
          INSERT INTO Message (groupchat_id, sender_email, time_sent, contents, attachment_url)
          VALUES (?, ?, ?, ?, ?);
        `;

      connection.query(
        createMessageQuery,
        [groupchatId, email, currentTime, messageContents, attachmentUrl],
        (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }

          res.json({
            message: "Message sent successfully",
            message_id: results.insertId,
          });
        }
      );
    }
  );
});

/*  edit message:
input:
- token
- changes
- message id

output:
- confirmation / status

how:
- check token
- check message id sender id == email
- edit msg & is edited in message table
*/

router.put("/edit-message", authenticateToken, (req, res) => {
  let email = req.user.email;
  let messageId = req.body.message_id;
  let newMsg = req.body.new_message;

  // Query to check if the user is the sender
  const messageEditPermsQuery = `
      SELECT sender_email
      FROM Message
      WHERE message_id = ?;
  `;

  connection.query(messageEditPermsQuery, [messageId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // If no results, message does not exist
    if (results.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    const { sender_email } = results[0];

    // Only the sender can edit the message
    if (sender_email !== email) {
      return res
        .status(403)
        .json({ error: "You can only edit your own messages" });
    }

    // Proceed to update the message
    const updateMessageQuery = `UPDATE Message SET contents = ?, edited = 1 WHERE message_id = ?;`;

    connection.query(updateMessageQuery, [newMsg, messageId], (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: "Message updated successfully" });
    });
  });
});

/*  delete message:
input:
- token
- message id

output:
- status indication

how:
- check token
    - check message id sender id == email
    - or
    - check email membership level for messageId.groupchatId == admin/moderator/owner
- delete record from messages
*/

router.delete("/delete-message", authenticateToken, (req, res) => {
  let email = req.user.email;
  let messageId = req.body.message_id;

  // Insert into groupchat table
  const messageDeletePermsQuery = `
    SELECT 
        sender_email,
        (SELECT permission FROM Membership WHERE email = ? AND groupchat_id = Message.groupchat_id) AS permission
    FROM Message
    WHERE message_id = ?;
  `;

  connection.query(
    messageDeletePermsQuery,
    [email, messageId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // If no results, message does not exist
      if (results.length === 0) {
        return res.status(404).json({ error: "Message not found" });
      }

      const { sender_email, permission } = results[0];

      // Check if user is either the sender or has sufficient permissions (admin/moderator/owner)
      if (sender_email !== email && permission !== "admin") {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      // Proceed to delete the message
      const deleteMessageQuery = `DELETE FROM Message WHERE message_id = ?;`;

      connection.query(deleteMessageQuery, [messageId], (error) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({
          message: "Message deleted successfully",
        });
      });
    }
  );
});

module.exports = router;
