import {
  Package,
  Weight,
  Hash,
  MessageSquare,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import type { Invoice } from "../../../types/invoice";

interface Props {
  invoice: Invoice;
}

function formatMoney(
  value: number | string | null | undefined,
  currency: "NGN" | "USD" | "EUR"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default function InvoiceItemsTable({
  invoice,
}: Props) {
  const items = invoice.items ?? [];

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* HEADER */}

      <div className="border-b p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />

            <div>
              <h2 className="text-lg font-semibold">
                Invoice Items
              </h2>

              <p className="text-sm text-muted-foreground">
                {items.length}{" "}
                {items.length === 1
                  ? "item"
                  : "items"}{" "}
                on this invoice
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="whitespace-nowrap">
                Description
              </TableHead>

              <TableHead className="whitespace-nowrap">
                HS Code
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Package
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Packages
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Gross Wt.
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Net Wt.
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Qty
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Unit
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Unit Price
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Total
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Remarks
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50/70"
                >
                  {/* DESCRIPTION */}

                  <TableCell className="min-w-[220px]">
                    <div className="font-medium text-slate-900">
                      {item.description}
                    </div>
                  </TableCell>

                  {/* HS CODE */}

                  <TableCell>
                    {item.hsCode || "-"}
                  </TableCell>

                  {/* PACKAGE TYPE */}

                  <TableCell>
                    {item.packageType || "-"}
                  </TableCell>

                  {/* PACKAGES */}

                  <TableCell>
                    {item.packages ?? "-"}
                  </TableCell>

                  {/* GROSS WEIGHT */}

                  <TableCell>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Weight className="h-3.5 w-3.5 text-muted-foreground" />

                      {item.grossWeight ?? "-"}
                    </div>
                  </TableCell>

                  {/* NET WEIGHT */}

                  <TableCell>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Weight className="h-3.5 w-3.5 text-muted-foreground" />

                      {item.netWeight ?? "-"}
                    </div>
                  </TableCell>

                  {/* QUANTITY */}

                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />

                      {Number(item.quantity)}
                    </div>
                  </TableCell>

                  {/* UNIT */}

                  <TableCell>
                    {item.unit || "-"}
                  </TableCell>

                  {/* UNIT PRICE */}

                  <TableCell className="whitespace-nowrap">
                    {formatMoney(
                      item.unitPrice,
                      invoice.currency
                    )}
                  </TableCell>

                  {/* TOTAL */}

                  <TableCell className="whitespace-nowrap font-semibold text-slate-900">
                    {formatMoney(
                      item.total,
                      invoice.currency
                    )}
                  </TableCell>

                  {/* REMARKS */}

                  <TableCell className="min-w-[180px]">
                    {item.remarks ? (
                      <div className="flex items-start gap-1.5 text-sm text-slate-600">
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                        <span>
                          {item.remarks}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        -
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="h-32 text-center text-muted-foreground"
                >
                  No invoice items found.
                </TableCell>
              </TableRow>
            )}

            {/* SUBTOTAL */}

            {items.length > 0 && (
              <TableRow className="bg-slate-50">
                <TableCell
                  colSpan={9}
                  className="text-right font-semibold"
                >
                  Subtotal
                </TableCell>

                <TableCell className="text-lg font-bold text-slate-900">
                  {formatMoney(
                    invoice.subtotal,
                    invoice.currency
                  )}
                </TableCell>

                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}