import {
  Package,
  Weight,
  Hash,
  MessageSquare,
  CalendarDays,
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

/*
|--------------------------------------------------------------------------
| Extended invoice item type
|--------------------------------------------------------------------------
| itemDate is included here because it may not yet exist in the frontend
| InvoiceItem type. Once you add itemDate to your main InvoiceItem type,
| you can remove this extension and use the normal type directly.
*/
type InvoiceItemWithDate = NonNullable<
  Invoice["items"]
>[number] & {
  itemDate?: string | Date | null;
};

/*
|--------------------------------------------------------------------------
| Format Money
|--------------------------------------------------------------------------
*/
function formatMoney(
  value: number | string | null | undefined,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

/*
|--------------------------------------------------------------------------
| Format Item Date
|--------------------------------------------------------------------------
| We intentionally take only YYYY-MM-DD from a string so that:
|
| 2026-09-22T00:00:00.000Z
|
| does not become the previous day because of browser timezone conversion.
|--------------------------------------------------------------------------
*/
function formatItemDate(
  value?: string | Date | null
): string {
  if (!value) {
    return "-";
  }

  let dateString: string;

  if (typeof value === "string") {
    dateString = value.slice(0, 10);
  } else {
    dateString = value
      .toISOString()
      .slice(0, 10);
  }

  const parts = dateString.split("-");

  if (parts.length !== 3) {
    return "-";
  }

  const [year, month, day] = parts;

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

  if (
    !year ||
    !day ||
    monthIndex < 0 ||
    monthIndex > 11
  ) {
    return "-";
  }

  return `${day} ${
    months[monthIndex]
  } ${year}`;
}

/*
|--------------------------------------------------------------------------
| Invoice Items Table
|--------------------------------------------------------------------------
*/
export default function InvoiceItemsTable({
  invoice,
}: Props) {
  const items =
    (invoice.items ?? []) as InvoiceItemWithDate[];

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* ================================================================
          HEADER
      ================================================================= */}

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

      {/* ================================================================
          TABLE
      ================================================================= */}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">

              {/* DATE */}
              <TableHead className="whitespace-nowrap">
                Item Date
              </TableHead>

              {/* DESCRIPTION */}
              <TableHead className="whitespace-nowrap">
                Description
              </TableHead>

              {/* HS CODE */}
              <TableHead className="whitespace-nowrap">
                HS Code
              </TableHead>

              {/* PACKAGE */}
              <TableHead className="whitespace-nowrap">
                Package
              </TableHead>

              {/* PACKAGES */}
              <TableHead className="whitespace-nowrap">
                Packages
              </TableHead>

              {/* GROSS WEIGHT */}
              <TableHead className="whitespace-nowrap">
                Gross Wt.
              </TableHead>

              {/* NET WEIGHT */}
              <TableHead className="whitespace-nowrap">
                Net Wt.
              </TableHead>

              {/* QUANTITY */}
              <TableHead className="whitespace-nowrap">
                Qty
              </TableHead>

              {/* UNIT */}
              <TableHead className="whitespace-nowrap">
                Unit
              </TableHead>

              {/* UNIT PRICE */}
              <TableHead className="whitespace-nowrap">
                Unit Price
              </TableHead>

              {/* TOTAL */}
              <TableHead className="whitespace-nowrap">
                Total
              </TableHead>

              {/* REMARKS */}
              <TableHead className="whitespace-nowrap">
                Remarks
              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {/* ==========================================================
                ITEMS
            =========================================================== */}

            {items.length > 0 ? (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50/70"
                >

                  {/* ====================================================
                      ITEM DATE
                  ===================================================== */}

                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <CalendarDays className="h-3.5 w-3.5 text-blue-600" />

                      <span>
                        {formatItemDate(
                          item.itemDate
                        )}
                      </span>
                    </div>
                  </TableCell>

                  {/* ====================================================
                      DESCRIPTION
                  ===================================================== */}

                  <TableCell className="min-w-[220px]">
                    <div className="font-medium text-slate-900">
                      {item.description}
                    </div>
                  </TableCell>

                  {/* ====================================================
                      HS CODE
                  ===================================================== */}

                  <TableCell>
                    {item.hsCode || "-"}
                  </TableCell>

                  {/* ====================================================
                      PACKAGE TYPE
                  ===================================================== */}

                  <TableCell>
                    {item.packageType || "-"}
                  </TableCell>

                  {/* ====================================================
                      PACKAGES
                  ===================================================== */}

                  <TableCell>
                    {item.packages ?? "-"}
                  </TableCell>

                  {/* ====================================================
                      GROSS WEIGHT
                  ===================================================== */}

                  <TableCell>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Weight className="h-3.5 w-3.5 text-muted-foreground" />

                      {item.grossWeight ?? "-"}
                    </div>
                  </TableCell>

                  {/* ====================================================
                      NET WEIGHT
                  ===================================================== */}

                  <TableCell>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Weight className="h-3.5 w-3.5 text-muted-foreground" />

                      {item.netWeight ?? "-"}
                    </div>
                  </TableCell>

                  {/* ====================================================
                      QUANTITY
                  ===================================================== */}

                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />

                      {Number(
                        item.quantity
                      )}
                    </div>
                  </TableCell>

                  {/* ====================================================
                      UNIT
                  ===================================================== */}

                  <TableCell>
                    {item.unit || "-"}
                  </TableCell>

                  {/* ====================================================
                      UNIT PRICE
                  ===================================================== */}

                  <TableCell className="whitespace-nowrap">
                    {formatMoney(
                      item.unitPrice,
                      invoice.currency
                    )}
                  </TableCell>

                  {/* ====================================================
                      TOTAL
                  ===================================================== */}

                  <TableCell className="whitespace-nowrap font-semibold text-slate-900">
                    {formatMoney(
                      item.total,
                      invoice.currency
                    )}
                  </TableCell>

                  {/* ====================================================
                      REMARKS
                  ===================================================== */}

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

              /* ========================================================
                 EMPTY STATE
              ========================================================= */

              <TableRow>
                <TableCell
                  colSpan={12}
                  className="h-32 text-center text-muted-foreground"
                >
                  No invoice items found.
                </TableCell>
              </TableRow>

            )}

            {/* ==========================================================
                SUBTOTAL
            =========================================================== */}

            {items.length > 0 && (
              <TableRow className="bg-slate-50">

                <TableCell
                  colSpan={10}
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