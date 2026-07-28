import { useState } from "react";
import {
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import type { Exporter } from "../../types/exporter.types";

import { useDeleteExporter } from "../../hooks/exporter/useDeleteExporter";

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

interface Props {
  exporter: Exporter;
}

export default function ExporterRowActions({
  exporter,
}: Props) {
  const [open, setOpen] = useState(false);

  const deleteExporter =
    useDeleteExporter();

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
            onClick={() => setOpen(true)}
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
              Delete Exporter?
            </AlertDialogTitle>

            <AlertDialogDescription>

              Are you sure you want to delete{" "}
              <strong>{exporter.name}</strong>?

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
                deleteExporter.mutate(exporter.id, {
                  onSuccess: () => {
                    toast.success(
                      "Exporter deleted successfully."
                    );

                    setOpen(false);
                  },

                  onError: (error: any) => {
                    toast.error(
                      error?.response?.data?.message ??
                        "Unable to delete exporter."
                    );
                  },
                })
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