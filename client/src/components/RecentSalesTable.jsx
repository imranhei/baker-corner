import React from "react";

import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "./ui/table";

const formatMoney = (value) => {
  return new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
};

const RecentSalesTable = ({ data = [], pagination, loading, onPageChange }) => {
  const currentPage = pagination?.page || 1;

  const totalPages = pagination?.totalPages || 0;

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Recent Sales</h2>

            <p className="text-sm text-muted-foreground">
              {pagination?.total || 0} transactions
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin" />

          <span className="ml-2 text-sm text-muted-foreground">
            Loading sales...
          </span>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No sales found for this month.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-left p-3">Date</TableHead>
                <TableHead className="text-left p-3">Item</TableHead>
                <TableHead className="text-left p-3">Category</TableHead>
                <TableHead className="text-right p-3">Qty</TableHead>
                <TableHead className="text-right p-3">Purchase Price</TableHead>
                <TableHead className="text-right p-3">Total Purchase</TableHead>
                <TableHead className="text-right p-3">Selling Price</TableHead>
                <TableHead className="text-right p-3">Total Sale</TableHead>
                <TableHead className="text-right p-3">Profit</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((sale) => (
                <TableRow key={sale._id} className="border-t hover:bg-muted/30">
                  <TableCell className="p-3 whitespace-nowrap">
                    {new Date(sale.date).toLocaleDateString("en-GB")}
                  </TableCell>

                  <TableCell className="p-3 font-medium">{sale.item}</TableCell>

                  <TableCell className="p-3">{sale.category || "Uncategorized"}</TableCell>

                  <TableCell className="p-3 text-right">{sale.quantity.toFixed(2)}</TableCell>

                  <TableCell className="p-3 text-right">
                    ৳ {formatMoney(sale.purchasePrice)}
                  </TableCell>

                  <TableCell className="p-3 text-right">
                    ৳ {formatMoney(sale.purchaseTotal)}
                  </TableCell>

                  <TableCell className="p-3 text-right">
                    ৳ {formatMoney(sale.sellingPrice)}
                  </TableCell>

                  <TableCell className="p-3 text-right font-medium">
                    ৳ {formatMoney(sale.saleTotal)}
                  </TableCell>

                  <TableCell className="p-3 text-right font-semibold">
                    ৳ {formatMoney(sale.profit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || loading}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || loading}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSalesTable;
