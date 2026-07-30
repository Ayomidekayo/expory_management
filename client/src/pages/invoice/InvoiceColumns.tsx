
import { MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import type { Invoice } from "../../types/invoice";


interface Props {
  onView: (invoice: Invoice) => void;

  onEdit: (invoice: Invoice) => void;

  onDelete: (invoice: Invoice) => void;
}

export function invoiceColumns({
  onView,
  onEdit,
  onDelete,
}: Props): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: "invoiceNumber",

      header: "Invoice No.",
    },

    {
      accessorFn: (row) =>
        row.shipment.shipmentNumber,

      id: "shipment",

      header: "Shipment",
    },

    {
      accessorKey: "invoiceDate",

      header: "Invoice Date",

      cell: ({ row }) =>
        dayjs(row.original.invoiceDate).format(
          "DD MMM YYYY"
        ),
    },

    {
      accessorKey: "currency",

      header: "Currency",
    },

    {
      accessorKey: "numberOfTrucks",

      header: "Trucks",
    },

    {
      accessorKey: "freight",

      header: "Freight",

      cell: ({ row }) =>
        Number(
          row.original.freight
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
    },

    {
      accessorKey: "totalAmount",

      header: "Total",

      cell: ({ row }) =>
        Number(
          row.original.totalAmount
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
    },

    {
      id: "actions",

      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
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
            <DropdownMenuItem
              onClick={() =>
                onView(row.original)
              }
            >
              View
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                onEdit(row.original)
              }
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600"
              onClick={() =>
                onDelete(row.original)
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}