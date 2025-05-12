import React, { useState, useEffect } from "react";
import Header from "./header";
import "./dashboard.css";
import TaskDistributionChart from "./taskDistributionChart";
import TaskDurationPieChart from "./taskDurationChart";
import API_URL from "../config";

const Dashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamDescription, setSelectedTeamDescription] = useState("");
  const [data, setData] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    const fetchTeams = async () => {
      const jwt = localStorage.getItem("token");

      if (jwt) {
        try {
          const response = await fetch(`${API_URL}/api/get-user-teams`, {
            headers: {
              Authorization: jwt,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setTeams(data);
            if (data.length > 0) {
              setSelectedTeam(data[0].team_id);
              setSelectedTeamDescription(data[0].description);
            }
          }
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      }
    };

    fetchTeams();
  }, []);

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);
    const selectedTeamData = teams.find((team) => team.team_id === teamId);
    setSelectedTeamDescription(
      selectedTeamData ? selectedTeamData.description : ""
    );
  };


  useEffect(() => {
    const fetchTaskData = async () => {
      if (!selectedTeam) return;
      const jwt = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${API_URL}api/get-team-tasks/${selectedTeam}`,
          {
            headers: {
              Authorization: jwt,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(result);
          const taskTypes = {};
          result.results.forEach((task) => {
            if (!taskTypes[task.description]) {
              taskTypes[task.description] = 0;
            }
            taskTypes[task.description] += task.manhours;
          });

          const chartData = Object.entries(taskTypes).map(([name, value]) => ({
            name,
            number: value,
          }));

          setData(chartData);
        }
      } catch (error) {
        console.error("Error fetching task duration data:", error);
      }
    };
    fetchTaskData();
      }, [selectedTeam]);

      useEffect(() => {
        let completed = 0;
        let pending = 0;
      
        data.forEach((task) => {
          if (task.completed === 1) {
            completed += 1;
          } else {
            pending += 1;
          }
        });
      
        setCompletedTasks(completed);
        setPendingTasks(pending);
      }, [data]);


  return (
    <div className="dashboard-container">
      <Header />

      {/* Analytics Section */}
      <div className="dashboard-analytics">
        <div className="dashboard-analytics-section">
        {selectedTeam && <TaskDistributionChart chartData={data} />}
        </div>

        <div className="dashboard-analytics-section">
          <h1 className="dashboard-title">Team Analytics</h1>
          <select
            className="team-select"
            value={selectedTeam || ""}
            onChange={handleTeamChange}
          >
            {teams.map((team) => (
              <option key={team.team_id} value={team.team_id}>
                {team.description}
              </option>
            ))}
          </select>
          <p className="dashboard-link-text">
            <a href="#" className="dashboard-link">
              View data
            </a>{" "}
            metrics for selected team
          </p>
          <div className="dashboard-metrics">
            <div className="dashboard-card">
              <p className="dashboard-card-title">Completed Tasks</p>
              <h2 className="dashboard-card-value">{completedTasks}</h2>
              <p className="dashboard-card-trend positive">+5%</p>
            </div>
            <div className="dashboard-card">
              <p className="dashboard-card-title">Pending Tasks</p>
              <h2 className="dashboard-card-value">{pendingTasks}</h2>
              <p className="dashboard-card-trend negative">-10%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Leader Section */}
      <div className="dashboard-leader">
        <div className="dashboard-leader-avatar"></div>
        <div>
          <h2 className="dashboard-leader-name">Team Leader</h2>
          <span className="dashboard-leader-tag">
            {selectedTeamDescription}
          </span>
          <p className="dashboard-leader-text">Lead your team to success</p>
        </div>
      </div>

      {/* Pie Chart Section */}
      <TaskDurationPieChart
        teamId={selectedTeam}
        teamName={selectedTeamDescription}
      />
    </div>
  );
};

export default Dashboard;
