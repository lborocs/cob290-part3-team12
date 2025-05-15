import React, { useState, useEffect} from 'react';
import Header from '../Data Analytics/header';
import './dashboard.css';
import TaskDistributionChart from "../Data Analytics/taskDistributionChart";
import TasksPieChart from "./TasksPieChart";
import API_URL from "../config";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // Example team member data
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamDescription, setSelectedTeamDescription] = useState("");
  const [data, setData] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const navigate = useNavigate();
  

  const teamMembers = [
    { name: "Alice Smith", hoursCompleted: 25, totalHours: 40 },
    { name: "Bob Johnson", hoursCompleted: 18, totalHours: 30 },
    { name: "Clara Lee", hoursCompleted: 35, totalHours: 50 }
  ];

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
            console.log(data);  
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

  useEffect(() => {
    const fetchTaskData = async () => {
      if (!selectedTeam) return;
      const jwt = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${API_URL}/api/get-team-tasks/${selectedTeam}`,
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

  // Example overdue tasks data
  const overdueTasks = [
    { title: "Update Database", link: "/tasks/update-database" },
    { title: "Client Meeting Prep", link: "/tasks/client-meeting" }
  ];

  useEffect(() => {
    let completed = 0;
    let pending = 0;

    data.forEach((task) => {
      if (task.completed === 1) {
        completed += 1;
      } else {
        pending += 1;
        overdueTasks.push({
          title: task.name,
          link: `/tasks/${task.name.replace(/\s+/g, '-').toLowerCase()}`
        });
      }
    });

    setCompletedTasks(completed);
    setPendingTasks(pending);
  }, [data]);

  // State for selected performance option
  const [selectedPerformance, setSelectedPerformance] = useState(null);

  // Handle button click
  const handlePerformanceSelect = (option) => {
    setSelectedPerformance(option);
  };

  return (
    <div className="dashboard-container">
      <Header />

      {/* Analytics Section */}
      <div className="dashboard-analytics">
        <div className="dashboard-analytics-section">
          {selectedTeam && <TaskDistributionChart chartData={data} />}
        </div>

        <div className="dashboard-analytics-section">
          <h1 className="dashboard-title">Team {selectedTeam} Analytics</h1>
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
        {/* <div className="dashboard-leader-avatar"></div> */}
        <div>
          <h2 className="dashboard-leader-name">Team A Leader</h2>
          <span className="dashboard-leader-tag">Team A</span>
          <p className="dashboard-leader-text">Lead your team to success</p>
          <div className="dashboard-hours-completed">
            <h3 className="dashboard-hours-title">Hours Completed</h3>
            <div className="dashboard-team-members">
              {teamMembers.map((member, index) => (
                <div key={index} className="dashboard-team-member">
                  <div className="dashboard-team-member-avatar"></div>
                  <div className="dashboard-team-member-info">
                    <span className="dashboard-team-member-name">{member.name}</span>
                    <div className="dashboard-progress-container">
                      <div
                        className="dashboard-progress-bar"
                        style={{ width: `${(member.hoursCompleted / member.totalHours) * 100}%` }}
                      ></div>
                    </div>
                    <span className="dashboard-progress-text">
                      {member.hoursCompleted}/{member.totalHours} hours
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="dashboard-performance">
              <h3 className="dashboard-performance-title">Overall Team Performance</h3>
              <div className="dashboard-performance-buttons">
                <button
                  className={`dashboard-performance-button poor ${selectedPerformance === 'poor' ? 'selected' : ''}`}
                  onClick={() => handlePerformanceSelect('poor')}
                >
                  Poor
                </button>
                <button
                  className={`dashboard-performance-button good ${selectedPerformance === 'good' ? 'selected' : ''}`}
                  onClick={() => handlePerformanceSelect('good')}
                >
                  Good
                </button>
                <button
                  className={`dashboard-performance-button great ${selectedPerformance === 'great' ? 'selected' : ''}`}
                  onClick={() => handlePerformanceSelect('great')}
                >
                  Great
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-pie-chart">
            <TasksPieChart
              data={{
                onSchedule: completedTasks,
                overdue: pendingTasks
              }}
            />
          </div>
      </div>

      {/* Tasks Section */}
      <div className="dashboard-tasks">
        <h2 className="dashboard-tasks-title">Tasks</h2>
        <div className="dashboard-tasks-content">
          <div className="dashboard-overdue-tasks">
            <h3 className="dashboard-overdue-tasks-title">Overdue Tasks</h3>
            <div className="dashboard-overdue-tasks-list">
              {overdueTasks.map((task, index) => (
                <div key={index} className="dashboard-overdue-task">
                  <h4 className="dashboard-overdue-task-title">{task.title}</h4>
                  <p className="dashboard-overdue-task-message">
                    "{task.title}" is overdue, complete immediately
                  </p>
                  <a href={task.link} className="dashboard-link">Go to Task</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;