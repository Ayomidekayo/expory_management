import {
  Truck,
  Package,
  DollarSign,
  Route,
} from "lucide-react";

import SummaryCard from "../common/SummaryCard";
import type { Transit } from "../../types/transit.type";


interface Props {
  data: Transit[];
}

export default function TransitStatisticsCards({
  data,
}: Props) {
  const totalTransit = data.length;

  const totalQuantity = data.reduce(
    (sum, transit) =>
      sum + Number(transit.quantity ?? 0),
    0
  );

  const totalRevenue = data.reduce(
    (sum, transit) =>
      sum + Number(transit.totalPrice ?? 0),
    0
  );

  const uniqueRoutes = new Set(
    data.map(
      (transit) =>
        `${transit.origin}-${transit.destination}`
    )
  ).size;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Total Transits"
        value={totalTransit}
        subtitle="Recorded transit operations"
        icon={Truck}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Total Quantity"
        value={totalQuantity.toLocaleString()}
        subtitle="Goods in transit"
        icon={Package}
        color="bg-amber-100 text-amber-600"
      />

      <SummaryCard
        title="Total Value"
        value={`$${totalRevenue.toLocaleString()}`}
        subtitle="Transit value"
        icon={DollarSign}
        color="bg-emerald-100 text-emerald-600"
      />

      <SummaryCard
        title="Routes"
        value={uniqueRoutes}
        subtitle="Unique origin & destination routes"
        icon={Route}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );
}