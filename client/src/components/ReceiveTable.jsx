import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteModal } from "./modal/DeleteModal";
import { AddReceivedModal } from "./modal/AddReceivedModal";

export function ReceiveTable({
  items,
  pagination,
  isLoading,
  onDeleteReceived,
  onUpdateReceived,
  actionLoading,
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Loading...
              </TableCell>
            </TableRow>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </TableCell>
                <TableCell>{item.item?.name || "N/A"}</TableCell>
                <TableCell>
                  {item.item?.category?.name || "Uncategorized"}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  {item.date
                    ? new Date(item.date).toLocaleDateString("en-GB", {
                        timeZone: "UTC",
                      })
                    : "N/A"}
                </TableCell>

                <TableCell className="space-x-2">
                  <AddReceivedModal
                    onUpdateReceived={onUpdateReceived}
                    type="icon"
                    initialData={item}
                    triggerLabel="Edit"
                    actionLoading={actionLoading}
                  />
                  <DeleteModal
                    onDelete={() => onDeleteReceived(item._id)}
                    actionLoading={actionLoading}
                    id={item._id}
                    name={item.item?.name}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
