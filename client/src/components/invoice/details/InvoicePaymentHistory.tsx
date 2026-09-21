import {
  CalendarDays,
  CreditCard,
  FileText,
  Trash2,
} from "lucide-react";
import type { InvoicePayment, InvoicePaymentSummary } from "../../../api/invoice-payment.api";



interface Props {
  payments: InvoicePayment[];
  summary: InvoicePaymentSummary;
  currency: string;
  onDelete?: (
    payment: InvoicePayment
  ) => void;
}

export default function InvoicePaymentHistory({
  payments,
  summary,
  currency,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Payment History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {payments.length}{" "}
            {payments.length === 1
              ? "payment"
              : "payments"}{" "}
            recorded
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-slate-500">
            Total Paid
          </p>

          <p className="text-lg font-bold text-emerald-700">
            {formatMoney(
              summary.totalPaid,
              currency
            )}
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <CreditCard size={22} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No payments recorded
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Payments made against this invoice will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Paid For
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Method
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <FileText size={16} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {payment.description ||
                            "Invoice Payment"}
                        </p>

                        {payment.reference && (
                          <p className="text-xs text-slate-400">
                            Ref:{" "}
                            {payment.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {payment.invoiceItem
                        ?.description ||
                        "General invoice payment"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays
                        size={15}
                      />

                      {formatDate(
                        payment.paymentDate
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">
                      {formatPaymentMethod(
                        payment.paymentMethod
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-bold text-slate-900">
                      {formatMoney(
                        payment.amount,
                        currency
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(payment)
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete payment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatMoney(
  value: number | string,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(Number(value) || 0);
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(value));
}

function formatPaymentMethod(
  value?: string | null
) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}