import {
  CalendarDays,
  CreditCard,
  DollarSign,
  Banknote,
  FileText,
  Package,
  Clock,
} from "lucide-react";

import type { Invoice } from "../../../types/invoice";

interface Props {
  invoice: Invoice;
}

/*
=====================================
Date Only Formatter
=====================================

Invoice Date is a calendar date.
Do not convert it through the browser
timezone.
*/

function formatDateOnly(
  value?: string | Date | null
): string {
  if (!value) return "-";

  const dateString =
    typeof value === "string"
      ? value.slice(0, 10)
      : value.toISOString().slice(0, 10);

  const [year, month, day] =
    dateString.split("-");

  if (!year || !month || !day) {
    return "-";
  }

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

  return `${day} ${
    months[Number(month) - 1] ?? month
  } ${year}`;
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <div className="flex items-center gap-3">
        {icon}

        <span className="text-sm text-muted-foreground">
          {label}
        </span>
      </div>

      <span className="text-right font-medium">
        {value}
      </span>
    </div>
  );
}

export default function InvoiceSummaryCard({
  invoice,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold">
          Invoice Information
        </h2>
      </div>

      <div className="p-5">

        <Row
          icon={
            <FileText className="h-4 w-4 text-primary" />
          }
          label="Invoice Number"
          value={invoice.invoiceNumber}
        />

        <Row
          icon={
            <FileText className="h-4 w-4 text-emerald-600" />
          }
          label="External Invoice Number"
          value={
            invoice.externalInvoiceNumber ? (
              <span className="font-semibold text-emerald-700">
                {invoice.externalInvoiceNumber}
              </span>
            ) : (
              <span className="text-muted-foreground">
                Not provided
              </span>
            )
          }
        />

        {/* FIXED DATE */}
        <Row
          icon={
            <CalendarDays className="h-4 w-4 text-blue-600" />
          }
          label="Invoice Date"
          value={formatDateOnly(
            invoice.invoiceDate
          )}
        />

        <Row
          icon={
            <DollarSign className="h-4 w-4 text-green-600" />
          }
          label="Currency"
          value={invoice.currency}
        />

        <Row
          icon={
            <Banknote className="h-4 w-4 text-orange-600" />
          }
          label="Exchange Rate"
          value={
            invoice.exchangeRate ?? "-"
          }
        />

        <Row
          icon={
            <CreditCard className="h-4 w-4 text-purple-600" />
          }
          label="Payment Terms"
          value={
            invoice.paymentTerms ?? "-"
          }
        />

        <Row
          icon={
            <Package className="h-4 w-4 text-indigo-600" />
          }
          label="Transport Units"
          value={
            invoice.transportUnits ?? "-"
          }
        />

        <Row
          icon={
            <FileText className="h-4 w-4 text-cyan-600" />
          }
          label="Commercial Ref."
          value={
            invoice.commercialReference ?? "-"
          }
        />

        <Row
          icon={
            <Package className="h-4 w-4 text-pink-600" />
          }
          label="Incoterm"
          value={
            invoice.incoterm ?? "-"
          }
        />

        {/* Created is a timestamp, so timezone
            conversion is acceptable here. */}
        <Row
          icon={
            <Clock className="h-4 w-4 text-gray-600" />
          }
          label="Created"
          value={new Date(
            invoice.createdAt
          ).toLocaleDateString()}
        />

        {/* Updated is also a timestamp. */}
        <Row
          icon={
            <Clock className="h-4 w-4 text-gray-600" />
          }
          label="Updated"
          value={new Date(
            invoice.updatedAt
          ).toLocaleDateString()}
        />

      </div>
    </div>
  );
}