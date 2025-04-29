import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import "./taskDurationChart.css"; 

const data = [
  { name: "Task Type A", value: 60 },
  { name: "Task Type B", value: 28 },
  { name: "Task Type C", value: 12 },
];

const COLORS = ["#0ea5e9", "#e879f9", "#a3e635"];

const TaskDurationPieChart = () => {
    return (
      <div className="task-duration-container">
        <h2 className="task-duration-title">Team A Task Expected Duration</h2>
        
        
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
      </div>
    );
  };
  
  export default TaskDurationPieChart;