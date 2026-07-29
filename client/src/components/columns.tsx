import type { ColumnDef } from "@tanstack/react-table";
import type { Exporter } from "../types/exporter.types";
import DataTableActions from "./data-table/DataTableActions";

export const exporterColumns: ColumnDef<Exporter>[] =
  [
    {
      accessorKey: "name",

      header: "Company",
    },

    {
      accessorKey: "contactPerson",

      header: "Contact",
    },

    {
      accessorKey: "phone",

      header: "Phone",
    },

    {
      accessorKey: "email",

      header: "Email",
    },

    {
      accessorKey: "address",

      header: "Address",
    },

   {
    id: "actions",

    header: "",

    cell: ({ row }) => (

        <DataTableActions

            onView={() => {

                console.log("View", row.original);

            }}

            onEdit={() => {

                console.log("Edit", row.original);

            }}

            onDelete={() => {

                console.log("Delete", row.original);

            }}

        />

    ),
},
  ];