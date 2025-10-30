import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Loader2, Plus } from "lucide-react";
import { useSelector } from "react-redux";

export function AddItemModal({
  onAddItem = () => {},
  onUpdateItem = () => {},
  initialData = null,
  triggerLabel = "Add Item",
  type = "button",
  actionLoading = false,
}) {
  const { categories, isLoading } = useSelector((state) => state.categories);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    // supplier: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: initialData?.name ?? "",
        category: initialData?.category?._id || "", // ✅ Use ID, not name
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = {
      ...formData,
      category: formData.category, // ID only
    };

    if (!newItem.name.trim()) return;

    try {
      if (initialData) {
        // update
        await onUpdateItem({ id: initialData._id, ...newItem });
      } else {
        // add
        await onAddItem(newItem);
      }

      // ✅ Close modal only after successful add/update
      setOpen(false);

      // ✅ Reset form
      setFormData({
        name: "",
        category: "",
      });
    } catch (err) {
      console.error("Add/Update item failed:", err);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={type === "button" ? "default" : "ghost"}
        size={type === "button" ? "default" : "sm"}
        className={`${
          type === "button"
            ? ""
            : "text-green-500 hover:text-green-600 hover:bg-green-100"
        }`}
      >
        {type === "button" ? (
          <>
            <Plus className="h-4 w-4" />
            <span className="ml-2">{triggerLabel}</span>
          </>
        ) : (
          <Edit className="h-4 w-4" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Update Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-category" disabled>
                      No categories found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) =>
                setFormData({ ...formData, supplier: e.target.value })
              }
              required
            />
          </div> */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? (
                  initialData ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin inline-block" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin inline-block" />
                      Adding...
                    </>
                  )
                ) : initialData ? (
                  "Update"
                ) : (
                  "Add Item"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
