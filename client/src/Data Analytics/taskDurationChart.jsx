import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./taskDurationChart.css";
import API_URL from "../config";

const COLORS = ["#0ea5e9", "#e879f9", "#a3e635"];

const TaskDurationPieChart = ({ teamId }) => {
  const [data, setData] = useState([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const fetchTaskData = async () => {
      if (!teamId) return;

      const jwt = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${API_URL}/api/get-team-tasks/${teamId}`,
          {
            headers: {
              Authorization: jwt,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          // Process the tasks data for the pie chart
          const taskTypes = {};
          result.results.forEach((task) => {
            if (!taskTypes[task.description]) {
              taskTypes[task.description] = 0;
            }
            taskTypes[task.description] += task.manhours;
          });

          const chartData = Object.entries(taskTypes).map(([name, value]) => ({
            name,
            value,
          }));

          setData(chartData);
          // Get team name from the first task's team_id
          if (result.results.length > 0) {
            setTeamName(`Team ${result.results[0].team_id}`);
          }
        }
      } catch (error) {
        console.error("Error fetching task duration data:", error);
      }
    };

    fetchTaskData();
  }, [teamId]);

  if (!teamId) {
    return (
      <div className="task-duration-container">
        <h2 className="task-duration-title">
          Select a team to view task duration data
        </h2>
      </div>
    );
  }

  return (
    <div className="task-duration-container">
      <h2 className="task-duration-title">{teamName} Task Expected Duration</h2>

      <div className="task-duration-chart-container">
        <p className="task-duration-subtitle">Man-Hours for Each Task</p>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskDurationPieChart;
