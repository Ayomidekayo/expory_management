import {
  Package,
  Truck,
  CheckCircle,
  Scale,
} from "lucide-react";

import SummaryCard from "../common/SummaryCard";

import type { Container } from "../../types/container.type";

interface Props {
  data: Container[];
}

export default function ContainerStatisticsCards({
  data,
}: Props) {
  const totalContainers = data.length;

  const loaded = data.filter(
    (container) => container.status === "LOADED"
  ).length;

  const delivered = data.filter(
    (container) => container.status === "DELIVERED"
  ).length;

  const grossWeight = data.reduce(
    (sum, container) =>
      sum + Number(container.grossWeight ?? 0),
    0
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Containers"
        value={totalContainers}
        subtitle="Registered containers"
        icon={Package}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Loaded"
        value={loaded}
        subtitle="Ready for shipment"
        icon={Truck}
        color="bg-amber-100 text-amber-600"
      />

      <SummaryCard
        title="Delivered"
        value={delivered}
        subtitle="Successfully delivered"
        icon={CheckCircle}
        color="bg-emerald-100 text-emerald-600"
      />

      <SummaryCard
        title="Gross Weight"
        value={`${grossWeight.toLocaleString()} KG`}
        subtitle="Combined cargo weight"
        icon={Scale}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );
}