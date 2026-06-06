import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteModal } from "./modal/DeleteModal";
import { AddDispatchModal } from "./modal/AddDispatchModal";

export function DispatchTable({
  dispatches,
  isLoading,
  onDeleteDispatch,
  onUpdateDispatch,
  actionLoading,
  lastElementRef,
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Item</TableHead>
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
          ) : dispatches.length > 0 ? (
            dispatches.map((dispatch, index) => {
              const isLast = dispatches.length === index + 1;

              return (
                <TableRow
                  key={dispatch._id}
                  ref={isLast ? lastElementRef : null}
                >
                  <TableCell>
                    {index + 1}
                  </TableCell>
                  <TableCell>{dispatch.item?.name || "N/A"}</TableCell>
                  <TableCell>
                    {dispatch.item?.category?.name || "Uncategorized"}
                  </TableCell>
                  <TableCell>{dispatch.quantity}</TableCell>
                  <TableCell>{dispatch.price}</TableCell>
                  <TableCell>
                    {dispatch.date
                      ? new Date(dispatch.date).toLocaleDateString("en-GB", {
                          timeZone: "UTC",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <AddDispatchModal
                      onUpdateDispatch={onUpdateDispatch}
                      type="icon"
                      initialData={dispatch}
                      actionLoading={actionLoading}
                    />
                    <DeleteModal
                      onDeleteItem={onDeleteDispatch}
                      actionLoading={actionLoading}
                      id={dispatch._id}
                      name={dispatch.item?.name}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No dispatch records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
