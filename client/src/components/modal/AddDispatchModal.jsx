import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Loader2, Plus } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { AsyncSearchSelect } from "@/components/AsyncSearchSelect";

export function AddDispatchModal({
  onAddDispatch = () => {},
  onUpdateDispatch = () => {},
  initialData = null,
  triggerLabel = "Add Sale",
  type = "button",
  actionLoading = false,
}) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    item: null,
    quantity: "",
    totalPrice: "",
    date: "",
  });

  // ✅ Populate form
  useEffect(() => {
    if (open) {
      setFormData({
        item: initialData?.item || null,
        quantity: initialData?.quantity ?? "",
        price: initialData?.price ?? "",
        date: initialData?.date
          ? initialData.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [open, initialData]);

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        itemId: formData.item?._id,
        quantity: Number(formData.quantity),
        price:
          formData.quantity && Number(formData.quantity) > 0
            ? Number(formData.totalPrice) / Number(formData.quantity)
            : 0,
        date: formData.date,
      };

      if (!payload.itemId) {
        throw new Error("Item is required");
      }

      if (initialData) {
        await onUpdateDispatch({ id: initialData._id, ...payload });
      } else {
        await onAddDispatch(payload);
      }

      setOpen(false);
      setFormData({
        item: null,
        quantity: "",
        price: "",
        date: "",
      });
    } catch (err) {
      console.error("Add/Update dispatch failed:", err);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={type === "button" ? "default" : "ghost"}
        size={type === "button" ? "default" : "sm"}
        className={
          type === "button"
            ? ""
            : "text-green-500 hover:text-green-600 hover:bg-green-100"
        }
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
              {initialData ? "Update Dispatch" : "Add New Sale"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ✅ Async Item Select */}
            <div className="space-y-1">
              <Label>Item</Label>

              <AsyncSearchSelect
                value={formData.item}
                placeholder="Select item"
                getKey={(item) => item?._id}
                displayValue={(item) =>
                  `${item.name} - ${item.category?.name || "No Category"}`
                }
                fetchOptions={async (query, page) => {
                  const res = await axiosInstance.get("/api/item", {
                    params: {
                      page,
                      limit: 20,
                      search: query,
                    },
                  });

                  return {
                    data: res.data.data,
                    hasMore: res.data.pagination?.hasMore || false,
                  };
                }}
                onChange={(item) =>
                  setFormData((prev) => ({
                    ...prev,
                    item,
                  }))
                }
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label> Total Quantity</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* Price */}
            {/* Total Price */}
            <div className="space-y-2">
              <Label>Total Price</Label>
              <Input
                type="number"
                value={formData.totalPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    totalPrice: e.target.value,
                  }))
                }
                required
              />
            </div>

            {formData.quantity && formData.totalPrice && (
              <div className="text-sm text-gray-600">
                Unit Price:{" "}
                <span className="font-semibold text-sky-700">
                  {(
                    Number(formData.totalPrice) / Number(formData.quantity)
                  ).toFixed(2)}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>

            {/* Actions */}
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
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {initialData ? "Updating..." : "Adding..."}
                  </>
                ) : initialData ? (
                  "Update"
                ) : (
                  "Add Sale"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
