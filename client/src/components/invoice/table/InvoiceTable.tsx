import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { invoiceColumns } from "./InvoiceColumns";

import type {
  Invoice,
  InvoiceStatus,
} from "../../../types/invoice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface Props {
  invoices: Invoice[];

  onDelete: (id: string) => void;

  onStatusChange: (
    id: string,
    status: InvoiceStatus
  ) => void;

  statusUpdatingId?: string;

  // Pagination information
  currentPage?: number;
  pageLimit?: number;
}

export default function InvoiceTable({
  invoices,
  onDelete,
  onStatusChange,
  statusUpdatingId,
  currentPage = 1,
  pageLimit = 10,
}: Props) {
  const columns = invoiceColumns({
    onDelete,
    onStatusChange,
    statusUpdatingId,
  });

  const table = useReactTable({
    data: invoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>

          {/* HEADER */}

          <TableHeader>
            {table
              .getHeaderGroups()
              .map((group) => (
                <TableRow
                  key={group.id}
                  className="bg-slate-50"
                >
                  {/* S/N */}

                  <TableHead
                    className="
                      w-[70px]
                      whitespace-nowrap
                      px-4
                      py-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    S/N
                  </TableHead>

                  {group.headers.map(
                    (header) => (
                      <TableHead
                        key={header.id}
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
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

          {/* BODY */}

          <TableBody>
            {table.getRowModel().rows.length >
            0 ? (
              table
                .getRowModel()
                .rows.map((row, index) => {
                  /*
                   * Continuous S/N across pages.
                   *
                   * Page 1:
                   * 1 - 10
                   *
                   * Page 2:
                   * 11 - 20
                   *
                   * Page 3:
                   * 21 - 30
                   */

                  const serialNumber =
                    (currentPage - 1) *
                      pageLimit +
                    index +
                    1;

                  return (
                    <TableRow
                      key={row.id}
                      className="
                        transition-colors
                        hover:bg-slate-50/70
                      "
                    >
                      {/* S/N */}

                      <TableCell
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          font-medium
                          text-slate-500
                        "
                      >
                        {serialNumber}
                      </TableCell>

                      {row
                        .getVisibleCells()
                        .map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="
                              whitespace-nowrap
                              px-4
                              py-3
                            "
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
                  );
                })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + 1
                  }
                  className="
                    h-32
                    text-center
                    text-slate-500
                  "
                >
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}