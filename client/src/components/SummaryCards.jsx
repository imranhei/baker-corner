import React from "react";

import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const formatMoney = (value) => {
  return new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
};

const SummaryCards = ({ cards = {} }) => {
  const cardData = [
    {
      title: "Total Revenue",
      value: `৳ ${formatMoney(cards.totalRevenue)}`,
      icon: DollarSign,
    },
    {
      title: "Quantity Sold",
      value: Number(cards.totalQuantitySold).toFixed(2) || 0,
      icon: Package,
    },
    {
      title: "Transactions",
      value: Number(cards.totalTransactions).toFixed(2) || 0,
      icon: ShoppingCart,
    },
    {
      title: "Total Profit",
      value: `৳ ${formatMoney(cards.totalProfit)}`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cardData.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.title} className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>

                <p className="text-2xl font-bold mt-2">{card.value}</p>
              </div>

              <div className="p-3 rounded-lg bg-muted">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
