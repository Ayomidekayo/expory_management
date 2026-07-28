import {
  PackageCheck,
} from "lucide-react";

import type { PackingList } from "../../../types";

interface Props {
  packingList?: PackingList | null;
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="max-w-[55%] text-right font-medium break-words">
        {value || "-"}
      </span>

    </div>
  );
}

export default function PackingListInformationCard({
  packingList,
}: Props) {
  if (!packingList) {
    return (
      <div className="rounded-xl border bg-white">

        <div className="border-b p-5">

          <div className="flex items-center gap-2">

            <PackageCheck className="h-5 w-5 text-primary" />

            <h2 className="text-lg font-semibold">
              Packing List Information
            </h2>

          </div>

        </div>

        <div className="p-5 text-sm text-muted-foreground">

          No packing list is linked to this container.

        </div>

      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <PackageCheck className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Packing List Information
          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          label="Packing List Number"
          value={packingList.packingListNumber}
        />

        <Row
          label="Package Type"
          value={packingList.packageType}
        />

        <Row
          label="Total Packages"
          value={packingList.totalPackages}
        />

        <Row
          label="Gross Weight"
          value={`${Number(
            packingList.grossWeight
          ).toLocaleString()} KG`}
        />

        <Row
          label="Net Weight"
          value={`${Number(
            packingList.netWeight
          ).toLocaleString()} KG`}
        />

        <Row
          label="Marks & Numbers"
          value={packingList.marksAndNumbers}
        />

        <Row
          label="Packing Date"
          value={new Date(
            packingList.packingDate
          ).toLocaleDateString()}
        />

        <Row
          label="Created"
          value={new Date(
            packingList.createdAt
          ).toLocaleDateString()}
        />

        <Row
          label="Last Updated"
          value={new Date(
            packingList.updatedAt
          ).toLocaleDateString()}
        />

      </div>

    </div>
  );
}