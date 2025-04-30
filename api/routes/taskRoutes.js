const express = require("express");
const router = express.Router();
const authenticateToken = require("../authMiddleware");
const connection = require("../db");

/*
Get individual user tasks
Input:
- Token
- User id
Output:
- JSON of all of the specified users' tasks
*/
router.get("/get-user-tasks", authenticateToken, (req, res) => {
    let email = req.user.email;

  
        const getUserTasksQuery = `SELECT 
          task.task_id, 
          task.description, 
          task.manhours,
          task.completed,
          task.duedate,
          task.team_id
           
          FROM Tasks task
          WHERE task.user_id = ?
          ORDER BY task.duedate DESC;`
        ;
  
        connection.query(getUserTasksQuery, [email], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User has no current tasks" });
        }
        res.json({results});
    });
});

/*
Get all tasks for a team
Input:
- Token
- Team id
Output:
- JSON of all of the tasks for the team
*/
router.get("/get-team-tasks", authenticateToken, (req, res) => {
    let teamId = req.body.team_id;

        const getTeamTasksQuery = `SELECT 
          task.task_id, 
          task.description, 
          task.manhours,
          task.completed,
          task.duedate,
          task.user_id
           
          FROM Tasks task
          WHERE task.team_id = ?
          ORDER BY task.duedate DESC;`
        ;
  
        connection.query(getTeamTasksQuery, [teamId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Team has no current tasks" });
          }
        res.json({results});
    });
});
  
module.exports = router;


  