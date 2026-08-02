import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";

import { CalendarIcon, Filter } from "lucide-react";

const SummaryFilters = ({ filters, setFilters }) => {
  const [date, setDate] = useState();

  const handlePeriod = (value) => {
    setDate(undefined);

    setFilters((prev) => ({
      ...prev,
      period: value,
      from: "",
      to: "",
      page: 1,
    }));
  };

  const handleCustomDate = (value) => {
    setDate(value);

    if (value?.from && value?.to) {
      setFilters((prev) => ({
        ...prev,
        period: "",
        from: format(value.from, "yyyy-MM-dd"),
        to: format(value.to, "yyyy-MM-dd"),
        page: 1,
      }));
    }
  };

  const clearFilters = () => {
    setDate(undefined);

    setFilters((prev) => ({
      ...prev,
      period: "thisMonth",
      category: "",
      item: "",
      from: "",
      to: "",
      page: 1,
    }));
  };

  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Filter size={18} />
          Filters
        </div>

        <Button variant="outline" size="sm" onClick={clearFilters}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Period */}

        <Select value={filters.period || ""} onValueChange={handlePeriod}>
          <SelectTrigger>
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="thisMonth">This Month</SelectItem>

            <SelectItem value="lastMonth">Last Month</SelectItem>

            <SelectItem value="thisYear">This Year</SelectItem>

            <SelectItem value="lastYear">Last Year</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range */}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />

              {date?.from
                ? `${format(date.from, "dd MMM yyyy")}
                ${date.to ? " - " + format(date.to, "dd MMM yyyy") : ""}`
                : "Custom Date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleCustomDate}
            />
          </PopoverContent>
        </Popover>

        {/* Category */}

        <Select
          value={filters.category || "all"}
          onValueChange={(value) => {
            setFilters((prev) => ({
              ...prev,

              category: value === "all" ? "" : value,

              page: 1,
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>

            {/* Later dynamic categories */}
          </SelectContent>
        </Select>

        {/* Item */}

        <Select
          value={filters.item || "all"}
          onValueChange={(value) => {
            setFilters((prev) => ({
              ...prev,

              item: value === "all" ? "" : value,

              page: 1,
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Item" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>

            {/* Later dynamic items */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SummaryFilters;
