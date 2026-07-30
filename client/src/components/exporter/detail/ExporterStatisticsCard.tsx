import {
  Package,
  FileText,
  Calendar,
} from "lucide-react";
import SummaryCard from "../../common/SummaryCard";
import type { Exporter } from "../../../types/exporter.types";

interface Props {
  exporter: Exporter;
}

export default function ExporterStatisticsCard({
  exporter,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      <SummaryCard
        title="Allocations"
        value={exporter._count.allocations}
        subtitle="Total allocations"
        icon={FileText}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Shipments"
        value={exporter._count.shipments}
        subtitle="Total shipments"
        icon={Package}
        color="bg-green-100 text-green-600"
      />

      <SummaryCard
        title="Created"
        value={new Date(
          exporter.createdAt
        ).toLocaleDateString()}
        subtitle="Registration date"
        icon={Calendar}
        color="bg-purple-100 text-purple-600"
      />

    </div>
  );
}