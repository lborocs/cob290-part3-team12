const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware");
const connection = require("../db");

/* get teams
input:
- token
- user id

output:
- all teams the user is a member of in a json

how:
- check token
- query teams where user id is a member or leader
- return results
*/

// TODO: Need to update schema to include members in team table
// TODO: Test Routes

router.get("/get-teams", authenticateToken, (req, res) => {
  let email = req.user.email;

  // Check if the user is a member of any teams
  const checkMembershipQuery = `
      SELECT t.team_id, t.description, t.team_leader
      FROM Team t;
    `;

  connection.query(checkMembershipQuery, (error, results) => {
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
  const teamLeaderQuery = `SELECT (team.teamid, team.team_leader) FROM team ORDER BY teamId`;

  connection.query(teamLeaderQuery, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

module.exports = router;
