import {
  FileText,
  FileCheck,
  FileArchive,
  FileSpreadsheet,
} from "lucide-react";

import SummaryCard from "../common/SummaryCard";

import type { Document } from "../../types/document";

interface Props {
  data: Document[];
}

export default function DocumentStatisticsCards({
  data,
}: Props) {
  const totalDocuments = data.length;

  const invoices = data.filter(
    (document) => document.type === "INVOICE"
  ).length;

  const packingLists = data.filter(
    (document) =>
      document.type === "PACKING_LIST"
  ).length;

  const others = data.filter(
    (document) =>
      document.type !== "INVOICE" &&
      document.type !== "PACKING_LIST"
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Total Documents"
        value={totalDocuments}
        subtitle="Uploaded documents"
        icon={FileText}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Invoices"
        value={invoices}
        subtitle="Invoice documents"
        icon={FileCheck}
        color="bg-emerald-100 text-emerald-600"
      />

      <SummaryCard
        title="Packing Lists"
        value={packingLists}
        subtitle="Packing list documents"
        icon={FileArchive}
        color="bg-amber-100 text-amber-600"
      />

      <SummaryCard
        title="Other Documents"
        value={others}
        subtitle="Certificates & other files"
        icon={FileSpreadsheet}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );
}