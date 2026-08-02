import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopItemsChart = ({ data = [] }) => {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-5">Top Selling Items</h2>

      <div className="h-[350px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No item data found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis type="category" dataKey="name" width={120} />

              <Tooltip
                formatter={(value, name) => {
                  if (name === "quantity") {
                    return [value, "Sold Quantity"];
                  }

                  return [`৳ ${value.toLocaleString()}`, "Revenue"];
                }}
              />

              <Bar dataKey="quantity" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TopItemsChart;
