import {
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  WalletCards,
} from "lucide-react";

import type { InvoicePaymentSummary } from "../../../api/invoice-payment.api";

interface Props {
  summary: InvoicePaymentSummary;
  currency: string;
}

function formatMoney(
  value: number | string,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default function InvoicePaymentSummaryCard({
  summary,
  currency,
}: Props) {
  const isPaid =
    summary.status === "PAID";

  const isPartial =
    summary.status === "PARTIALLY_PAID";

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track payments and outstanding balance.
          </p>
        </div>

        {/* Payment Status */}
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            isPaid
              ? "bg-emerald-50 text-emerald-700"
              : isPartial
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {isPaid ? (
            <CheckCircle2 size={15} />
          ) : isPartial ? (
            <AlertCircle size={15} />
          ) : (
            <WalletCards size={15} />
          )}

          {isPaid
            ? "Paid"
            : isPartial
            ? "Partially Paid"
            : "Unpaid"}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <SummaryItem
          label="Invoice Total"
          value={formatMoney(
            summary.invoiceTotal,
            currency
          )}
          icon={
            <CircleDollarSign size={18} />
          }
        />

        <SummaryItem
          label="Total Paid"
          value={formatMoney(
            summary.totalPaid,
            currency
          )}
          icon={
            <CheckCircle2 size={18} />
          }
        />

        <SummaryItem
          label="Outstanding"
          value={formatMoney(
            summary.outstandingBalance,
            currency
          )}
          icon={
            <WalletCards size={18} />
          }
        />
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}