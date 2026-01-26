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
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "@/redux/admin/item-slice"; // ✅ Make sure this exists

export function AddReceivedModal({
  onAddReceived = () => {},
  onUpdateReceived = () => {},
  initialData = null,
  triggerLabel = "Add Received",
  type = "button",
  actionLoading = false,
}) {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.items);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemId: "",
    quantity: "",
    price: "",
    date: "",
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchItems({ page: 1, limit: 1000 }));
      setFormData({
        itemId: initialData?.item?._id || "",
        quantity: initialData?.quantity || "",
        price: initialData?.price || "",
        date: initialData?.date?.split("T")[0] || "",
      });
    }
  }, [open, initialData, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (initialData) {
        await onUpdateReceived({ id: initialData._id, ...payload });
      } else {
        await onAddReceived(payload);
      }

      setOpen(false);
      setFormData({ itemId: "", quantity: "", price: "", date: "" });
    } catch (err) {
      console.error("Add/Update failed:", err);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={type === "button" ? "default" : "ghost"}
        size={type === "button" ? "default" : "sm"}
        className={type !== "button" ? "text-green-500 hover:bg-green-100" : ""}
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
              {initialData ? "Update Received" : "Add New Received"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item">Item</Label>
              <Select
                value={formData.itemId}
                onValueChange={(value) =>
                  setFormData({ ...formData, itemId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Item" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : items.length > 0 ? (
                    items.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-item" disabled>
                      No items found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

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
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline-block" />
                    {initialData ? "Updating..." : "Adding..."}
                  </>
                ) : initialData ? (
                  "Update"
                ) : (
                  "Add Received"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
