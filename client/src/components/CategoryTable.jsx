import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteModal } from "./modal/DeleteModal";
import AddCategoryModal from "./modal/AddCategoryModal";

// Define a palette of 6–8 colors
const colorPalette = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-red-100 text-red-800",
  "bg-teal-100 text-teal-800",
];

export function CategoryTable({
  categories,
  pagination,
  isLoading,
  onDeleteItem,
  onUpdateCategory,
  actionLoading,
}) {
  // Stable hash function: turns category name into a number
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  // Get color for category name
  const getCategoryColor = (name) => {
    if (!name) return "bg-gray-100 text-gray-800";
    const index = hashString(name.toLowerCase()) % colorPalette.length;
    return colorPalette[index];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6">
                Loading...
              </TableCell>
            </TableRow>
          ) : categories.length > 0 ? (
            categories.map((cat, index) => (
              <TableRow key={cat._id}>
                <TableCell>
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(cat.name)}>
                    {cat.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DeleteModal
                    onDeleteItem={onDeleteItem}
                    actionLoading={actionLoading}
                    id={cat._id}
                    name={cat.name}
                  />
                  <AddCategoryModal
                    onUpdateCategory={onUpdateCategory}
                    type="icon"
                    initialData={cat}
                    triggerLabel="Edit"
                    actionLoading={actionLoading}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-6 text-gray-500">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
