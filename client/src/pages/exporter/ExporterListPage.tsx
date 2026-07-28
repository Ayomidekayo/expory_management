import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import ExporterTable from "../../components/exporter/ExporterTable";
import ExporterSummaryCards from "../../components/exporter/ExporterSummaryCards";

import { useExporters } from "../../hooks/exporter/useExporters";

export default function ExporterListPage() {
  const {
    data,
    isLoading,
  } = useExporters();

  const exporters =
    data?.data ?? [];

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Exporters
          </h1>

          <p className="text-muted-foreground">
            Manage exporters.
          </p>

        </div>

        <Button asChild>

          <Link to="/exporters/new">

            <Plus className="mr-2 h-4 w-4" />

            New Exporter

          </Link>

        </Button>

      </div>

      {!isLoading && (
        <ExporterSummaryCards
          exporters={exporters}
        />
      )}

      <ExporterTable />

    </div>
  );
}