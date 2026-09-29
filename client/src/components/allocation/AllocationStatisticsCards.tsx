import {
  ClipboardList,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { useAllocations } from "../../hooks/allocation/useAllocations";


import SummaryCard from "../common/SummaryCard";
import { useShipmentStatusCounts } from "../../hooks/shipments/useShipmentStatusCounts";

export default function AllocationStatisticsCards() {
  /* =========================================
     NORMAL ALLOCATION DATA
  ========================================= */

  const {
    data,
    isLoading,
  } = useAllocations();

  const allocations = data?.data ?? [];

  const total =
    data?.pagination?.total ?? allocations.length;

  const pending = allocations.filter(
    (allocation) =>
      allocation.status === "PENDING"
  ).length;

  const inProgress = allocations.filter(
    (allocation) =>
      allocation.status === "IN_PROGRESS"
  ).length;

  /* =========================================
     ALLOCATION STATUS COUNTS

     Completed allocations may be excluded
     from the normal allocation list, so get
     the completed count from the dedicated
     status-count endpoint.
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

  if (
    isLoading ||
    isStatusCountsLoading
  ) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl border bg-slate-100"
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
        title="Total Allocations"
        value={total}
        subtitle="All registered allocations"
        icon={ClipboardList}
        color="bg-blue-100 text-blue-600"
      />

      {/* PENDING */}

      <SummaryCard
        title="Pending"
        value={pending}
        subtitle="Awaiting processing"
        icon={Clock3}
        color="bg-yellow-100 text-yellow-600"
      />

      {/* IN PROGRESS */}

      <SummaryCard
        title="In Progress"
        value={inProgress}
        subtitle="Currently being handled"
        icon={Truck}
        color="bg-emerald-100 text-emerald-600"
      />

      {/* COMPLETED */}

      <SummaryCard
        title="Completed"
        value={completed}
        subtitle="Successfully completed"
        icon={CheckCircle2}
        color="bg-purple-100 text-purple-600"
      />

    </div>
  );
}