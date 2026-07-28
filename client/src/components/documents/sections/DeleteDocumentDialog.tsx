import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

interface Props {
  loading?: boolean;

  onDelete: () => void;
}

export default function DeleteDocumentDialog({
  loading = false,
  onDelete,
}: Props) {
  return (
    <AlertDialog>

      <AlertDialogTrigger asChild>

        <Button
          size="icon"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>

            Delete Document?

          </AlertDialogTitle>

          <AlertDialogDescription>

            This action cannot be undone.
            The uploaded document will be
            permanently removed.

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>

            Cancel

          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={onDelete}
          >

            {loading
              ? "Deleting..."
              : "Delete"}

          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
}