

import { toast } from "sonner";

import {
  useDeleteAllocation,
} from "../../hooks/allocation/useDeleteAllocation";
import { AlertDialog , AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";

interface Props {
  id?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAllocationDialog({
  id,
  open,
  onOpenChange,
}: Props) {

  const mutation =
    useDeleteAllocation();

  const handleDelete = () => {

    if (!id) return;

    mutation.mutate(id, {

      onSuccess() {

        toast.success(
          "Allocation deleted successfully."
        );

        onOpenChange(false);

      },

      onError() {

        toast.error(
          "Failed to delete allocation."
        );

      },

    });

  };

  return (

    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>

            Delete Allocation

          </AlertDialogTitle>

          <AlertDialogDescription>

            This action cannot be undone.

            This will permanently delete the allocation
            from the system.

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

           <AlertDialogCancel variant="default" size="sm">
  Cancel
</AlertDialogCancel>


           <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="bg-red-600 hover:bg-red-700"
            variant="default"   // ✅ required prop
            size="sm"           // ✅ required prop
          >

            {mutation.isPending
              ? "Deleting..."
              : "Delete Allocation"}

          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>

  );

}