import {
  Package,
  Weight,
  Hash,
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
  value: number,
  currency: "NGN" | "USD" | "EUR"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export default function InvoiceItemsTable({
  invoice,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Package className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Invoice Items
          </h2>

        </div>

      </div>

      <div className="overflow-x-auto">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>Description</TableHead>

              <TableHead>HS Code</TableHead>

              <TableHead>Package</TableHead>

              <TableHead>Packages</TableHead>

              <TableHead>Gross Wt.</TableHead>

              <TableHead>Net Wt.</TableHead>

              <TableHead>Qty</TableHead>

              <TableHead>Unit</TableHead>

              <TableHead>Unit Price</TableHead>

              <TableHead>Total</TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {invoice.items.map((item) => (

              <TableRow key={item.id}>

                <TableCell className="font-medium">
                  {item.description}
                </TableCell>

                <TableCell>
                  {item.hsCode || "-"}
                </TableCell>

                <TableCell>
                  {item.packageType || "-"}
                </TableCell>

                <TableCell>
                  {item.packages ?? "-"}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">

                    <Weight className="h-3 w-3" />

                    {item.grossWeight ?? "-"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">

                    <Weight className="h-3 w-3" />

                    {item.netWeight ?? "-"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">

                    <Hash className="h-3 w-3" />

                    {item.quantity}
                  </div>
                </TableCell>

                <TableCell>
                  {item.unit || "-"}
                </TableCell>

                <TableCell>
                  {formatMoney(
                    item.unitPrice,
                    invoice.currency
                  )}
                </TableCell>

                <TableCell className="font-semibold">
                  {formatMoney(
                    item.total,
                    invoice.currency
                  )}
                </TableCell>

              </TableRow>

            ))}

            {/* Summary */}

            <TableRow className="bg-muted/40">

              <TableCell
                colSpan={9}
                className="text-right font-bold"
              >
                Subtotal
              </TableCell>

              <TableCell className="font-bold text-lg">
                {formatMoney(
                  invoice.subtotal,
                  invoice.currency
                )}
              </TableCell>

            </TableRow>

          </TableBody>

        </Table>

      </div>

    </div>
  );
}