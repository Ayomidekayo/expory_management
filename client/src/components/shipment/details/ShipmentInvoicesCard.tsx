import {
  CreditCard,
  ExternalLink,
  FileText,
} from "lucide-react";

import { Link } from "react-router-dom";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

export default function ShipmentInvoicesCard({
  shipment,
}: Props) {
  const invoices = shipment.invoices ?? [];

  const totalsByCurrency = invoices.reduce<
    Record<string, number>
  >((totals, invoice) => {
    const currency = invoice.currency;

    totals[currency] =
      (totals[currency] ?? 0) +
      Number(invoice.totalAmount || 0);

    return totals;
  }, {});

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Invoices
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                {invoices.length}{" "}
                {invoices.length === 1
                  ? "invoice"
                  : "invoices"}{" "}
                linked to this shipment
              </p>
            </div>
          </div>

          {/* Totals */}
          {invoices.length > 0 && (
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Invoice Value
              </p>

              <div className="mt-1 space-y-0.5">
                {Object.entries(
                  totalsByCurrency
                ).map(([currency, amount]) => (
                  <p
                    key={currency}
                    className="text-lg font-bold text-slate-900"
                  >
                    {currency}{" "}
                    {amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {invoices.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/40 px-6 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>

            <p className="text-sm font-semibold text-slate-900">
              No invoices
            </p>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              No invoices have been linked to this
              shipment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="group flex flex-col gap-4 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Invoice Information */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <FileText className="h-4 w-4 text-slate-600" />
                  </div>

                  <div className="min-w-0">
                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="block truncate text-sm font-semibold text-slate-900 transition-colors hover:text-primary"
                    >
                      {invoice.invoiceNumber}
                    </Link>

                    {invoice.externalInvoiceNumber && (
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        External:{" "}
                        {invoice.externalInvoiceNumber}
                      </p>
                    )}

                    <p className="mt-0.5 text-xs text-slate-500">
                      {new Date(
                        invoice.invoiceDate
                      ).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>

                {/* Amount & Action */}
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {Number(
                        invoice.totalAmount
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>

                    <p className="text-xs font-medium text-slate-500">
                      {invoice.currency}
                    </p>
                  </div>

                  <Link
                    to={`/invoices/${invoice.id}`}
                    aria-label={`View invoice ${invoice.invoiceNumber}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}