import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "../../components/ui/button";

import { useClient } from "../../hooks/client/useClient";

import ClientShipmentTable from "../../components/client/details/ClientShipmentTable";
import ClientAllocationTable from "../../components/client/details/ClientAllocationTable";
import ClientStatisticsCard from "../../components/client/details/ClientStatisticsCard";
import ClientInformationCard from "../../components/client/details/ClientInformationCard";

export default function ClientDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
  } = useClient(id);

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
        Client not found.
      </div>
    );
  }

  const client = data.data;

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">

        <Link to="/clients">
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
            {client.companyName}
          </h1>

          <p className="text-sm text-slate-500">
            Client Code: {client.clientCode}
          </p>
        </div>

      </div>

      <ClientStatisticsCard
        client={client}
      />

      <ClientInformationCard
        client={client}
      />

      <ClientAllocationTable
        allocations={client.allocations ?? []}
      />

      <ClientShipmentTable
        shipments={client.shipments ?? []}
      />

    </div>
  );
}