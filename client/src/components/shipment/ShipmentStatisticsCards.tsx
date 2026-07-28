import {
  Package,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { useShipments } from "../../hooks/shipments/useShipments";
import SummaryCard from "../common/SummaryCard";

export default function ShipmentStatisticsCards() {
  const { data, isLoading } = useShipments();

  const shipments = data?.data ?? [];

  const total = shipments.length;

  const draft = shipments.filter(
    (shipment) => shipment.status === "DRAFT"
  ).length;

  const inTransit = shipments.filter(
    (shipment) => shipment.status === "IN_TRANSIT"
  ).length;

  const completed = shipments.filter(
    (shipment) => shipment.status === "COMPLETED"
  ).length;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-2xl border bg-slate-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Total Shipments"
        value={total}
        subtitle="Registered shipments"
        icon={Package}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Draft"
        value={draft}
        subtitle="Awaiting processing"
        icon={Clock3}
        color="bg-amber-100 text-amber-600"
      />

      <SummaryCard
        title="In Transit"
        value={inTransit}
        subtitle="Currently in transit"
        icon={Truck}
        color="bg-cyan-100 text-cyan-600"
      />

      <SummaryCard
        title="Completed"
        value={completed}
        subtitle="Successfully delivered"
        icon={CheckCircle2}
        color="bg-emerald-100 text-emerald-600"
      />
    </div>
  );
}