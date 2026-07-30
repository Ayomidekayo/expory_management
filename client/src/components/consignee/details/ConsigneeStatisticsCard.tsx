import { Package, FileText, Calendar } from "lucide-react";
import SummaryCard from "../../common/SummaryCard";
import type { Consignee } from "../../../types/consignee";

interface Props {
  consignee: Consignee;
}

export default function ConsigneeStatisticsCard({
  consignee,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <SummaryCard
        title="Allocations"
        value={consignee._count?.allocations ?? 0}
        subtitle="Total allocations"
        icon={FileText}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Shipments"
        value={consignee._count?.shipments ?? 0}
        subtitle="Total shipments"
        icon={Package}
        color="bg-green-100 text-green-600"
      />

      <SummaryCard
        title="Created"
        value={new Date(
          consignee.createdAt
        ).toLocaleDateString()}
        subtitle="Registration date"
        icon={Calendar}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );
}