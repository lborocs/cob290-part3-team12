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
  const email = req.user.email;
  const {
    groupchat_name,
    description = "",
    admin_only_add = 0,
    icon_url = null,
  } = req.body;
  const currentTime = new Date();

  const createGroupchatQuery = `
    INSERT INTO Groupchat (name, description, admin_only_add, icon_url)
    VALUES (?, ?, ?, ?);
  `;

  connection.query(
    createGroupchatQuery,
    [groupchat_name, description, admin_only_add, icon_url],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });

      const groupchatId = results.insertId;
      const addMembershipQuery = `
        INSERT INTO Membership (email, groupchat_id, permission, last_active)
        VALUES (?, ?, 'admin', ?);
      `;

      connection.query(
        addMembershipQuery,
        [email, groupchatId, currentTime],
        (error) => {
          if (error) return res.status(500).json({ error: error.message });
          res.json({
            message: "Groupchat created successfully",
            groupchat_id: groupchatId,
          });
        }
      );
    }
  );
});

router.put("/edit-groupchat", authenticateToken, (req, res) => {
  const email = req.user.email;
  const { groupchat_id, name, description, admin_only_add, icon_url } =
    req.body;

  // Check permission
  const checkPermissionQuery = `
    SELECT permission FROM Membership WHERE email = ? AND groupchat_id = ?;
  `;

  connection.query(
    checkPermissionQuery,
    [email, groupchat_id],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      if (results.length === 0 || results[0].permission !== "admin") {
        return res.status(401).json({ error: "Invalid membership" });
      }

      // Prepare dynamic updates
      let updates = [];
      let values = [];

      if (name) {
        updates.push("name = ?");
        values.push(name);
      }
      if (description) {
        updates.push("description = ?");
        values.push(description);
      }
      if (admin_only_add !== undefined) {
        updates.push("admin_only_add = ?");
        values.push(admin_only_add);
      }
      if (icon_url) {
        updates.push("icon_url = ?");
        values.push(icon_url);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update." });
      }

      const updateQuery = `
      UPDATE Groupchat SET ${updates.join(", ")} WHERE groupchat_id = ?;
    `;
      values.push(groupchat_id);

      connection.query(updateQuery, values, (error) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: "Groupchat updated successfully" });
      });
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
