import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";

/**
 * Props:
 * - onAddCategory: async or sync function that receives { name }
 * - initialData: optional category to prefill the form (for editing)
 * - triggerLabel: optional label for the trigger button
 */
const AddCategoryModal = ({
  onAddCategory = () => {},
  onUpdateCategory = () => {},
  initialData = null,
  triggerLabel = "Add Category",
  type = "button",
  actionLoading = false,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  // Prefill form when modal opens (supports add & edit)
  useEffect(() => {
    if (open) {
      setFormData({ name: initialData?.name ?? "" });
    }
  }, [open, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (initialData) {
        // update
        await onUpdateCategory({ id: initialData._id, name: formData.name });
      } else {
        // add
        await onAddCategory({ name: formData.name });
      }

      setFormData({ name: "" });
      setOpen(false);
    } catch (err) {
      console.error("Add/Update category failed:", err);
      // keep modal open
    }
  };

  return (
    <>
      {/* Trigger button — using plain button to reliably control 'open' */}
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

      {/* Controlled Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Update Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={actionLoading}
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
                  "Add Category"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCategoryModal;
