
import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

import { useDeleteTransport } from "../../hooks/transport/useDeleteTransport";

interface DeleteTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transportId: string;
  transportNumber: string;
}

export default function DeleteTransportDialog({
  open,
  onOpenChange,
  transportId,
  transportNumber,
}: DeleteTransportDialogProps) {
  const deleteTransport = useDeleteTransport();

  function handleDelete() {
    deleteTransport.mutate(transportId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!deleteTransport.isPending) {
          onOpenChange(value);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <AlertDialogTitle>
            Delete Transport Record?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {transportNumber}
            </strong>
            ?

            <span className="mt-3 block">
              This action cannot be undone. Transport records
              with payment history or locked records cannot
              be deleted.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteTransport.isPending}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={deleteTransport.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleteTransport.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Transport
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
