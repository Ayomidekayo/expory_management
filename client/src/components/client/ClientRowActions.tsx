import { useState } from "react";
import {
  MoreHorizontal,
  Trash2,
  Power,
} from "lucide-react";

import { toast } from "sonner";

import type { Client } from "../../types/client.types";

import { useDeleteClient } from "../../hooks/client/useDeleteClient";


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
import { useUpdateClientStatus } from "../../hooks/client/useUpdateClientStatus";

interface Props {
  client: Client;
}

export default function ClientRowActions({
  client,
}: Props) {
  const [open, setOpen] = useState(false);

  const deleteClient = useDeleteClient();

  const updateStatus =
    useUpdateClientStatus();

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
            onClick={() =>
              updateStatus.mutate({
                id: client.id,
                isActive: !client.isActive,
              })
            }
          >
            <Power className="mr-2 h-4 w-4" />

            {client.isActive
              ? "Deactivate"
              : "Activate"}

          </DropdownMenuItem>

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

              Delete Client?

            </AlertDialogTitle>

            <AlertDialogDescription>

              Are you sure you want to delete{" "}
              <strong>
                {client.companyName}
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
                deleteClient.mutate(client.id, {
                  onSuccess: () => {
                    toast.success(
                      "Client deleted successfully."
                    );

                    setOpen(false);
                  },

                  onError: (error: any) => {
                    toast.error(
                      error?.response?.data
                        ?.message ??
                        "Unable to delete client."
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