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
  const invoices =
    shipment.invoices ?? [];

  /*
   * Group totals by currency.
   *
   * This is safer than adding USD + EUR + NGN
   * together.
   */
  const totalsByCurrency =
    invoices.reduce<
      Record<string, number>
    >((totals, invoice) => {
      const currency =
        invoice.currency;

      totals[currency] =
        (totals[currency] ?? 0) +
        Number(invoice.totalAmount || 0);

      return totals;
    }, {});

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b p-5">

        <div className="flex items-start justify-between gap-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Invoices
              </h2>

              <p className="text-sm text-muted-foreground">
                {invoices.length}{" "}
                {invoices.length === 1
                  ? "invoice"
                  : "invoices"}{" "}
                linked to this shipment
              </p>
            </div>

          </div>

          {/* TOTALS */}

          {invoices.length > 0 && (
            <div className="text-right">

              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total Invoice Value
              </p>

              <div className="mt-1 space-y-1">

                {Object.entries(
                  totalsByCurrency
                ).map(
                  ([
                    currency,
                    amount,
                  ]) => (
                    <p
                      key={currency}
                      className="text-lg font-bold text-slate-900"
                    >
                      {currency}{" "}
                      {amount.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* BODY */}

      <div className="p-5">

        {invoices.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">

            <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

            <p className="font-medium">
              No invoices
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              No invoices have been linked
              to this shipment.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {invoices.map(
              (invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-slate-50"
                >

                  {/* INVOICE */}

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                      <FileText className="h-4 w-4 text-slate-600" />

                    </div>

                    <div className="min-w-0">

                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="font-semibold text-slate-900 hover:text-primary"
                      >
                        {invoice.invoiceNumber}
                      </Link>

                      {invoice.externalInvoiceNumber && (
                        <p className="text-sm text-muted-foreground">
                          External:{" "}
                          {
                            invoice.externalInvoiceNumber
                          }
                        </p>
                      )}

                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          invoice.invoiceDate
                        ).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>

                    </div>

                  </div>

                  {/* AMOUNT */}

                  <div className="flex items-center gap-5">

                    <div className="text-right">

                      <p className="font-semibold">
                        {Number(
                          invoice.totalAmount
                        ).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {invoice.currency}
                      </p>

                    </div>

                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="rounded-md p-2 text-muted-foreground hover:bg-slate-100 hover:text-slate-900"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}