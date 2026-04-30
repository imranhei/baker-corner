import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteModal } from "./modal/DeleteModal";
import { AddItemModal } from "./modal/AddItemModal";

export function ItemTable({
  items,
  isLoading,
  onDeleteItem,
  onUpdateItem,
  actionLoading,
  lastElementRef,
}) {
  return (
    <div className="rounded-md border mb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Loading...
              </TableCell>
            </TableRow>
          ) : items.length > 0 ? (
            items.map((item, index) => {
              const isLast = items.length === index + 1;

              return (
                <TableRow
                  key={item._id}
                  ref={isLast ? lastElementRef : null} // ✅ attach here
                >
                  {/* ✅ Serial number (correct for infinite scroll) */}
                  {/* <TableCell>{index + 1}</TableCell> */}
                  <TableCell>{items.findIndex(i => i._id === item._id) + 1}</TableCell>

                  <TableCell>{item.name}</TableCell>

                  <TableCell>
                    {item.category?.name || "Uncategorized"}
                  </TableCell>

                  <TableCell>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <DeleteModal
                      onDeleteItem={onDeleteItem}
                      actionLoading={actionLoading}
                      id={item._id}
                      name={item.name}
                    />

                    <AddItemModal
                      onUpdateItem={onUpdateItem}
                      type="icon"
                      initialData={item}
                      triggerLabel="Edit"
                      actionLoading={actionLoading}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
