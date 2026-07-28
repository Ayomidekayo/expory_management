import type { ColumnDef } from "@tanstack/react-table";


import InvoiceStatusBadge from "./InvoiceStatusBadge";
import type { Invoice } from "../../../types";
import InvoiceActions from "./InvoiceAction";

export const invoiceColumns: ColumnDef<Invoice>[] =
  [
    {
      accessorKey:
        "invoiceNumber",

      header: "Invoice No",
    },

    {
      accessorKey:
        "shipment.shipmentNumber",

      header: "Shipment",
    },

    {
      accessorFn: (row) =>
        row.shipment.client
          .companyName,

      header: "Client",
    },

    {
      accessorKey:
        "currency",

      header: "Currency",
    },

    {
      accessorKey:
        "totalAmount",

      header: "Total",

      cell: ({ row }) =>
        Number(
          row.original.totalAmount
        ).toLocaleString(),
    },

    {
      accessorKey:
        "status",

      header: "Status",

      cell: ({ row }) => (
        <InvoiceStatusBadge
          status={
            row.original.status
          }
        />
      ),
    },

    {
      accessorKey:
        "invoiceDate",

      header: "Invoice Date",

      cell: ({ row }) =>
        new Date(
          row.original.invoiceDate
        ).toLocaleDateString(),
    },

    {
      id: "actions",

      cell: ({ row }) => (
        <InvoiceActions
          invoice={row.original}
        />
      ),
    },
  ];