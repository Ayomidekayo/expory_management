import { useState } from "react";

import {
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { useDeleteConsignee } from "../../hooks/consignee/useDeleteConsignee";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";
import type { Consignee } from "../../types/consignee";


interface Props {
  consignee: Consignee;
}

export default function ConsigneeRowActions({
  consignee,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const deleteConsignee =
    useDeleteConsignee();

  return (
    <>
      <DropdownMenu>

        <DropdownMenuTrigger asChild>

          <Button
            size="icon"
            variant="ghost"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">

          <DropdownMenuItem
            className="text-red-600"
            onClick={() =>
              setOpen(true)
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />

            Delete

          </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete Consignee?
            </AlertDialogTitle>

            <AlertDialogDescription>

              Are you sure you want to delete{" "}
              <strong>
                {consignee.name}
              </strong>
              ?

              <br />

              <br />

              This action cannot be undone.

            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                deleteConsignee.mutate(
                  consignee.id,
                  {
                    onSuccess: () => {
                      toast.success(
                        "Consignee deleted successfully."
                      );

                      setOpen(false);
                    },
                  }
                )
              }
            >
              Delete
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>
    </>
  );
}