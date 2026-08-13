import {
  FileText,
  Clock3,
  BadgeCheck,
  Wallet,
  Truck,
  TrendingUp,
} from "lucide-react";

import SummaryCard from "../common/SummaryCard";
import type { Invoice } from "../../types/invoice";

interface Props {
  invoices: Invoice[];
}

export default function InvoiceStatisticsCards({
  invoices,
}: Props) {
  const totalInvoices = invoices.length;

  const draftInvoices = invoices.filter(
    (invoice) => invoice.status === "DRAFT"
  ).length;

  const completedInvoices = invoices.filter(
    (invoice) =>
      ["APPROVED", "PAID"].includes(invoice.status)
  ).length;

  const totalInvoiceValue = invoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.totalAmount ?? 0),
    0
  );

  const totalFreight = invoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.freight ?? 0),
    0
  );

  const averageInvoiceValue =
    totalInvoices === 0
      ? 0
      : totalInvoiceValue / totalInvoices;

  /*
  =====================================
  Currency Formatter
  =====================================
  */

  const money = (value: number) =>
    value.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {/* Total Invoices */}

      <SummaryCard
        title="Total Invoices"
        value={totalInvoices}
        subtitle="Invoices created"
        icon={FileText}
        color="bg-blue-100 text-blue-600"
      />

      {/* Draft Invoices */}

      <SummaryCard
        title="Draft Invoices"
        value={draftInvoices}
        subtitle="Awaiting approval"
        icon={Clock3}
        color="bg-amber-100 text-amber-600"
      />

      {/* Approved / Paid */}

      <SummaryCard
        title="Approved / Paid"
        value={completedInvoices}
        subtitle="Completed invoices"
        icon={BadgeCheck}
        color="bg-emerald-100 text-emerald-600"
      />

      {/* Invoice Value */}

      <SummaryCard
        title="Invoice Value"
        value={money(totalInvoiceValue)}
        subtitle="Total invoice amount"
        icon={Wallet}
        color="bg-cyan-100 text-cyan-600"
      />

      {/* Total Freight */}

      <SummaryCard
        title="Total Freight"
        value={money(totalFreight)}
        subtitle="Freight charges"
        icon={Truck}
        color="bg-orange-100 text-orange-600"
      />

      {/* Average Value */}

      <SummaryCard
        title="Average Value"
        value={money(averageInvoiceValue)}
        subtitle="Average invoice amount"
        icon={TrendingUp}
        color="bg-purple-100 text-purple-600"
      />

    </div>
  );
}