import {
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
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

import { Button } from "../../components/ui/button";

interface Props {

  loading?: boolean;

  onDelete: () => void;

}

export default function DeletePackingListDialog({
  loading,
  onDelete,
}: Props) {

  return (

    <AlertDialog>

      <AlertDialogTrigger asChild>

        <Button
          variant="destructive"
        >

          <Trash2 className="mr-2 h-4 w-4" />

          Delete

        </Button>

      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>

            Delete Packing List?

          </AlertDialogTitle>

          <AlertDialogDescription>

            This action cannot be undone.
            The packing list and its related items
            will be permanently removed.

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

            Delete

          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>

  );

}