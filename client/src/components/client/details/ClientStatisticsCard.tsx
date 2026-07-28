import {
  Building2,
  Package,
  Truck,
  Calendar,
} from "lucide-react";



import type { Client } from "../../../types/client.types";
import SummaryCard from "../../common/SummaryCard";


interface Props {
  client: Client;
}

export default function ClientStatisticsCard({
  client,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <SummaryCard
        title="Allocations"
        value={client.allocations?.length ?? 0}
        subtitle="Total allocations"
        icon={Package}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Shipments"
        value={client.shipments?.length ?? 0}
        subtitle="Total shipments"
        icon={Truck }
        color="bg-green-100 text-green-600"
      />

      <SummaryCard
        title="Status"
        value={client.isActive ? "Active" : "Inactive"}
        subtitle="Client status"
        icon={Building2}
        color={
          client.isActive
            ? "bg-emerald-100 text-emerald-600"
            : "bg-red-100 text-red-600"
        }
      />

      <SummaryCard
        title="Client Since"
        value={new Date(
          client.createdAt
        ).toLocaleDateString()}
        subtitle="Registration date"
        icon={Calendar}
        color="bg-purple-100 text-purple-600"
      />

    </div>
  );
}