import type { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { Button } from "../../components/ui/button";
import type { InvoiceItem } from "../../api/auth/invoice-item.api";



interface Props {
  onEdit: (
    item: InvoiceItem
  ) => void;

  onDelete: (
    item: InvoiceItem
  ) => void;
}

export function invoiceItemColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<InvoiceItem>[] {
  return [
    {
      accessorKey: "description",

      header: "Description",
    },

    {
      accessorKey: "quantity",

      header: "Quantity",
    },

    {
      accessorKey: "unitPrice",

      header: "Unit Price",

      cell: ({ row }) =>
        Number(
          row.original.unitPrice
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
    },

    {
      accessorKey: "total",

      header: "Total",

      cell: ({ row }) => (
        <span className="font-semibold">
          {Number(
            row.original.total
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
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

          <DropdownMenuContent align="end">
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