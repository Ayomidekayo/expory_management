import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

import type { Shipment } from "../../types/shipment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

interface Props {
  onView: (shipment: Shipment) => void;

  onEdit: (shipment: Shipment) => void;

  onDelete: (shipment: Shipment) => void;
}

function getStatusVariant(status: Shipment["status"]) {
  switch (status) {
    case "COMPLETED":
      return "default";

    case "PENDING":
      return "secondary";

    case "IN_TRANSIT":
      return "outline";

    case "CANCELLED":
      return "destructive";

    default:
      return "secondary";
  }
}

export function shipmentColumns({
  onView,
  onEdit,
  onDelete,
}: Props): ColumnDef<Shipment>[] {
  return [
    {
      accessorKey: "shipmentNumber",

      header: "Shipment No.",
    },

    {
      accessorKey: "shipmentDate",

      header: "Shipment Date",

      cell: ({ row }) =>
        format(new Date(row.original.shipmentDate), "dd MMM yyyy"),
    },

    {
      accessorFn: (row) => row.exporter.name,

      header: "Exporter",
    },

    {
      accessorFn: (row) => row.consignee.name,

      header: "Consignee",
    },

    {
      accessorKey: "status",

      header: "Status",

      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },

    {
      id: "actions",

      header: "",

      cell: ({ row }) => {
        const shipment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(shipment)}>
                View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEdit(shipment)}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(shipment)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
