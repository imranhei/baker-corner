import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h2 className="font-semibold text-lg mb-5">Revenue Trend</h2>

      <div className="h-[350px]">
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No sales data found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="label" />

              <YAxis tickFormatter={(value) => `৳${value}`} />

              <Tooltip formatter={(value) => [`৳${value}`, "Revenue"]} />

              <Line
                type="monotone"
                dataKey="revenue"
                strokeWidth={3}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
