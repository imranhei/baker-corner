import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchSummary } from "@/redux/admin/summary-slice";
import SummaryCards from "@/components/SummaryCards";
import SummaryFilters from "@/components/SummaryFilters";
import RevenueChart from "@/components/RevenueChart";
import CategoryChart from "@/components/CategoryChart";
import TopItemsChart from "@/components/TopItemsChart";
import RecentSalesTable from "@/components/RecentSalesTable";

const Summary = () => {
  const dispatch = useDispatch();

  const {
    cards,
    revenueChart,
    categoryChart,
    topItems,
    recentSales,
    pagination,
    loading,
  } = useSelector((state) => state.summary);

  const [filters, setFilters] = useState({
    period: "thisMonth",
    category: "",
    item: "",
    from: "",
    to: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value),
    );

    dispatch(fetchSummary(params));
  }, [
    filters.period,
    filters.category,
    filters.item,
    filters.from,
    filters.to,
    filters.page,
    filters.limit,
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sales Summary</h1>

      <SummaryFilters filters={filters} setFilters={setFilters} />

      <SummaryCards cards={cards} />

      <RevenueChart data={revenueChart} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CategoryChart data={categoryChart} />

        <TopItemsChart data={topItems} />
      </div>

      <RecentSalesTable
        data={recentSales}
        pagination={pagination}
        onPageChange={(page) => {
          setFilters((prev) => ({
            ...prev,
            page,
          }));
        }}
      />
    </div>
  );
};

export default Summary;
