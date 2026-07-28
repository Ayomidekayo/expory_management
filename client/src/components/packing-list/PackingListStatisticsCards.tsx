import {
  Package,
  Boxes,
  Scale,
  Weight,
} from "lucide-react";

import SummaryCard from "../common/SummaryCard";

import type { PackingList } from "../../types";

interface Props {
  data: PackingList[];
}

export default function PackingListStatisticsCards({
  data,
}: Props) {
  const totalPackingLists = data.length;

  const totalPackages = data.reduce(
    (sum, packingList) =>
      sum + Number(packingList.totalPackages ?? 0),
    0
  );

  const grossWeight = data.reduce(
    (sum, packingList) =>
      sum + Number(packingList.grossWeight ?? 0),
    0
  );

  const netWeight = data.reduce(
    (sum, packingList) =>
      sum + Number(packingList.netWeight ?? 0),
    0
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Packing Lists"
        value={totalPackingLists}
        subtitle="Registered packing lists"
        icon={Package}
        color="bg-blue-100 text-blue-600"
      />

      <SummaryCard
        title="Packages"
        value={totalPackages.toLocaleString()}
        subtitle="Total packages"
        icon={Boxes}
        color="bg-amber-100 text-amber-600"
      />

      <SummaryCard
        title="Gross Weight"
        value={`${grossWeight.toLocaleString()} KG`}
        subtitle="Combined gross weight"
        icon={Scale}
        color="bg-emerald-100 text-emerald-600"
      />

      <SummaryCard
        title="Net Weight"
        value={`${netWeight.toLocaleString()} KG`}
        subtitle="Combined net weight"
        icon={Weight}
        color="bg-purple-100 text-purple-600"
      />
    </div>
  );
}