import {
  CalendarDays,
  Package,
  Boxes,
  Scale,
  Weight,
  Hash,
  FileText,
} from "lucide-react";

import type { PackingList } from "../../../types";

interface Props {
  packingList: PackingList;
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-sm text-muted-foreground">
          {label}
        </span>

      </div>

      <span className="max-w-[55%] text-right font-medium break-words">
        {value || "-"}
      </span>

    </div>
  );
}

export default function PackingInformationCard({
  packingList,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Package className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Packing Information
          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          icon={<Hash className="h-4 w-4 text-blue-600" />}
          label="Packing List Number"
          value={packingList.packingListNumber}
        />

        <Row
          icon={<CalendarDays className="h-4 w-4 text-green-600" />}
          label="Packing Date"
          value={new Date(
            packingList.packingDate
          ).toLocaleDateString()}
        />

        <Row
          icon={<Boxes className="h-4 w-4 text-purple-600" />}
          label="Package Type"
          value={packingList.packageType}
        />

        <Row
          icon={<Package className="h-4 w-4 text-orange-600" />}
          label="Total Packages"
          value={packingList.totalPackages}
        />

        <Row
          icon={<Scale className="h-4 w-4 text-emerald-600" />}
          label="Gross Weight"
          value={`${Number(
            packingList.grossWeight
          ).toLocaleString()} KG`}
        />

        <Row
          icon={<Weight className="h-4 w-4 text-red-600" />}
          label="Net Weight"
          value={`${Number(
            packingList.netWeight
          ).toLocaleString()} KG`}
        />

        <Row
          icon={<FileText className="h-4 w-4 text-indigo-600" />}
          label="Marks & Numbers"
          value={packingList.marksAndNumbers}
        />

      </div>

    </div>
  );
}