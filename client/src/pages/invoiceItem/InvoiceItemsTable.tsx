import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { toast } from "sonner";

import { Button } from "../../components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { useDeleteInvoiceItem } from "../../hooks/invoiceItems/useDeleteInvoiceItem";
import { useInvoiceItems } from "../../hooks/invoiceItems/useInvoiceItems";
import type { InvoiceItem } from "../../api/auth/invoice-item.api";
import { invoiceItemColumns } from "./InvoiceItemColumns";
import InvoiceItemDialog from "./InvoiceItemDialog";
import DeleteDialog from "../../components/common/DeleteDialog";

interface Props {
  invoiceId: string;
}

export default function InvoiceItemsTable({
  invoiceId,
}: Props) {
  const { data = [], isLoading } =
    useInvoiceItems(invoiceId);

  const deleteMutation =
    useDeleteInvoiceItem();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<InvoiceItem | null>(null);

  const [deleting, setDeleting] =
    useState<InvoiceItem | null>(null);

  const columns = useMemo(
    () =>
      invoiceItemColumns({
        onEdit(item) {
          setEditing(item);
          setDialogOpen(true);
        },

        onDelete(item) {
          setDeleting(item);
        },
      }),
    []
  );

  const table = useReactTable({
    data,

    columns,

    getCoreRowModel:
      getCoreRowModel(),
  });

  return (
    <>
      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle>
            Invoice Items
          </CardTitle>

          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            + Add Item
          </Button>

        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>

              {table
                .getHeaderGroups()
                .map((group) => (
                  <TableRow
                    key={group.id}
                  >
                    {group.headers.map(
                      (header) => (
                        <TableHead
                          key={header.id}
                        >
                          {flexRender(
                            header.column
                              .columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                ))}

            </TableHeader>

            <TableBody>

              {isLoading ? (

                <TableRow>

                  <TableCell
                    colSpan={
                      columns.length
                    }
                    className="text-center py-10"
                  >
                    Loading...
                  </TableCell>

                </TableRow>

              ) : table
                  .getRowModel()
                  .rows.length ? (

                table
                  .getRowModel()
                  .rows.map((row) => (
                    <TableRow
                      key={row.id}
                    >
                      {row
                        .getVisibleCells()
                        .map((cell) => (
                          <TableCell
                            key={
                              cell.id
                            }
                          >
                            {flexRender(
                              cell
                                .column
                                .columnDef
                                .cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))

              ) : (

                <TableRow>

                  <TableCell
                    colSpan={
                      columns.length
                    }
                    className="text-center py-10"
                  >
                    No invoice items found.
                  </TableCell>

                </TableRow>

              )}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      <InvoiceItemDialog
        invoiceId={invoiceId}
        item={editing ?? undefined}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setEditing(null);
          }
        }}
      />

      <DeleteDialog
  open={!!deleting}
  title="Delete Invoice Item"
  description={`Delete "${deleting?.description}"?`}
  loading={deleteMutation.isPending}
  onOpenChange={(open) => {
    if (!open) {
      setDeleting(null);
    }
  }}
  onConfirm={() => {
    if (!deleting) return;

    deleteMutation.mutate(deleting.id, {
      onSuccess() {
        toast.success(
          "Invoice item deleted successfully."
        );

        setDeleting(null);
      },
    });
  }}
/>
    </>
  );
}