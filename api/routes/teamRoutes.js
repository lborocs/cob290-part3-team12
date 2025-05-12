const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware");
const connection = require("../db");


// UTILITY FUNCTIONS
// Returns a boolean of whether the user is an admin
function isUserAdmin(email, callback) {
  const query = `SELECT admin FROM User WHERE email = ?`;
  connection.query(query, [email], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    if (results.length === 0) {
      return callback(null, false);
    }
    if (results[0].admin == 1) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  });
}


// Returns the team leader if of a given team id
// Returns an error if the team does not exist
function getTeamLeader(teamId, callback) {
  const query = `SELECT team_leader FROM Team WHERE team_id = ?`;
  connection.query(query, [teamId], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    if (results.length === 0) {
      return callback(new Error("Team not found"), null);
    }
    callback(null, results[0].team_leader);
  });
}


// GET ROUTES

// Get all teams and their members
// Returns the team id, description, team leader
// Only accessible by admins
router.get("/get-all-teams", authenticateToken, (req, res) => {
  // If user is not an admin do not allow access to this route
  isUserAdmin(req.user.email, (error, isAdmin) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!isAdmin) {
      return res.status(403).json({ error: "You are not authorised to view all teams" });
    }

    // Query to get all teams and their members
    const getAllTeamsQuery = `
      SELECT t.team_id, t.description, t.team_leader, tm.user_id
      FROM Team t
      JOIN Team_Members tm ON t.team_id = tm.team_id;
    `;

    connection.query(getAllTeamsQuery, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (results.length === 0) {
        return res.sendStatus(204);
      }

      res.json(results);
    });
  });
});


// Gets all teams that the user is a member of
// Returns the team id, description, team leader
router.get("/get-user-teams", authenticateToken, (req, res) => {
  let email = req.user.email;

  // Check if the user is a member of any teams
  const checkMembershipQuery = `
      SELECT t.team_id, t.description, t.team_leader
      FROM Team t
      JOIN Team_Members tm ON t.team_id = tm.team_id
      WHERE tm.user_id = ?;
    `;

  connection.query(checkMembershipQuery, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      return res.sendStatus(204);
    }

    res.json(results);
  });
});


// Get all team leaders
// Returns a list of all team ids and their corresponding leaders
router.get("/get-teamleaders", authenticateToken, (req, res) => {
  const teamLeaderQuery = `SELECT team_id, team_leader FROM Team ORDER BY team_id;`;

  connection.query(teamLeaderQuery, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      return res.sendStatus(204);
    }

    res.json(results);
  });
});


// Create a team
// Input: team description, team leader id, team members (array of user ids)
// Team id is generated automatically
// Sends confirmation to the user
// Only accessible by admins
router.post("/create-team", authenticateToken, (req, res) => {
  const teamDescription = req.body.teamDescription;
  const teamLeaderId = req.body.teamLeaderId;
  const teamMembers = req.body.teamMembers;

  // If user is not an admin do not allow access to this route
  isUserAdmin(req.user.email, (error, isAdmin) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!isAdmin) {
      return res.status(403).json({ error: "You are not authorised to create a team" });
    }

    const createTeamQuery = `
    INSERT INTO Team (description, team_leader)
    VALUES (?, ?);
    `;

    connection.query(createTeamQuery, [teamDescription, teamLeaderId], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const teamId = results.insertId; // Get the ID of the newly created team

      // Add the team leader as a member first
      const addLeaderQuery = `
      INSERT INTO Team_Members (team_id, user_id)
      VALUES (?, ?);
    `;

      connection.query(addLeaderQuery, [teamId, teamLeaderId], (leaderError) => {
        if (leaderError) {
          return res.status(500).json({ error: leaderError.message });
        }

        // If we have additional team members to add
        if (teamMembers.length > 0) {
          // Prepare values for multiple inserts
          const memberValues = teamMembers.map(member => [teamId, member]);

          // Use bulk insert syntax for MySQL
          const addMembersQuery = `
          INSERT INTO Team_Members (team_id, user_id)
          VALUES ?;
        `;

          connection.query(addMembersQuery, [memberValues], (memberError) => {
            if (memberError) {
              return res.status(500).json({ error: memberError.message });
            }

            res.status(201).json({ message: "Team and members created successfully", teamId: teamId });
          });
        } else {
          // No additional members, just return success
          res.status(201).json({ message: "Team created successfully", teamId: teamId });
        }
      });
    });
  });
});


// INSERT ROUTES

// Edit the team description and or team leader
// User must be the team leader or an admin
// Returns a confirmation message
router.put("/edit-team-details", authenticateToken, (req, res) => {
  const teamId = req.body.teamId;
  const changes = req.body.changes;
  const userId = req.user.email;

  isUserAdmin(req.user.email, (error, isAdmin) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    getTeamLeader(teamId, (error, teamLeaderId) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const isTeamLeader = teamLeaderId === userId;

      if (!isTeamLeader && !isAdmin) {
        return res.status(403).json({ error: "You are not authorised to edit this team" });
      }

      const updateDetailsQuery = `
        UPDATE Team
        SET description = ?, team_leader = ?
        WHERE team_id = ?;
      `;

      connection.query(updateDetailsQuery, [changes.description, changes.team_leader, teamId], (updateError) => {
        if (updateError) {
          return res.status(500).json({ error: updateError.message });
        }

        res.json({ message: "Team details updated successfully" });
      });
    });
  });
});


// Edits the members of a given team id
// Removes all members and adds the new ones
// User must be the team leader
router.put("/edit-team-members", authenticateToken, (req, res) => {
  const teamId = req.body.teamId;
  const newMembers = req.body.newMembers;
  const userId = req.user.email;

  isUserAdmin(req.user.email, (error, isAdmin) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    getTeamLeader(teamId, (error, teamLeaderId) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const isTeamLeader = teamLeaderId === userId;

      if (!isTeamLeader && !isAdmin) {
        return res.status(403).json({ error: "You are not authorised to edit this team" });
      }

      // Clear all exisiting members except the team leader
      const deleteQuery = `
        DELETE FROM Team_Members WHERE team_id = ? AND user_id != ?;
      `;

      connection.query(deleteQuery, [teamId, userId], (deleteErr) => {
        if (deleteErr) return res.status(500).json({ error: deleteErr.message });

        // Create rows of new team members
        const values = newMembers
          .filter(memberId => memberId !== userId) // Filter out the team leader
          .map(memberId => [teamId, memberId]);

        if (values.length === 0) {
          return res.json({ message: "Team members reset" }); // Nothing to insert
        }

        const insertQuery = `
          INSERT INTO Team_Members (team_id, user_id)
          VALUES ?
        `;

        connection.query(insertQuery, [values], (insertErr) => {
          if (insertErr) return res.status(500).json({ error: insertErr.message });

          res.json({ message: "Team members updated successfully" });
        });
      });
    });
  });
});


// DELETE ROUTES

// Delete a team and all its members
// User must be the team leader or an admin
// Returns a confirmation message
router.delete("/delete-team", authenticateToken, (req, res) => {
  const teamId = req.body.teamId;
  const userId = req.user.email;

  isUserAdmin(req.user.email, (error, isAdmin) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Check if the user is the team leader
    getTeamLeader(teamId, (error, teamLeaderId) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const isTeamLeader = teamLeaderId === userId;

      if (!isTeamLeader && !isAdmin) {
        return res.status(403).json({ error: "You are not authorised to delete this team" });
      }

      // Delete the team from the Team_Members table
      const deleteMembersQuery = `DELETE FROM Team_Members WHERE team_id = ?;`;

      connection.query(deleteMembersQuery, [teamId], (memberDeleteError) => {
        if (memberDeleteError) {
          return res.status(500).json({ error: memberDeleteError.message });
        }

      // Delete the team from the Team table
      const deleteTeamQuery = `DELETE FROM Team WHERE team_id = ?;`;

      connection.query(deleteTeamQuery, [teamId], (deleteError) => {
        if (deleteError) {
          return res.status(500).json({ error: deleteError.message });
        }

          res.json({ message: "Team deleted successfully" });
        });
      });
    });
  });
});


// Delete a team member from a team
// User must be the team leader or an admin
// Returns a confirmation message
router.delete("/delete-team-member", authenticateToken, (req, res) => {
  const teamId = req.body.teamId;
  const userToRemoveId = req.body.userToRemoveId;
  const currentUserId = req.user.email;
  
  isUserAdmin(req.user.email, (error, isAdmin) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Check if the user is the team leader
    getTeamLeader(teamId, (error, teamLeaderId) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const isTeamLeader = teamLeaderId === currentUserId;

      if (!isTeamLeader && !isAdmin) {
        return res.status(403).json({ error: "You are not authorised to delete this team member" });
      }

      // Delete the team member from the Team_Members table
      const deleteMemberQuery = `DELETE FROM Team_Members WHERE team_id = ? AND user_id = ?;`;

      connection.query(deleteMemberQuery, [teamId, userToRemoveId], (deleteError) => {
        if (deleteError) {
          return res.status(500).json({ error: deleteError.message });
        }

        res.json({ message: "Team member deleted successfully" });
      });
    });
  });
});


module.exports = router;