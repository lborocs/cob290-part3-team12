// all groupchat related routes
/*
 * get groupchats
 * create groupchat
 * edit groupchat name
 * edit groupchat desc
 * edit groupchat add level
 * edit groupchat icon
 * delete groupchat
 */

const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware");
const connection = require("../db");

/*  get groupchats
input:
- token

output:
- group id
- permission
- last active
- name
- desc
- icon_url

how:
- get membership table joined on groupchats table
- get No. messages with groupchat id where sent > last_active as unreads
*/
router.get("/get-groupchats", authenticateToken, (req, res) => {
  let email = req.user.email;
  const groupchatsQuery = `
    WITH UserMembership AS (
        SELECT groupchat_id, permission, last_active
        FROM Membership
        WHERE email = ?
    )
    SELECT
        g.groupchat_id,
        g.name,
        g.description,
        g.icon_url,
        m.permission,
        m.last_active,
        COALESCE(um.unread_count, 0) AS unread_messages_count
    FROM UserMembership m
    JOIN Groupchat g
        ON g.groupchat_id = m.groupchat_id
    LEFT JOIN (
        SELECT 
            groupchat_id, 
            COUNT(message_id) AS unread_count
        FROM Message
        WHERE time_sent > (
            SELECT last_active FROM Membership WHERE email = ? AND groupchat_id = Message.groupchat_id
        )
        GROUP BY groupchat_id
    ) AS um
    ON m.groupchat_id = um.groupchat_id
    ORDER BY m.last_active DESC;
`;

  connection.query(groupchatsQuery, [email, email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ groupchats: results });
  });
});

/*  create groupchat
input:
- token
- name
- admin_only_add

output:
- status
- groupchat id

how:
- make new record in groupchats & membership table
*/
router.post("/create-groupchat", authenticateToken, (req, res) => {
  let email = req.user.email;
  let groupchatName = req.body.groupchat_name;
  let admin_only_add = req.body.admin_only_add || 0;
  let currentTime = new Date();

  // Insert into groupchat table
  const createGroupchatQuery = `
    INSERT INTO Groupchat (name, admin_only_add)
    VALUES (?, ?);
  `;

  connection.query(
    createGroupchatQuery,
    [groupchatName, admin_only_add],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      let groupchatId = results.insertId; // Get the generated groupchat_id

      // Insert into membership table
      const addMembershipQuery = `
            INSERT INTO Membership (email, groupchat_id, permission, last_active)
            VALUES (?, ?, 'admin', ?);
        `;

      connection.query(
        addMembershipQuery,
        [email, groupchatId, currentTime],
        (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }

          res.json({
            message: "Groupchat created successfully",
            groupchat_id: groupchatId,
          });
        }
      );
    }
  );
});

/*  edit groupchat name
input:
- token
- changes
- groupchat id

output:
- status indication

how:
- check permission from membership table
- edit membership table
*/

router.put("/edit-groupchat-name", authenticateToken, (req, res) => {
  let email = req.user.email;
  let groupchatId = req.body.groupchat_id;
  let newName = req.body.new_name;

  // Insert into groupchat table
  const membershipLevelQuery = `
    SELECT permission
    FROM Membership
    WHERE email = ? AND groupchat_id = ?;
  `;

  connection.query(
    membershipLevelQuery,
    [email, groupchatId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      //check that theres results and that the user is an admin of the gc
      if (results.length === 0 || results[0].permission !== "admin") {
        return res.status(401).json({ error: "Invalid membership" });
      }

      // Insert into membership table
      const editGroupchatNameQuery = `
            UPDATE groupchat SET name = ? WHERE groupchatid = ?;
        `;

      connection.query(
        editGroupchatNameQuery,
        [newName, groupchatId],
        (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({
            message: "Groupchat edited successfully",
          });
        }
      );
    }
  );
});

/*  edit groupchat desc
input:
- token
- changes
- groupchat id

output:
- status indication

how:
- check permission from membership table
- edit membership table
*/

router.put("/edit-groupchat-desc", authenticateToken, (req, res) => {
  let email = req.user.email;
  let groupchatId = req.body.groupchat_id;
  let newDesc = req.body.new_desc;

  // Insert into groupchat table
  const membershipLevelQuery = `
    SELECT permission
    FROM Membership
    WHERE email = ? AND groupchat_id = ?;
  `;

  connection.query(
    membershipLevelQuery,
    [email, groupchatId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      //check that theres results and that the user is an admin of the gc
      if (results.length === 0 || results[0].permission !== "admin") {
        return res.status(401).json({ error: "Invalid membership" });
      }

      // Insert into membership table
      const editGroupchatDescQuery = `
            UPDATE groupchat SET description = ? WHERE groupchatid = ?;
        `;

      connection.query(
        editGroupchatDescQuery,
        [newDesc, groupchatId],
        (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({
            message: "Groupchat edited successfully",
          });
        }
      );
    }
  );
});

/*  edit groupchat add level
input:
- token
- changes
- groupchat id

output:
- status indication

how:
- check permission from membership table
- edit membership table
*/

router.put("/edit-groupchat-add-level", authenticateToken, (req, res) => {
  let email = req.user.email;
  let groupchatId = req.body.groupchat_id;
  let addLevel = req.body.add_level;

  // Insert into groupchat table
  const membershipLevelQuery = `
    SELECT permission
    FROM Membership
    WHERE email = ? AND groupchat_id = ?;
  `;

  connection.query(
    membershipLevelQuery,
    [email, groupchatId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      //check that theres results and that the user is an admin of the gc
      if (results.length === 0 || results[0].permission !== "admin") {
        return res.status(401).json({ error: "Invalid membership" });
      }

      // Insert into membership table
      const editGroupchatAddLevelQuery = `
            UPDATE groupchat SET admin_only_add = ? WHERE groupchatid = ?;
        `;

      connection.query(
        editGroupchatAddLevelQuery,
        [addLevel, groupchatId],
        (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({
            message: "Groupchat edited successfully",
          });
        }
      );
    }
  );
});

/*  edit groupchat icon
input:
- token
- new icon
- groupchat id

output:
- status indication

how:
- check permission from membership table
- edit membership table
*/

router.put("/edit-groupchat-icon", authenticateToken, (req, res) => {
  let email = req.user.email;
  let groupchatId = req.body.groupchat_id;
  let iconUrl = req.body.icon_url;

  // Insert into groupchat table
  const membershipLevelQuery = `
    SELECT permission
    FROM Membership
    WHERE email = ? AND groupchat_id = ?;
  `;

  connection.query(
    membershipLevelQuery,
    [email, groupchatId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      //check that theres results and that the user is an admin of the gc
      if (results.length === 0 || results[0].permission !== "admin") {
        return res.status(401).json({ error: "Invalid membership" });
      }

      // Insert into membership table
      const editGroupchatIconQuery = `
            UPDATE groupchat SET icon_url = ? WHERE groupchatid = ?;
        `;

      connection.query(
        editGroupchatIconQuery,
        [iconUrl, groupchatId],
        (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({
            message: "Groupchat edited successfully",
          });
        }
      );
    }
  );
});

/*  delete groupchat
input:
- token
- groupchat id

output:
- status indication

how:
- check permission from membership table
- delete records from groupchat, on delete cascade it
*/

router.delete(
  "/delete-groupchat/:groupchat_id",
  authenticateToken,
  (req, res) => {
    let email = req.user.email;
    let groupchatId = req.params.groupchat_id;

    // Insert into groupchat table
    const membershipLevelQuery = `
    SELECT permission
    FROM Membership
    WHERE email = ? AND groupchat_id = ?;
  `;

    connection.query(
      membershipLevelQuery,
      [email, groupchatId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        //check that theres results and that the user is an admin of the gc
        if (results.length === 0 || results[0].permission !== "admin") {
          return res.status(401).json({ error: "Invalid membership" });
        }

        // Insert into membership table
        const deleteGroupchatQuery = `
            DELETE FROM Groupchat WHERE groupchat_id = ?;
        `;

        connection.query(deleteGroupchatQuery, [groupchatId], (error) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.json({
            message: "Groupchat deleted successfully",
          });
        });
      }
    );
  }
);

module.exports = router;
