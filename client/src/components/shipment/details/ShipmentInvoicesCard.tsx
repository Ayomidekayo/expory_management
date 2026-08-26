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

interface FinancialSummary {
  total: number;
  paid: number;
  outstanding: number;
}

export default function ShipmentInvoicesCard({
  shipment,
}: Props) {
  /*
  =====================================
  INVOICES
  =====================================
  */

  const invoices = shipment.invoices ?? [];

  /*
  =====================================
  FINANCIAL SUMMARY
  =====================================

  We calculate three things for each
  currency:

  1. Total
  2. Paid
  3. Outstanding

  Example:

  USD 2,000 total
  USD 1,200 paid
  USD   800 outstanding
  */

  const financialSummary =
    invoices.reduce<
      Record<string, FinancialSummary>
    >((summary, invoice) => {
      const currency = invoice.currency;

      /*
      Create the currency bucket
      if it doesn't exist yet.
      */

      if (!summary[currency]) {
        summary[currency] = {
          total: 0,
          paid: 0,
          outstanding: 0,
        };
      }

      /*
      Convert totalAmount to number.

      This is important because values
      coming from APIs can sometimes be
      strings or Decimal-like values.
      */

      const amount = Number(
        invoice.totalAmount || 0
      );

      /*
      =====================================
      TOTAL
      =====================================

      Every invoice contributes to
      the total.
      */

      summary[currency].total += amount;

      /*
      =====================================
      PAID / OUTSTANDING
      =====================================

      If invoice is PAID:

          add it to paid

      Otherwise:

          add it to outstanding
      */

      if (invoice.status === "PAID") {
        summary[currency].paid += amount;
      } else {
        summary[currency].outstanding += amount;
      }

      return summary;
    }, {});

  /*
  =====================================
  DEBUG
  =====================================
  */

  console.log(
    "Shipment:",
    shipment
  );

  console.log(
    "Shipment Invoices:",
    invoices
  );

  console.log(
    "Invoice Financial Summary:",
    financialSummary
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">

        <div className="flex flex-col gap-5">

          {/* =====================================
              TITLE
          ===================================== */}

          <div className="flex items-center justify-between gap-4">

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

          </div>

          {/* =====================================
              FINANCIAL SUMMARY
          ===================================== */}

          {invoices.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">

              {Object.entries(
                financialSummary
              ).map(
                ([
                  currency,
                  summary,
                ]) => (

                  <div
                    key={currency}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >

                    {/* TOTAL */}

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total Invoice Value
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {currency}{" "}
                        {summary.total.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                    </div>

                    {/* PAID */}

                    <div className="mt-3 flex items-center justify-between">

                      <span className="text-xs text-slate-500">
                        Paid
                      </span>

                      <span className="text-sm font-semibold text-emerald-600">

                        {currency}{" "}
                        {summary.paid.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </span>

                    </div>

                    {/* OUTSTANDING */}

                    <div className="mt-2 flex items-center justify-between">

                      <span className="text-xs text-slate-500">
                        Outstanding
                      </span>

                      <span className="text-sm font-semibold text-orange-600">

                        {currency}{" "}
                        {summary.outstanding.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </span>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </div>

      </div>

      {/* =====================================
          BODY
      ===================================== */}

      <div className="p-5">

        {invoices.length === 0 ? (

          /* =====================================
             NO INVOICES
          ===================================== */

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

          /* =====================================
             INVOICE LIST
          ===================================== */

          <div className="space-y-3">

            {invoices.map(
              (invoice) => (

                <div
                  key={invoice.id}
                  className="
                    group
                    flex
                    flex-col
                    gap-4
                    rounded-lg
                    border
                    border-slate-200
                    p-4
                    transition-colors
                    hover:bg-slate-50
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  {/* =====================================
                      INVOICE INFORMATION
                  ===================================== */}

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                      <FileText className="h-4 w-4 text-slate-600" />

                    </div>

                    <div className="min-w-0">

                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="
                          block
                          truncate
                          text-sm
                          font-semibold
                          text-slate-900
                          transition-colors
                          hover:text-primary
                        "
                      >
                        {invoice.invoiceNumber}
                      </Link>

                      {invoice.externalInvoiceNumber && (
                        <p className="mt-0.5 truncate text-xs text-slate-500">

                          External:{" "}
                          {
                            invoice.externalInvoiceNumber
                          }

                        </p>
                      )}

                      <p className="mt-0.5 text-xs text-slate-500">

                        {new Date(
                          invoice.invoiceDate
                        ).toLocaleDateString(
                          "en-GB"
                        )}

                      </p>

                    </div>

                  </div>

                  {/* =====================================
                      AMOUNT + STATUS + ACTION
                  ===================================== */}

                  <div className="flex items-center justify-between gap-4 sm:justify-end">

                    {/* AMOUNT */}

                    <div className="text-left sm:text-right">

                      <p className="text-sm font-semibold text-slate-900">

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

                      <p className="text-xs font-medium text-slate-500">
                        {invoice.currency}
                      </p>

                    </div>

                    {/* STATUS */}

                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        ${
                          invoice.status ===
                          "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : invoice.status ===
                              "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      `}
                    >
                      {invoice.status}
                    </span>

                    {/* VIEW */}

                    <Link
                      to={`/invoices/${invoice.id}`}
                      aria-label={`View invoice ${invoice.invoiceNumber}`}
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        border
                        border-slate-200
                        bg-white
                        text-slate-500
                        transition-colors
                        hover:bg-slate-100
                        hover:text-slate-900
                      "
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