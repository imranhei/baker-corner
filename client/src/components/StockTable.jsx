import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function StockTable({ stocks, isLoading }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Total Qty</TableHead>
            <TableHead>Avg Purchase Price</TableHead>
            <TableHead>Avg Sale Price</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Loading...
              </TableCell>
            </TableRow>
          ) : stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <TableRow key={stock._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{stock.item?.name || "N/A"}</TableCell>
                <TableCell>{stock.item?.category?.name || "Uncategorized"}</TableCell>
                <TableCell>{stock.totalQuantity}</TableCell>
                <TableCell>
                  {stock.avgPurchasePrice?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell>
                  {stock.avgSalePrice?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell>
                  {stock.lastUpdated
                    ? new Date(stock.lastUpdated).toLocaleDateString("en-GB")
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No stock data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
