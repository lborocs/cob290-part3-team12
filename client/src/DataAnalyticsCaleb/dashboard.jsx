import React, { useState } from 'react';
import Header from '../Data Analytics/header';
import './dashboard.css';
import TaskDistributionChart from "../Data Analytics/taskDistributionChart";
import TasksPieChart from "./TasksPieChart";

const Dashboard = () => {
  // Example team member data
  const teamMembers = [
    { name: "Alice Smith", hoursCompleted: 25, totalHours: 40 },
    { name: "Bob Johnson", hoursCompleted: 18, totalHours: 30 },
    { name: "Clara Lee", hoursCompleted: 35, totalHours: 50 }
  ];

  // Example overdue tasks data
  const overdueTasks = [
    { title: "Update Database", link: "/tasks/update-database" },
    { title: "Client Meeting Prep", link: "/tasks/client-meeting" }
  ];

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
          <TaskDistributionChart />
        </div>

        <div className="dashboard-analytics-section">
          <h1 className="dashboard-title">Team A Analytics</h1>
          <p className='dashboard-link-text'>
            <a href="#" className="dashboard-link">View data</a> metrics for Team A
          </p>
          <div className="dashboard-metrics">
            <div className="dashboard-card">
              <p className="dashboard-card-title">Completed Tasks</p>
              <h2 className="dashboard-card-value">120</h2>
              <p className="dashboard-card-trend positive">+5%</p>
            </div>
            <div className="dashboard-card">
              <p className="dashboard-card-title">Pending Tasks</p>
              <h2 className="dashboard-card-value">30</h2>
              <p className="dashboard-card-trend negative">-10%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Leader Section */}
      <div className="dashboard-leader">
        <div className="dashboard-leader-avatar"></div>
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
      </div>

      {/* Tasks Section */}
      <div className="dashboard-tasks">
        <h2 className="dashboard-tasks-title">Tasks</h2>
        <div className="dashboard-tasks-content">
          <div className="dashboard-pie-chart">
            <TasksPieChart
              data={{
                onSchedule: 6,
                overdue: 3
              }}
            />
          </div>
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