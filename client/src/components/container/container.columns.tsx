import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Container } from "../../types/container.type";
import type { ColumnDef } from "@tanstack/react-table";

interface Props {
  onEdit: (container: Container) => void;
  onDelete: (id: string) => void;
}

export const containerColumns = ({
  onEdit,
  onDelete,
}: Props): ColumnDef<Container>[] => [
  {
    accessorKey: "containerNumber",
    header: "Container",
  },

  {
    accessorFn: (row) => row.shipment.shipmentNumber,
    header: "Shipment",
  },

  {
    accessorKey: "containerType",
    header: "Type",

    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.containerType}</Badge>
    ),
  },

  {
    accessorKey: "containerSize",
    header: "Size",
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => {
      const status = row.original.status;

      let className = "";

      switch (status) {
        case "EMPTY":
          className = "bg-gray-100 text-gray-700";
          break;

        case "LOADED":
          className = "bg-blue-100 text-blue-700";
          break;

        case "IN_TRANSIT":
          className = "bg-yellow-100 text-yellow-700";
          break;

        case "DELIVERED":
          className = "bg-green-100 text-green-700";
          break;

        default:
          className = "";
      }

      return <Badge className={className}>{status}</Badge>;
    },
  },

  {
    id: "actions",

    header: "Actions",

    cell: ({ row }) => {
      const container = row.original;

      return (
        <div className="flex gap-2">
          <Link to={`/containers/${container.id}`}>
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(container)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(container.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
