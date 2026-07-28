import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Building2,
} from "lucide-react";

import { Badge } from "../ui/badge";

import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import type { Client } from "../../types/client.types";
import type { ColumnDef } from "@tanstack/react-table";

interface Props {
  onView: (client: Client) => void;

  onEdit: (client: Client) => void;

  onDelete: (id: string) => void;
}

export function clientColumns({
  onView,
  onEdit,
  onDelete,
}: Props): ColumnDef<Client>[] {
  return [
    {
      accessorKey: "companyName",

      header: "Client",

      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="font-medium">
                {client.companyName}
              </p>

              <p className="text-xs text-muted-foreground">
                {client.clientCode}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "clientType",

      header: "Type",

      cell: ({ row }) => {
        const type =
          row.original.clientType;

        return (
          <Badge
            variant={
              type === "COMPANY"
                ? "default"
                : "secondary"
            }
          >
            {type}
          </Badge>
        );
      },
    },

    {
      accessorKey: "contactPerson",

      header: "Contact",

      cell: ({ row }) => (
        <div>
          <p>
            {row.original.contactPerson ??
              "-"}
          </p>

          <p className="text-xs text-muted-foreground">
            {row.original.email}
          </p>
        </div>
      ),
    },

    {
      accessorKey: "phone",

      header: "Phone",
    },

    {
      accessorKey: "country",

      header: "Country",
    },

    {
      id: "allocations",

      header: "Allocations",

      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original._count
            ?.allocations ?? 0}
        </Badge>
      ),
    },

    {
      accessorKey: "isActive",

      header: "Status",

      cell: ({ row }) => (
        <Badge
          className={
            row.original.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        >
          {row.original.isActive
            ? "Active"
            : "Inactive"}
        </Badge>
      ),
    },

    {
      id: "actions",

      enableHiding: false,

      cell: ({ row }) => {
        const client = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
            >
              <Button
                variant="ghost"
                size="icon"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
            >
              <DropdownMenuItem
                onClick={() =>
                  onView(client)
                }
              >
                <Eye className="mr-2 h-4 w-4" />

                View
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onEdit(client)
                }
              >
                <Pencil className="mr-2 h-4 w-4" />

                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() =>
                  onDelete(client.id)
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