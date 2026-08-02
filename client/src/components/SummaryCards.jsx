import React from "react";

import { DollarSign, Package, ShoppingCart, ChartColumnStacked } from "lucide-react";

const SummaryCards = ({ cards }) => {
  const data = [
    {
      title: "Total Revenue",
      value: `৳ ${cards.totalRevenue}`,
      icon: DollarSign,
    },
    {
      title: "Products Sold",
      value: (cards.totalQuantitySold).toFixed(1),
      icon: Package,
    },
    {
      title: "Transactions",
      value: cards.totalTransactions,
      icon: ShoppingCart,
    },
    {
      title: "Average Sale",
      value: `৳ ${cards.averageOrderValue.toFixed(2)}`,
      icon: ChartColumnStacked,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {data.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="rounded-xl border p-5 bg-white shadow-sm flex justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>

              <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            </div>

            <Icon className="h-8 w-8" />
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
