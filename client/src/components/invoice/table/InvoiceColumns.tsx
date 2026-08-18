import {
  Eye,
  MoreHorizontal,
  Pencil,
  Printer,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import type {
  ColumnDef,
} from "@tanstack/react-table";

import { Button } from "../../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import InvoiceStatusBadge from "./InvoiceStatusBadge";

import type {
  Invoice,
  InvoiceStatus,
} from "../../../types/invoice";

interface Props {
  onDelete: (
    id: string
  ) => void;

  onStatusChange: (
    id: string,
    status: InvoiceStatus
  ) => void;

  statusUpdatingId?: string;
};

/*
=====================================
Format Invoice Date
=====================================

Invoice date is a calendar date.

We intentionally DO NOT use:

new Date(value)
toLocaleDateString()

because those methods can apply
timezone conversion and cause a date
such as:

2026-08-18

to appear as:

17/08/2026

Instead, we extract the date portion
directly from the backend value.
=====================================
*/

function formatInvoiceDate(
  value?: string | Date | null
): string {
  if (!value) {
    return "-";
  }

  let dateString: string;

  if (typeof value === "string") {
    /*
    Backend may return:

    2026-08-18
    or
    2026-08-18T00:00:00.000Z

    In both cases, the first 10
    characters represent the actual
    calendar date.
    */

    dateString = value.slice(0, 10);
  } else {
    /*
    If the value is already a Date,
    use its ISO representation and
    extract only the calendar portion.

    We still do NOT use local timezone
    formatting.
    */

    dateString = value
      .toISOString()
      .slice(0, 10);
  }

  const [year, month, day] =
    dateString.split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    return "-";
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex =
    Number(month) - 1;

  return `${day} ${
    months[monthIndex] ?? month
  } ${year}`;
}

export const invoiceColumns = ({
  onDelete,
  onStatusChange,
  statusUpdatingId,
}: Props): ColumnDef<Invoice>[] => [
  {
    accessorKey: "invoiceNumber",

    header: "Invoice No.",

    cell: ({ row }) => (
      <span className="font-semibold text-slate-900">
        {row.original.invoiceNumber}
      </span>
    ),
  },

  {
    accessorKey:
      "externalInvoiceNumber",

    header: "External Invoice No.",

    cell: ({ row }) => (
      <span className="text-slate-600">
        {row.original
          .externalInvoiceNumber ||
          "-"}
      </span>
    ),
  },

  {
    accessorFn: (row) =>
      row.shipment?.shipmentNumber,

    id: "shipment",

    header: "Shipment",

    cell: ({ row }) => (
      <span className="font-medium text-slate-700">
        {row.original.shipment
          ?.shipmentNumber ?? "-"}
      </span>
    ),
  },

  {
    accessorFn: (row) =>
      row.shipment?.client?.companyName,

    id: "client",

    header: "Client",

    cell: ({ row }) => (
      <span className="text-slate-600">
        {row.original.shipment
          ?.client?.companyName ??
          "-"}
      </span>
    ),
  },

  {
    accessorKey: "invoiceDate",

    header: "Date",

    cell: ({ row }) => (
      <span className="text-slate-600">
        {formatInvoiceDate(
          row.original.invoiceDate
        )}
      </span>
    ),
  },

  {
    accessorKey: "currency",

    header: "Currency",

    cell: ({ row }) => (
      <span className="font-medium text-slate-700">
        {row.original.currency}
      </span>
    ),
  },

  {
    accessorKey: "totalAmount",

    header: "Total",

    cell: ({ row }) => {
      const amount = Number(
        row.original.totalAmount
      );

      return (
        <span className="font-semibold text-slate-900">
          {amount.toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </span>
      );
    },
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => {
      const invoice =
        row.original;

      return (
        <InvoiceStatusBadge
          status={invoice.status}
          loading={
            statusUpdatingId ===
            invoice.id
          }
          onChange={(status) =>
            onStatusChange(
              invoice.id,
              status
            )
          }
        />
      );
    },
  },

  {
    id: "actions",

    header: "",

    enableSorting: false,

    cell: ({ row }) => {
      const invoice =
        row.original;

      return (
        <div className="flex justify-end">

          <DropdownMenu>

            <DropdownMenuTrigger
              asChild
            >
              <Button
                variant="ghost"
                size="icon"
                className="
                  h-9
                  w-9
                  rounded-lg
                  text-slate-500
                  hover:bg-slate-100
                  hover:text-slate-900
                "
              >
                <MoreHorizontal className="h-5 w-5" />

                <span className="sr-only">
                  Open invoice actions
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48"
            >

              <DropdownMenuItem
                asChild
              >
                <Link
                  to={`/invoices/${invoice.id}`}
                  className="flex cursor-pointer items-center"
                >
                  <Eye className="mr-2 h-4 w-4" />

                  View Invoice
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
              >
                <Link
                  to={`/invoices/${invoice.id}/edit`}
                  className="flex cursor-pointer items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />

                  Edit Invoice
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  window.print();
                }}
                className="cursor-pointer"
              >
                <Printer className="mr-2 h-4 w-4" />

                Print Invoice
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  onDelete(invoice.id)
                }
                className="
                  cursor-pointer
                  text-red-600
                  focus:bg-red-50
                  focus:text-red-700
                "
              >
                <Trash2 className="mr-2 h-4 w-4" />

                Delete Invoice
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>
      );
    },
  },
];