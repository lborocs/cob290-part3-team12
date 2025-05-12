import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import API_URL from "../config";
import React, { useState, useEffect } from "react";

const data = [
  { name: "Task 1", number: 30 },
  { name: "Task 2", number: 22 },
  { name: "Task 3", number: 15 },
  { name: "Task 4", number: 23 },
  { name: "Task 5", number: 28 },
  { name: "Task 6", number: 20 },
];

const TaskDistributionChart = (
  {chartData}
) => {

  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   const fetchTaskData = async () => {
  //     if (!teamId) return;
  //     const jwt = localStorage.getItem("token");
  //     try {
  //       const response = await fetch(
  //         // the dodgedy teamId.teamId is a becuase teamId is an object, just a sketchy workaround
  //         `${API_URL}api/get-team-tasks/${teamId.teamId}`,
  //         {
  //           headers: {
  //             Authorization: jwt,
  //           },
  //         }
  //       );

  //       if (response.ok) {
  //         const result = await response.json();
  //         console.log(result);
  //         const taskTypes = {};
  //         result.results.forEach((task) => {
  //           if (!taskTypes[task.description]) {
  //             taskTypes[task.description] = 0;
  //           }
  //           taskTypes[task.description] += task.manhours;
  //         });

  //         const chartData = Object.entries(taskTypes).map(([name, value]) => ({
  //           name,
  //           number: value,
  //         }));

  //         setData(chartData);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching task duration data:", error);
  //     }
  //   };
  //   fetchTaskData();
  //     }, [teamId]);
  
    return (
        <div className="bg-white p-4 shadow-md rounded-xl text-left">
          <div className="text-left space-y-1"> 
            <h2 className="text-xl font-semibold m-0 p-0">Task Distribution</h2>
            <p className="text-yellow-500 text-sm m-0">Number</p>
          </div>
          
          <div className="mt-3"> 
            <ResponsiveContainer width="90%" height={200}>
              <BarChart 
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 15 }} 
                  tickMargin={5} 
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="number" 
                  fill="#facc15" 
                  barSize={70} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-yellow-500 text-sm m-0 mt-2 text-left">Tasks</p>
        </div>
      );
    };

export default TaskDistributionChart;