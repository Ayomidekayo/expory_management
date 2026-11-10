
import {
  Truck,
  Package,
  Link2,
  Unlink,
} from "lucide-react";

import SummaryCard from "../common/SummaryCard";
import type { Transport } from "../../types/transport";

interface Props {
  data: Transport[];
}

export default function TransportStatisticsCards({
  data,
}: Props) {
  const totalTransports = data.length;

  const totalItems = data.reduce(
    (sum, transport) =>
      sum + (
        transport._count?.items ??
        transport.items?.length ??
        0
      ),
    0
  );

  const shipmentLinked = data.filter(
    (transport) => Boolean(transport.shipmentId)
  ).length;

  const independent = data.filter(
    (transport) => !transport.shipmentId
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Transport Records"
        value={totalTransports}
        subtitle="Loaded transport records"
        icon={Truck}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Transport Items"
        value={totalItems.toLocaleString()}
        subtitle="Trucks and containers"
        icon={Package}
        color="bg-amber-100 text-amber-600"
      />

      <SummaryCard
        title="Shipment Linked"
        value={shipmentLinked}
        subtitle="Connected to shipments"
        icon={Link2}
        color="bg-emerald-100 text-emerald-600"
      />

      <SummaryCard
        title="Independent"
        value={independent}
        subtitle="Not linked to shipments"
        icon={Unlink}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );
}
