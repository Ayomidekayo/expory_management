import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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
} from "../ui/alert-dialog";

import { Button } from "../ui/button";

import { useDeleteDocument } from "../../hooks/document/useDeleteDocument";

interface Props {
  id: string;
}

export default function DeleteDocumentDialog({
  id,
}: Props) {

  const [open, setOpen] =
    useState(false);

  const deleteMutation =
    useDeleteDocument();

  async function handleDelete() {

    try {

      await deleteMutation.mutateAsync(
        id
      );

      toast.success(
        "Document deleted successfully."
      );

      setOpen(false);

    } catch (error: any) {

      toast.error(
        error?.response?.data?.message ??
          "Failed to delete document."
      );

    }

  }

  return (

    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >

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
            The document will be permanently
            removed from the system.

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>

            Cancel

          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={
              deleteMutation.isPending
            }
          >

            {deleteMutation.isPending
              ? "Deleting..."
              : "Delete"}

          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>

  );

}