import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteModal({ onDeleteItem, actionLoading, id, name }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // wait for parent thunk
      await onDeleteItem(id);
      setOpen(false); // close only on success
    } catch (err) {
      // modal stays open if error occurs
      console.error("Delete failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-100"
          size="sm"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            Are you sure you want to delete <strong>{name}</strong>?
          </p>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={actionLoading} // prevent closing while deleting
            >
              No, Keep it
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading && (
                <Loader2 className="h-4 w-4 animate-spin inline-block" />
              )}
              Yes, Delete!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
