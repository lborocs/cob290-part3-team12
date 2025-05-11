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
          ORDER BY task.duedate DESC;`;
  connection.query(getUserTasksQuery, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User has no current tasks" });
    }
    res.json({ results });
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
router.get("/get-team-tasks/:teamId", authenticateToken, (req, res) => {
  const teamId = req.params.teamId;

  const getTeamTasksQuery = `SELECT 
          task.task_id, 
          task.description, 
          task.manhours,
          task.completed,
          task.due_date,
          task.user_id
           
          FROM Tasks task
          WHERE task.team_id = ?
          ORDER BY task.duedate DESC;`;
  connection.query(getTeamTasksQuery, [teamId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Team has no current tasks" });
    }
    res.json({ results });
  });
});

/*
Getting tasks for a user for a specific team
Input:
- Token
- User id
- Team id
Output:
- JSON of the users tasks for the team
*/
router.get("/get-user-tasks-for-team", authenticateToken, (req, res) => {
  let email = req.user.email;
  let teamId = req.body.team_id;

  const getUserTasksForTeamQuery = `SELECT 
          task.task_id, 
          task.description, 
          task.manhours,
          task.completed,
          task.duedate,
           
          FROM Tasks task
          WHERE task.user_id = ? AND task.team_id = ? 
          ORDER BY task.duedate DESC;`;
  connection.query(
    getUserTasksForTeamQuery,
    [email, teamId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User has no current tasks" });
      }
      res.json({ results });
    }
  );
});

/*
Update task completed status to completed - Needed if demonstrating live updates
Input:
- Token
- Task id
Output:
- Json message of successful update
*/
router.put("/task-complete", authenticateToken, (req, res) => {
  let taskId = req.body.task_id;

  const updateTaskCompletionQuery = `
        UPDATE Tasks
        SET completed = 1
        WHERE task_id = ?;
        `;
  connection.query(updateTaskCompletionQuery, [taskId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Task completion updated successfully" });
  });
});

module.exports = router;
