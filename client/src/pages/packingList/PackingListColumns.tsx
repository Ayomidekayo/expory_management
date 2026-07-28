
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "../../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import type { PackingList } from "../../types";



interface Props {
  onView: (packingList: PackingList) => void;

  onEdit: (packingList: PackingList) => void;

  onDelete: (packingList: PackingList) => void;
}

export function packingListColumns({
  onView,
  onEdit,
  onDelete,
}: Props): ColumnDef<PackingList>[] {
  return [
    {
      accessorKey: "packingListNumber",

      header: "Packing List No.",

      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.packingListNumber ?? "-"}
        </span>
      ),
    },

    {
      accessorKey: "shipment.shipmentNumber",

      header: "Shipment",

      cell: ({ row }) => (
        <span>
          {row.original.shipment.shipmentNumber}
        </span>
      ),
    },

    {
      accessorKey: "grossWeight",

      header: "Gross Weight",

      cell: ({ row }) => (
        <span>
          {Number(
            row.original.grossWeight
          ).toLocaleString()}{" "}
          kg
        </span>
      ),
    },

    {
      accessorKey: "netWeight",

      header: "Net Weight",

      cell: ({ row }) => (
        <span>
          {Number(
            row.original.netWeight
          ).toLocaleString()}{" "}
          kg
        </span>
      ),
    },

    {
      accessorKey: "createdAt",

      header: "Created",

      cell: ({ row }) =>
        format(
          new Date(
            row.original.createdAt
          ),
          "dd MMM yyyy"
        ),
    },

    {
      id: "actions",

      enableSorting: false,

      cell: ({ row }) => {
        const packingList =
          row.original;

        return (
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
              <DropdownMenuItem
                onClick={() =>
                  onView(packingList)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onEdit(packingList)
                }
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() =>
                  onDelete(packingList)
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}