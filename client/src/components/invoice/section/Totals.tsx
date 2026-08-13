import {
  Calculator,
  Truck,
  DollarSign,
} from "lucide-react";

interface Props {
  subtotal: number;
  freight: number;
  total: number;
  currency?: "NGN" | "USD" | "EUR";
}

function formatMoney(
  value: number,
  currency?: "NGN" | "USD" | "EUR"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "NGN",
  }).format(value);
}

function SummaryRow({
  icon,
  label,
  value,
  bold = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 px-5 py-4 ${
        bold
          ? "border-t border-slate-200 bg-slate-50"
          : "border-b border-slate-100"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            bold
              ? "bg-primary/10 text-primary"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </div>

        <span
          className={
            bold
              ? "font-semibold text-slate-900"
              : "text-sm font-medium text-slate-600"
          }
        >
          {label}
        </span>
      </div>

      <span
        className={`shrink-0 text-right ${
          bold
            ? "text-lg font-bold text-slate-900"
            : "text-sm font-semibold text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function Totals({
  subtotal,
  freight,
  total,
  currency,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <h2 className="text-base font-semibold text-slate-900">
          Invoice Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Financial summary of this invoice.
        </p>
      </div>

      {/* Summary */}

      <div className="p-5">
        <div className="ml-auto w-full max-w-lg overflow-hidden rounded-lg border border-slate-200">
          <SummaryRow
            icon={
              <Calculator className="h-4 w-4" />
            }
            label="Subtotal"
            value={formatMoney(
              subtotal,
              currency
            )}
          />

          <SummaryRow
            icon={
              <Truck className="h-4 w-4" />
            }
            label="Freight"
            value={formatMoney(
              freight,
              currency
            )}
          />

          <SummaryRow
            icon={
              <DollarSign className="h-4 w-4" />
            }
            label="Grand Total"
            value={formatMoney(
              total,
              currency
            )}
            bold
          />
        </div>
      </div>
    </div>
  );
}