import {
  AlertTriangle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

import { Button } from "../../components/ui/button";

interface Props {
  open: boolean;

  loading?: boolean;

  shipmentNumber?: string;

  onOpenChange: (open: boolean) => void;

  onConfirm: () => void;
}

export default function DeleteShipmentDialog({
  open,
  loading,
  shipmentNumber,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>

          <DialogTitle className="text-center">
            Delete Shipment
          </DialogTitle>

          <DialogDescription className="text-center">
            Are you sure you want to permanently delete
            this shipment?
          </DialogDescription>

        </DialogHeader>

        {shipmentNumber && (
          <div className="rounded-lg border bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Shipment Number
            </p>

            <p className="mt-1 font-semibold text-lg">
              {shipmentNumber}
            </p>
          </div>
        )}

        <DialogFooter className="mt-6 gap-2">

          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Deleting..."
              : "Delete Shipment"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}