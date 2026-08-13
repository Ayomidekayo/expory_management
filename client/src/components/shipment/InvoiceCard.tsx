import { Link } from "react-router-dom";

import {
  FileText,
  Plus,
  Eye,
  CalendarDays,
  CircleDollarSign,
  Receipt,
  WalletCards,
} from "lucide-react";

import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import type { Shipment } from "../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

function formatMoney(
  amount: number,
  currency: string
) {
  return `${currency} ${amount.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function getStatusVariant(status?: string) {
  switch (status) {
    case "PAID":
      return "default";

    case "PARTIALLY_PAID":
      return "secondary";

    case "OVERDUE":
      return "destructive";

    default:
      return "outline";
  }
}

function formatStatus(status?: string) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function InvoiceCard({
  shipment,
}: Props) {
  const invoices = shipment.invoices ?? [];

  /*
   * Calculate financial totals by currency.
   *
   * We do NOT combine USD + NGN + EUR into
   * one number.
   */
  const totalsByCurrency =
    invoices.reduce<
      Record<
        string,
        {
          subtotal: number;
          freight: number;
          total: number;
        }
      >
    >((totals, invoice) => {
      const currency = String(
        invoice.currency
      );

      if (!totals[currency]) {
        totals[currency] = {
          subtotal: 0,
          freight: 0,
          total: 0,
        };
      }

      totals[currency].subtotal += Number(
        invoice.subtotal ?? 0
      );

      totals[currency].freight += Number(
        invoice.freight ?? 0
      );

      totals[currency].total += Number(
        invoice.totalAmount ?? 0
      );

      return totals;
    }, {});

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Invoices
              </CardTitle>

              <p className="mt-1 text-sm text-slate-500">
                {invoices.length}{" "}
                {invoices.length === 1
                  ? "invoice"
                  : "invoices"}{" "}
                linked to this shipment
              </p>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="w-full sm:w-auto"
          >
            <Link
              to={`/invoices/new?shipmentId=${shipment.id}`}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Invoice
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {invoices.length === 0 ? (
          /* =================================================
             EMPTY STATE
          ================================================== */

          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>

            <h3 className="text-base font-semibold text-slate-900">
              No Invoices
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              This shipment does not have any
              invoices yet. Create an invoice to
              begin tracking its financial details.
            </p>

            <Button
              asChild
              className="mt-5"
            >
              <Link
                to={`/invoices/new?shipmentId=${shipment.id}`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* =================================================
                FINANCIAL SUMMARY
            ================================================== */}

            <div>
              <div className="mb-4 flex items-center gap-2">
                <WalletCards className="h-4 w-4 text-emerald-600" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Invoice Summary
                </h3>
              </div>

              <div
                className={`grid gap-4 ${
                  Object.keys(totalsByCurrency).length === 1
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2"
                }`}
              >
                {/* Invoice Count */}

                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                        Total Invoices
                      </p>

                      <p className="mt-2 text-2xl font-bold text-blue-900">
                        {invoices.length}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Receipt className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Currency Totals */}

                {Object.entries(
                  totalsByCurrency
                ).map(
                  ([
                    currency,
                    financials,
                  ]) => (
                    <div
                      key={currency}
                      className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                            Total Value
                          </p>

                          <p className="mt-2 text-xl font-bold text-emerald-900">
                            {formatMoney(
                              financials.total,
                              currency
                            )}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <CircleDollarSign className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="mt-3 border-t border-emerald-200/70 pt-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-700">
                            Subtotal
                          </span>

                          <span className="font-semibold text-emerald-900">
                            {formatMoney(
                              financials.subtotal,
                              currency
                            )}
                          </span>
                        </div>

                        <div className="mt-1 flex justify-between text-xs">
                          <span className="text-emerald-700">
                            Freight
                          </span>

                          <span className="font-semibold text-emerald-900">
                            {formatMoney(
                              financials.freight,
                              currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* =================================================
                INVOICE LIST
            ================================================== */}

            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Invoice Records
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Detailed invoice information
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="border-slate-200 bg-slate-50 text-slate-600"
                >
                  {invoices.length}{" "}
                  {invoices.length === 1
                    ? "Record"
                    : "Records"}
                </Badge>
              </div>

              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                  >
                    {/* Invoice Header */}

                    <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <Link
                            to={`/invoices/${invoice.id}`}
                            className="block truncate text-sm font-semibold text-slate-900 transition-colors hover:text-blue-600"
                          >
                            {invoice.invoiceNumber}
                          </Link>

                          {invoice.externalInvoiceNumber && (
                            <p className="mt-1 truncate text-xs text-slate-500">
                              External:{" "}
                              {
                                invoice.externalInvoiceNumber
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full border-slate-200 bg-white sm:w-auto"
                      >
                        <Link
                          to={`/invoices/${invoice.id}`}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Invoice
                        </Link>
                      </Button>
                    </div>

                    {/* Invoice Details */}

                    <div className="p-4">
                      <div className="grid gap-x-8 md:grid-cols-2">
                        <Row
                          label="Invoice Date"
                          value={format(
                            new Date(
                              invoice.invoiceDate
                            ),
                            "PPP"
                          )}
                        />

                        <Row
                          label="Currency"
                          value={String(
                            invoice.currency
                          )}
                        />

                        <Row
                          label="Status"
                          value={formatStatus(
                            invoice.status
                          )}
                        />

                        <Row
                          label="Freight"
                          value={formatMoney(
                            Number(
                              invoice.freight ?? 0
                            ),
                            String(
                              invoice.currency
                            )
                          )}
                        />

                        <Row
                          label="Subtotal"
                          value={formatMoney(
                            Number(
                              invoice.subtotal ?? 0
                            ),
                            String(
                              invoice.currency
                            )
                          )}
                        />

                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 md:border-b-0">
                          <span className="text-sm font-medium text-slate-500">
                            Total Amount
                          </span>

                          <span className="text-right text-base font-bold text-emerald-700">
                            {formatMoney(
                              Number(
                                invoice.totalAmount ??
                                  0
                              ),
                              String(
                                invoice.currency
                              )
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Status */}

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Created invoice
                        </div>

                        <Badge
                          variant={getStatusVariant(
                            invoice.status
                          )}
                        >
                          {formatStatus(
                            invoice.status
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                BOTTOM TOTAL
            ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                    <WalletCards className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Shipment Invoice Totals
                    </p>

                    <p className="text-xs text-slate-500">
                      Total value across all invoices,
                      grouped by currency.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  {Object.entries(
                    totalsByCurrency
                  ).map(
                    ([
                      currency,
                      financials,
                    ]) => (
                      <div
                        key={currency}
                        className="flex items-center justify-end gap-4"
                      >
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {currency}
                        </span>

                        <span className="text-lg font-bold text-slate-900">
                          {financials.total.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}