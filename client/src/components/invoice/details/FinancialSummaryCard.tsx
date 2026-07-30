import {
  Calculator,
  Truck,
  DollarSign,
} from "lucide-react";
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

function Row({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-4 ${
        highlight
          ? "border-t text-xl font-bold"
          : "border-b"
      }`}
    >
      <div className="flex items-center gap-3">

        {icon}

        <span>{label}</span>

      </div>

      <span>{value}</span>

    </div>
  );
}

export default function FinancialSummaryCard({
  invoice,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <h2 className="text-lg font-semibold">
          Financial Summary
        </h2>

      </div>

      <div className="p-5">

        <Row
          icon={
            <Calculator className="h-5 w-5 text-blue-600" />
          }
          label="Subtotal"
          value={formatMoney(
            invoice.subtotal,
            invoice.currency
          )}
        />

        <Row
          icon={
            <Truck className="h-5 w-5 text-orange-600" />
          }
          label="Freight"
          value={formatMoney(
            invoice.freight,
            invoice.currency
          )}
        />

        <Row
          icon={
            <DollarSign className="h-5 w-5 text-green-600" />
          }
          label="Grand Total"
          value={formatMoney(
            invoice.totalAmount,
            invoice.currency
          )}
          highlight
        />

      </div>

    </div>
  );
}