import {
  Users,
  Package,
  Truck,
  Calendar,
} from "lucide-react";

import type { Consignee } from "../../types";
import SummaryCard from "../common/SummaryCard";

interface Props {
  consignees: Consignee[];
}

export default function ConsigneeSummaryCards({
  consignees,
}: Props) {
  const totalConsignees =
    consignees.length;

  const totalAllocations =
    consignees.reduce(
      (sum, consignee) =>
        sum +
        (consignee._count?.allocations ?? 0),
      0
    );

  const totalShipments =
    consignees.reduce(
      (sum, consignee) =>
        sum +
        (consignee._count?.shipments ?? 0),
      0
    );

  const latestConsignee =
    consignees.length > 0
      ? [...consignees].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )[0]
      : null;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <SummaryCard
        title="Total Consignees"
        value={totalConsignees}
        subtitle="Registered consignees"
        icon={Users}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Allocations"
        value={totalAllocations}
        subtitle="Linked allocations"
        icon={Package}
        color="bg-amber-100 text-amber-600"
      />

      <SummaryCard
        title="Shipments"
        value={totalShipments}
        subtitle="Managed shipments"
        icon={Truck}
        color="bg-emerald-100 text-emerald-600"
      />

      <SummaryCard
        title="Latest Registration"
        value={
          latestConsignee
            ? new Date(
                latestConsignee.createdAt
              ).toLocaleDateString()
            : "-"
        }
        subtitle={
          latestConsignee?.name ??
          "No consignee"
        }
        icon={Calendar}
        color="bg-purple-100 text-purple-600"
      />

    </div>
  );
}