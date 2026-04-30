import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import CustomPagination from "@/components/CustomPagination";
import { StockTable } from "@/components/StockTable";
import { fetchStocks } from "@/redux/admin/stock-slice";

const Stock = () => {
  const dispatch = useDispatch();
  const { stocks, pagination, isLoading } = useSelector((state) => state.stocks);

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [sort, setSort] = useState("desc");
  const limit = 20;

  useEffect(() => {
    dispatch(fetchStocks({ page, limit, q, minQty, maxQty, sort }))
      .unwrap()
      .catch((err) => toast.error(err));
  }, [dispatch, page, q, minQty, maxQty, sort]);

  const handleFilter = () => {
    setPage(1);
    dispatch(fetchStocks({ page: 1, limit, q, minQty, maxQty, sort }))
      .unwrap()
      .catch((err) => toast.error(err));
  };

  const clearFilters = () => {
    setQ("");
    setMinQty("");
    setMaxQty("");
    setSort("desc");
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-6rem)]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>
            Stock Summary{" "}
            <Badge variant="outline" className="ml-2">
              {pagination.total || 0}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by item name..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10"
              />
            </div>

            <Input
              type="number"
              placeholder="Min Qty"
              value={minQty}
              onChange={(e) => setMinQty(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Qty"
              value={maxQty}
              onChange={(e) => setMaxQty(e.target.value)}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="desc">Sort by Latest</option>
              <option value="asc">Sort by Oldest</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleFilter}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>

          {/* Stock Table */}
          <StockTable stocks={stocks} isLoading={isLoading} />

          <CustomPagination
            total={pagination.total}
            page={page}
            limit={pagination.limit}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Stock;
