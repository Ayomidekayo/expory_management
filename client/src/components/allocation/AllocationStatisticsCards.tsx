import {
  ClipboardList,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { useAllocations } from "../../hooks/allocation/useAllocations";
import SummaryCard from "../common/SummaryCard";

export default function AllocationStatisticsCards() {
  const { data, isLoading } = useAllocations();

  const allocations = data?.data ?? [];

  const total = allocations.length;

  const pending = allocations.filter(
    (a) => a.status === "PENDING"
  ).length;

  const inProgress = allocations.filter(
    (a) => a.status === "IN_PROGRESS"
  ).length;

  const completed = allocations.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-2xl border bg-slate-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <SummaryCard
        title="Total Allocations"
        value={total}
        subtitle="All registered allocations"
        icon={ClipboardList}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Pending"
        value={pending}
        subtitle="Awaiting processing"
        icon={Clock3}
        color="bg-yellow-100 text-yellow-600"
      />

      <SummaryCard
        title="In Progress"
        value={inProgress}
        subtitle="Currently being handled"
        icon={Truck}
        color="bg-emerald-100 text-emerald-600"
      />

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