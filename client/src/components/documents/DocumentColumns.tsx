import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import type { Document } from "../../types/document";

function formatFileSize(size?: number) {
  if (!size) return "-";

  const KB = 1024;
  const MB = KB * 1024;

  if (size >= MB) {
    return `${(size / MB).toFixed(2)} MB`;
  }

  if (size >= KB) {
    return `${(size / KB).toFixed(2)} KB`;
  }

  return `${size} B`;
}

function getBadgeVariant(type: string) {
  switch (type) {
    case "INVOICE":
      return "default";

    case "PACKING_LIST":
      return "secondary";

    case "NXP":
      return "outline";

    case "XF":
      return "destructive";

    case "CCI":
      return "secondary";

    case "E_NUMBER":
      return "default";

    case "TRANSIT_INVOICE":
      return "outline";

    default:
      return "secondary";
  }
}

interface Props {
  onEdit(document: Document): void;

  onDelete(document: Document): void;
}

export function getDocumentColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Document>[] {
  return [
    {
      accessorKey: "type",

      header: "Type",

      cell: ({ row }) => (
        <Badge
          variant={getBadgeVariant(
            row.original.type
          )}
        >
          {row.original.type.replaceAll(
            "_",
            " "
          )}
        </Badge>
      ),
    },

    {
      accessorKey: "shipment.shipmentNumber",

      header: "Shipment",

      cell: ({ row }) =>
        row.original.shipment
          ?.shipmentNumber ?? "-",
    },

    {
      accessorKey: "fileName",

      header: "File",

      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.fileName}
        </span>
      ),
    },

    {
      accessorKey: "fileSize",

      header: "Size",

      cell: ({ row }) =>
        formatFileSize(
          row.original.fileSize
        ),
    },

    {
      accessorKey: "uploadedAt",

      header: "Uploaded",

      cell: ({ row }) =>
        format(
          new Date(
            row.original.uploadedAt
          ),
          "dd MMM yyyy"
        ),
    },

    {
      id: "actions",

      header: "",

      enableSorting: false,

      cell: ({ row }) => {
        const document = row.original;

        return (
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
                asChild
              >
                <Link
                  to={`/documents/${document.id}`}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  window.open(
                    document.fileUrl,
                    "_blank"
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onEdit(document)
                }
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={() =>
                  onDelete(document)
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