import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Task 1", number: 30 },
  { name: "Task 2", number: 22 },
  { name: "Task 3", number: 15 },
  { name: "Task 4", number: 23 },
  { name: "Task 5", number: 28 },
  { name: "Task 6", number: 20 },
];

const TaskDistributionChart = () => {
    return (
        <div className="bg-white p-4 shadow-md rounded-xl text-left">
          <div className="text-left space-y-1"> 
            <h2 className="text-xl font-semibold m-0 p-0">Task Distribution</h2>
            <p className="text-yellow-500 text-sm m-0">Number</p>
          </div>
          
          <div className="mt-3"> 
            <ResponsiveContainer width="90%" height={200}>
              <BarChart 
                data={data}
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