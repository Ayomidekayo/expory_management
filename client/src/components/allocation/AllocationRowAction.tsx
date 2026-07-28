import { useState } from "react";
import {
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import type {
  Allocation,
  AllocationStatus,
} from "../../types/allocation.types";

import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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

import { useDeleteAllocation } from "../../hooks/allocation/useDeleteAllocation";

import { useUpdateAllocationStatus } from "../../hooks/allocation/useUpdateAllocationStatus";
import { getWorkflowActions } from "../../lib/allocationWorkflow";

interface Props {
  allocation: Allocation;
}

export default function AllocationRowActions({
  allocation,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const deleteAllocation =
    useDeleteAllocation();

  const updateStatus =
    useUpdateAllocationStatus();

  function changeStatus(
    status: AllocationStatus
  ) {
    updateStatus.mutate({
      id: allocation.id,
      status,
    });
  }

  return (
    <>
      <DropdownMenu>

        <DropdownMenuTrigger asChild>

          <Button
            variant="ghost"
            size="icon"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
        >
{getWorkflowActions(
  allocation.status
).map((action) => (

  <DropdownMenuItem
    key={action.status}
    onClick={() =>
      changeStatus(action.status)
    }
  >
    {action.label}
  </DropdownMenuItem>

))}

          <DropdownMenuSeparator />

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

              Delete Allocation?

            </AlertDialogTitle>

            <AlertDialogDescription>

              This will permanently delete

              <br />

              <strong>

                {allocation.allocationNumber}

              </strong>

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
                deleteAllocation.mutate(
                  allocation.id,
                  {
                    onSuccess: () => {
                      toast.success(
                        "Allocation deleted successfully."
                      );

                      setOpen(false);
                    },

                    onError: (
                      error: any
                    ) => {
                      toast.error(
                        error?.response
                          ?.data
                          ?.message ??
                          "Unable to delete allocation."
                      );
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