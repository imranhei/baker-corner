import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { Filter, RotateCcw } from "lucide-react";
import { useSelector } from "react-redux";

const MONTHS = [
  {
    value: "1",
    label: "January",
  },
  {
    value: "2",
    label: "February",
  },
  {
    value: "3",
    label: "March",
  },
  {
    value: "4",
    label: "April",
  },
  {
    value: "5",
    label: "May",
  },
  {
    value: "6",
    label: "June",
  },
  {
    value: "7",
    label: "July",
  },
  {
    value: "8",
    label: "August",
  },
  {
    value: "9",
    label: "September",
  },
  {
    value: "10",
    label: "October",
  },
  {
    value: "11",
    label: "November",
  },
  {
    value: "12",
    label: "December",
  },
];

const SummaryFilters = ({ filters, setFilters, years }) => {
  const { categories = [], isLoading } = useSelector(
    (state) => state.categories,
  );

  const handleMonthChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      month: Number(value),
      page: 1,
    }));
  };

  const handleYearChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      year: Number(value),
      page: 1,
    }));
  };

  const handleCategoryChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      category: value === "all" ? "" : value,
      page: 1,
    }));
  };

  const handleReset = () => {
    const now = new Date();

    setFilters((prev) => ({
      ...prev,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      category: "",
      page: 1,
    }));
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold">
          <Filter size={18} />
          Filters
        </div>

        <Button type="button" variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Month */}

        <Select value={String(filters.month)} onValueChange={handleMonthChange}>
          <SelectTrigger>
            <SelectValue placeholder="Month" />
          </SelectTrigger>

          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}

        <Select value={String(filters.year)} onValueChange={handleYearChange}>
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>

          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category */}

        <Select
          value={filters.category || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>

            {isLoading ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-category" disabled>
                No categories found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SummaryFilters;
