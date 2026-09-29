import { useState } from "react";
import { Link } from "react-router-dom";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { toast } from "sonner";
import { useDeleteShipment } from "../../hooks/shipments/useDeleteShipment";
import type { Shipment } from "../../types/shipment.types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import ChangeShipmentStatusDialog from "./section/ChangeShipmentStatusDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";


interface Props {
  shipment: Shipment;
}

export default function ShipmentRowActions({
  shipment,
}: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const deleteShipment = useDeleteShipment();

  function handleDelete() {
    deleteShipment.mutate(shipment.id, {
      onSuccess() {
        toast.success("Shipment deleted successfully.");
        setDeleteOpen(false);
      },
    });
  }

  return (
    <>
      {/* =====================================
          ACTION MENU
      ===================================== */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label={`Actions for ${shipment.shipmentNumber}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52"
        >
          {/* VIEW */}

          <DropdownMenuItem asChild>
            <Link
              to={`/shipments/${shipment.id}`}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Shipment
            </Link>
          </DropdownMenuItem>

          {/* EDIT */}

          <DropdownMenuItem asChild>
            <Link
              to={`/shipments/${shipment.id}/edit`}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Shipment
            </Link>
          </DropdownMenuItem>

          {/* CHANGE STATUS */}

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              setStatusOpen(true);
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Change Status
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* DELETE */}

          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onSelect={(event) => {
              event.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Shipment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* =====================================
          CHANGE STATUS DIALOG
      ===================================== */}

      <ChangeShipmentStatusDialog
        shipment={shipment}
        open={statusOpen}
        onOpenChange={setStatusOpen}
      />

      {/* =====================================
          DELETE CONFIRMATION
      ===================================== */}

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
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

              Shipment{" "}
              <strong>
                {shipment.shipmentNumber}
              </strong>{" "}
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteShipment.isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteShipment.isPending}
              onClick={handleDelete}
            >
              {deleteShipment.isPending
                ? "Deleting..."
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}