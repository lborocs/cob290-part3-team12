import React from 'react';
import Header from './header';
import './dashboard.css';
import TaskDistributionChart from "./taskDistributionChart";
import TaskDurationPieChart from "./taskDurationChart";

const Dashboard = () => {
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
            </div>
          </div>
    
          {/* Pie Chart Section */}
          <TaskDurationPieChart />
        </div>
      );
    };

export default Dashboard;