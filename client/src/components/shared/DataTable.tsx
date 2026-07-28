import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];

  data: TData[];

  loading?: boolean;

  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
}: Props<TData, TValue>) {
  const [sorting, setSorting] =
    useState<SortingState>([]);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,

    columns,

    state: {
      sorting,
      columnFilters,
    },

    onSortingChange: setSorting,

    onColumnFiltersChange:
      setColumnFilters,

    getCoreRowModel:
      getCoreRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),

    getSortedRowModel:
      getSortedRowModel(),
  });

  return (
    <div className="space-y-4">

      <div className="rounded-xl border bg-white shadow-sm">

        <Table>

          <TableHeader>

            {table
              .getHeaderGroups()
              .map((group) => (
                <TableRow key={group.id}>

                  {group.headers.map(
                    (header) => (
                      <TableHead
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column
                                .columnDef
                                .header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  )}

                </TableRow>
              ))}

          </TableHeader>

          <TableBody>

            {loading ? (

              <TableRow>

                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  Loading...
                </TableCell>

              </TableRow>

            ) : table.getRowModel().rows.length ? (

              table
                .getRowModel()
                .rows
                .map((row) => (
                  <TableRow key={row.id}>

                    {row
                      .getVisibleCells()
                      .map((cell) => (
                        <TableCell
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column
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
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </div>

      <div className="flex items-center justify-end gap-2">

        <Button
          variant="outline"
          size="sm"
          disabled={
            !table.getCanPreviousPage()
          }
          onClick={() =>
            table.previousPage()
          }
        >
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page{" "}
          {table.getState().pagination.pageIndex +
            1}{" "}
          of {table.getPageCount()}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={
            !table.getCanNextPage()
          }
          onClick={() =>
            table.nextPage()
          }
        >
          Next
        </Button>

      </div>

    </div>
  );
}