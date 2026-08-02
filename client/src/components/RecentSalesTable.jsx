import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { format } from "date-fns";

const RecentSalesTable = ({ data = [], pagination, onPageChange }) => {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-5">Recent Sales</h2>

      {data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No sales found</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>

              <TableHead>Item</TableHead>

              <TableHead>Category</TableHead>

              <TableHead>Quantity</TableHead>

              <TableHead>Price</TableHead>

              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell>
                  {format(new Date(sale.date), "dd MMM yyyy")}
                </TableCell>

                <TableCell>{sale.item}</TableCell>

                <TableCell>{sale.category}</TableCell>

                <TableCell>{sale.quantity}</TableCell>

                <TableCell>৳ {sale.price}</TableCell>

                <TableCell>৳ {sale.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}

      {pagination && (
        <div className="flex justify-between items-center mt-5">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSalesTable;
