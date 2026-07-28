import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { Button } from "../../components/ui/button";

import { useExporter } from "../../hooks/exporter/useExporter";

import ExporterShipmentTable from "../../components/exporter/detail/ExporterShipmentTable";
import ExporterAllocationTable from "../../components/exporter/detail/ExporterAllocationTable";
import ExporterInformationCard from "../../components/exporter/detail/ExporterInformationCard";
import ExporterStatisticsCard from "../../components/exporter/detail/ExporterStatisticsCard";

export default function ExporterDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
  } = useExporter(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        Exporter not found.
      </div>
    );
  }

  const exporter = data.data;

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">

        <Link to="/exporters">
          <Button
            variant="outline"
            size="icon"
            className="
              h-11
              w-11
              rounded-xl
              border-slate-300
              transition-all
              hover:border-emerald-500
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="h-8 w-px bg-slate-300" />

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {exporter.name}
          </h1>

          <p className="text-sm text-slate-500">
            Exporter Details
          </p>
        </div>

      </div>

      <ExporterStatisticsCard
        exporter={exporter}
      />

      <ExporterInformationCard
        exporter={exporter}
      />

      <ExporterAllocationTable
        allocations={
          exporter.allocations ?? []
        }
      />

      <ExporterShipmentTable
        shipments={
          exporter.shipments ?? []
        }
      />

    </div>
  );
}