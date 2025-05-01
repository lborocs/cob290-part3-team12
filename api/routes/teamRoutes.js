const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware");
const connection = require("../db");

// TODO: Test Routes
// TODO: Check if email is user id
// TODO: Write check leader id as a function
// TODO: Limit who can create teams
// TODO: Check if user is admin to get all teams/create teams
// TODO: Improve edit team members
// GET ROUTES

router.get("/get-all-teams", authenticateToken, (req, res) => {
  // Check if user is admin
  // TODO
  let isAdmin = true; // Placeholder for admin check

  if (!isAdmin) {
    return res.status(403).json({ error: "You are not authorized to view all teams" });
  }

  // Query to get all teams and their members
  const getAllTeamsQuery = `
    SELECT t.team_id, t.description, t.team_leader, tm.user_id, tm.role
    FROM Team t
    JOIN Team_Members tm ON t.team_id = tm.team_id;
  `;

  connection.query(getAllTeamsQuery, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No teams found" });
    }

    res.json(results);
  });
});


router.get("/get-user-teams", authenticateToken, (req, res) => {
  let email = req.user.email;

  // Check if the user is a member of any teams
  const checkMembershipQuery = `
      SELECT t.team_id, t.description, t.team_leader, tm.role
      FROM Team t
      JOIN Team_Members tm ON t.team_id = tm.team_id
      WHERE tm.user_id = ?;
    `;

  connection.query(checkMembershipQuery, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No teams found for this user" });
    }

    res.json(results);
  });
});

/* get team leaders
input:
- token

output:
- all team leaders in a json

how:
- check token
- query team leaders
- return results
*/

router.get("/get-teamleaders", authenticateToken, (req, res) => {
  const teamLeaderQuery = `SELECT team_id, team_leader FROM Team ORDER BY team_id;`;

  connection.query(teamLeaderQuery, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});


// CREATE ROUTES
/* create team
input:
- token
- team name
- team description
- team leader id
- team members

*/
router.post("/create-team", authenticateToken, (req, res) => {
  const teamDescription = req.body.teamDescription; 
  const teamLeaderId = req.body.teamLeaderId;
  const teamMembers = [] = req.body.teamMembers;

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
      INSERT INTO Team_Members (team_id, user_id, role)
      VALUES (?, ?, ?);
    `;
    
    connection.query(addLeaderQuery, [teamId, teamLeaderId, 'leader'], (leaderError) => {
      if (leaderError) {
        return res.status(500).json({ error: leaderError.message });
      }
      
      // If we have additional team members to add
      if (teamMembers.length > 0) {
        // Prepare values for multiple inserts
        const memberValues = teamMembers.map(member => [teamId, member, 'member']);
        
        // Use bulk insert syntax for MySQL
        const addMembersQuery = `
          INSERT INTO Team_Members (team_id, user_id, role)
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


// INSERT ROUTES
/* edit team details
input:
- token
- team id
- changes

output:
- confirmation / status
*/

router.put("/edit-team-details", authenticateToken, (req, res) => {
  const teamId = req.body.teamId;
  const changes = req.body.changes;
  const userId = req.user.email;

  // Check if the user is the team leader
  const checkLeaderQuery = `
    SELECT team_leader
    FROM Team
    WHERE team_id = ?;
  `;

  connection.query(checkLeaderQuery, [teamId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0 || results[0].team_leader !== userId) {
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


router.put("/edit-team-members", authenticateToken, (req, res) => {
  const teamId = req.body.teamId;
  const newMembers = req.body.newMembers;
  const userId = req.user.email;

  // Check if the user is the team leader
  const checkLeaderQuery = `
    SELECT team_leader
    FROM Team
    WHERE team_id = ?;
  `;

  connection.query(checkLeaderQuery, [teamId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0 || results[0].team_leader !== userId) {
      return res.status(403).json({ error: "You are not authorised to edit this team" });
    }

    // Update team members
    const updateMembersQuery = `
      INSERT INTO Team_Members (team_id, user_id, role)
      VALUES (?, ?, ?);
    `;

    connection.query(updateMembersQuery, [teamId, newMembers], (memberError) => {
      if (memberError) {
        return res.status(500).json({ error: memberError.message });
      }

      res.json({ message: "Team members updated successfully" });
    });
  });
});

// DELETE ROUTES
/* delete team
input:
- token
- team id
- user id

output:
- confirmation / status

how:
- check token
- check if user is team leader
- delete team from team table
- delete team from team members table
*/

router.delete("/delete-team", authenticateToken, (req, res) => {
  const teamId= req.body.teamId;
  const userId = req.user.email;

  // Check if the user is the team leader
  const checkLeaderQuery = `
    SELECT team_leader
    FROM Team
    WHERE team_id = ?;
  `;

  connection.query(checkLeaderQuery, [teamId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0 || results[0].team_leader !== userId) {
      return res.status(403).json({ error: "You are not authorised to delete this team" });
    }

    // Delete the team from the Team table
    const deleteTeamQuery = `DELETE FROM Team WHERE team_id = ?;`;

    connection.query(deleteTeamQuery, [teamId], (deleteError) => {
      if (deleteError) {
        return res.status(500).json({ error: deleteError.message });
      }

      // Delete the team from the Team_Members table
      const deleteMembersQuery = `DELETE FROM Team_Members WHERE team_id = ?;`;

      connection.query(deleteMembersQuery, [teamId], (memberDeleteError) => {
        if (memberDeleteError) {
          return res.status(500).json({ error: memberDeleteError.message });
        }

        res.json({ message: "Team deleted successfully" });
      });
    });
  });
});


router.delete("/delete-team-member", authenticateToken, (req, res) => {
  const teamId = req.body.teamId;
  const userToRemoveId = req.body.userToRemoveId;
  const currentUserId = req.user.email;

  // Check if the current user is the team leader
  const checkLeaderQuery = `
    SELECT team_leader
    FROM Team
    WHERE team_id = ?;
  `;

  connection.query(checkLeaderQuery, [teamId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0 || results[0].team_leader !== currentUserId) {
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


module.exports = router;