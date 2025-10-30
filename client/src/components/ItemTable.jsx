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
  pagination,
  isLoading,
  onDeleteItem,
  onUpdateItem,
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
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Loading...
              </TableCell>
            </TableRow>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </TableCell>
                <TableCell>
                    {item.name}
                </TableCell>
                <TableCell>
                    {item.category?.name || 'Uncategorized'}
                </TableCell>
                <TableCell>
                    {item.createdAt.split('T')[0].split('-').reverse().join('-') || 'N/A'}
                </TableCell>
                <TableCell>
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                No items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
