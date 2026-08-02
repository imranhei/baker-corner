import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CategoryChart = ({ data = [] }) => {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-5">Sales By Category</h2>

      <div className="h-[350px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No category data found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={5}
              >
                {data.map((item, index) => (
                  <Cell key={index} />
                ))}
              </Pie>

              {/* <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} /> */}
              <Tooltip
                formatter={(value, name) => {
                  const total = data.reduce(
                    (sum, item) => sum + item.revenue,
                    0,
                  );

                  const percentage = ((value / total) * 100).toFixed(1);

                  return [
                    `৳ ${value.toLocaleString()} (${percentage}%)`,
                    "Revenue",
                  ];
                }}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
