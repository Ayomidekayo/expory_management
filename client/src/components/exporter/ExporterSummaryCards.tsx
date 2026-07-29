import {
  Users,
  BriefcaseBusiness,
  Truck,
  Calendar,
} from "lucide-react";

import SummaryCard from "../common/SummaryCard";
import type { Exporter } from "../../types/exporter.types";

interface Props {
  exporters: Exporter[];
}

export default function ExporterSummaryCards({
  exporters,
}: Props) {
  const totalExporters =
    exporters.length;

  const totalAllocations =
    exporters.reduce(
      (sum, exporter) =>
        sum +
        (exporter._count?.allocations ?? 0),
      0
    );

  const totalShipments =
    exporters.reduce(
      (sum, exporter) =>
        sum +
        (exporter._count?.shipments ?? 0),
      0
    );

  const latestExporter =
    exporters.length > 0
      ? [...exporters].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )[0]
      : null;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <SummaryCard
        title="Exporters"
        value={totalExporters}
        subtitle="Registered exporters"
        icon={Users}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Allocations"
        value={totalAllocations}
        subtitle="Across all exporters"
        icon={BriefcaseBusiness}
        color="bg-amber-100 text-amber-600"
      />

      <SummaryCard
        title="Shipments"
        value={totalShipments}
        subtitle="Processed shipments"
        icon={Truck}
        color="bg-emerald-100 text-emerald-600"
      />

      <SummaryCard
        title="Latest Exporter"
        value={
          latestExporter
            ? new Date(
                latestExporter.createdAt
              ).toLocaleDateString()
            : "-"
        }
        subtitle={
          latestExporter?.name ??
          "No exporter"
        }
        icon={Calendar}
        color="bg-purple-100 text-purple-600"
      />

    </div>
  );
}