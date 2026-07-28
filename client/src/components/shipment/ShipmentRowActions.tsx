import { useState } from "react";

import { Link } from "react-router-dom";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";

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


import type { Shipment } from "../../types/shipment.types";
import { useDeleteShipment } from "../../hooks/shipments/useDeleteShipment";

interface Props {
  shipment: Shipment;
}

export default function ShipmentRowActions({
  shipment,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const deleteShipment =
    useDeleteShipment();

  function handleDelete() {
    deleteShipment.mutate(
      shipment.id,
      {
        onSuccess() {
          toast.success(
            "Shipment deleted successfully."
          );

          setOpen(false);
        },
      }
    );
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

        <DropdownMenuContent align="end">

          <DropdownMenuItem asChild>

            <Link
              to={`/shipments/${shipment.id}`}
            >
              <Eye className="mr-2 h-4 w-4" />

              View
            </Link>

          </DropdownMenuItem>

          <DropdownMenuItem asChild>

            <Link
              to={`/shipments/${shipment.id}/edit`}
            >
              <Pencil className="mr-2 h-4 w-4" />

              Edit
            </Link>

          </DropdownMenuItem>

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
              Delete Shipment
            </AlertDialogTitle>

            <AlertDialogDescription>

              This action cannot be undone.

              <br />

              <br />

              Shipment

              <strong>

                {" "}
                {shipment.shipmentNumber}

              </strong>

              {" "}will be permanently deleted.

            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </>
  );
}