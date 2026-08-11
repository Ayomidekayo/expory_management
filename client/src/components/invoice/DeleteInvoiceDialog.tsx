import {
  Loader2,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";



interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  loading?: boolean;

  onConfirm: () => void;
}

export default function DeleteInvoiceDialog({
  open,
  onOpenChange,
  loading = false,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>

          <DialogTitle className="text-xl">
            Delete Invoice
          </DialogTitle>

          <DialogDescription className="pt-2 leading-6">
            Are you sure you want to delete this
            invoice? This action cannot be undone.
          </DialogDescription>

        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-2">

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Invoice
              </>
            )}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}