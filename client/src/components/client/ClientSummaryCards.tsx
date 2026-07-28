import {
  Building2,
  CheckCircle2,
  Package,
  Truck,
} from "lucide-react";


import type { Client } from "../../types/client.types";
import SummaryCard from "../common/SummaryCard";



interface Props {
  clients: Client[];
}

export default function ClientSummaryCards({
  clients,
}: Props) {
  const totalClients = clients.length;

  const activeClients = clients.filter(
    (client) => client.isActive
  ).length;

  const totalAllocations = clients.reduce(
    (sum, client) =>
      sum + (client._count?.allocations ?? 0),
    0
  );

  const totalShipments = clients.reduce(
    (sum, client) =>
      sum + (client._count?.shipments ?? 0),
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      <SummaryCard
        title="Total Clients"
        value={totalClients}
        icon={Building2}
      />

      <SummaryCard
        title="Active Clients"
        value={activeClients}
        icon={CheckCircle2}
      />

      <SummaryCard
        title="Allocations"
        value={totalAllocations}
        icon={Package}
      />

      <SummaryCard
        title="Shipments"
        value={totalShipments}
        icon={Truck}
      />

    </div>
  );
}