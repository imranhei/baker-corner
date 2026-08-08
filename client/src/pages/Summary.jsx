import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummary } from "@/redux/admin/summary-slice";
import { fetchRecentSales } from "@/redux/admin/recent-sales-slice";
import SummaryCards from "@/components/SummaryCards";
import SummaryFilters from "@/components/SummaryFilters";
import RevenueChart from "@/components/RevenueChart";
import CategoryChart from "@/components/CategoryChart";
import TopItemsChart from "@/components/TopItemsChart";
import RecentSalesTable from "@/components/RecentSalesTable";

const Summary = () => {
  const dispatch = useDispatch();

  const now = new Date();

  const [filters, setFilters] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    category: "",
  });

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = Math.min(currentYear - 5, 2020);

    return Array.from(
      {
        length: currentYear - startYear + 1,
      },
      (_, index) => currentYear - index,
    );
  }, []);

  const {
    cards,
    revenueChart,
    categoryChart,
    topItems,
    loading: summaryLoading,
  } = useSelector((state) => state.summary);

  const {
    recentSales,
    pagination,
    loading: recentSalesLoading,
  } = useSelector((state) => state.recentSales);

  useEffect(() => {
    dispatch(
      fetchSummary({
        month: filters.month,
        year: filters.year,
        category: filters.category,
      }),
    );
  }, [dispatch, filters.month, filters.year, filters.category]);

  useEffect(() => {
    dispatch(
      fetchRecentSales({
        month: filters.month,
        year: filters.year,
        category: filters.category,
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch, filters.month, filters.year, filters.category]);

  const handlePageChange = (page) => {
    dispatch(
      fetchRecentSales({
        month: filters.month,
        year: filters.year,
        category: filters.category,
        page,
        limit: 10,
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Sales Summary</h1>

        <p className="text-sm text-muted-foreground mt-1">
          Monthly sales performance and analytics
        </p>
      </div>

      <SummaryFilters filters={filters} setFilters={setFilters} years={years} />

      {summaryLoading && (
        <div className="text-sm text-muted-foreground">Updating summary...</div>
      )}

      <SummaryCards cards={cards} />

      <RecentSalesTable
        data={recentSales}
        pagination={pagination}
        loading={recentSalesLoading}
        onPageChange={handlePageChange}
      />

      <RevenueChart data={revenueChart} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CategoryChart data={categoryChart} />

        <TopItemsChart data={topItems} />
      </div>
    </div>
  );
};

export default Summary;
