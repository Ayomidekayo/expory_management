import {
  Package,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  useShipments,
} from "../../hooks/shipments/useShipments";

import {
  useShipmentStatusCounts,
} from "../../hooks/shipments/useShipmentStatusCounts";

import SummaryCard from "../common/SummaryCard";

export default function ShipmentStatisticsCards() {
  const navigate = useNavigate();

  /* =========================================
     NORMAL SHIPMENT STATISTICS
  ========================================= */

  const {
    data,
    isLoading,
  } = useShipments();

  const shipments = data?.data ?? [];

  const total =
    data?.pagination?.total ?? shipments.length;

  const draft = shipments.filter(
    (shipment) =>
      shipment.status === "DRAFT"
  ).length;

  const inTransit = shipments.filter(
    (shipment) =>
      shipment.status === "IN_TRANSIT"
  ).length;

  /* =========================================
     ARCHIVED / STATUS COUNTS
     
     Completed and Cancelled shipments are
     excluded from the normal shipment list.

     Therefore we get these counts from the
     dedicated status-counts endpoint.
  ========================================= */

  const {
    data: statusCountsResponse,
    isLoading: isStatusCountsLoading,
  } = useShipmentStatusCounts();

  const completed =
    statusCountsResponse?.data?.completed ?? 0;

  /* =========================================
     LOADING
  ========================================= */

  if (isLoading || isStatusCountsLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border bg-slate-100"
            />
          )
        )}
      </div>
    );
  }

  /* =========================================
     CARDS
  ========================================= */

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {/* TOTAL */}

      <SummaryCard
        title="Total Shipments"
        value={total}
        subtitle="Registered shipments"
        icon={Package}
        color="bg-blue-100 text-blue-600"
      />

      {/* DRAFT */}

      <SummaryCard
        title="Draft"
        value={draft}
        subtitle="Awaiting processing"
        icon={Clock3}
        color="bg-amber-100 text-amber-600"
      />

      {/* IN TRANSIT */}

      <SummaryCard
        title="In Transit"
        value={inTransit}
        subtitle="Currently in transit"
        icon={Truck}
        color="bg-cyan-100 text-cyan-600"
      />

      {/* COMPLETED */}

      <SummaryCard
        title="Completed"
        value={completed}
        subtitle="Successfully delivered"
        icon={CheckCircle2}
        color="bg-emerald-100 text-emerald-600"
        onClick={() =>
          navigate("/shipments/completed")
        }
      />

    </div>
  );
}