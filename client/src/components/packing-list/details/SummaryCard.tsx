import {
  Boxes,
  Scale,
  Weight,
  Package,
  Container,
  FileText,
} from "lucide-react";
import type { PackingList } from "../../../types/packing-list";


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
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-sm text-muted-foreground">
          {label}
        </span>

      </div>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  );
}

export default function SummaryCard({
  packingList,
}: Props) {

  const totalItems =
    packingList.items.length;

  const totalContainers =
    packingList.containers?.length ?? 0;

  const totalDocuments =
    packingList.documents?.length ?? 0;

  return (

    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Boxes className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Summary
          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          icon={<Package className="h-4 w-4 text-blue-600" />}
          label="Items"
          value={totalItems}
        />

        <Row
          icon={<Boxes className="h-4 w-4 text-purple-600" />}
          label="Packages"
          value={packingList.totalPackages ?? 0}
        />

        <Row
          icon={<Scale className="h-4 w-4 text-green-600" />}
          label="Gross Weight"
          value={`${Number(
            packingList.grossWeight
          ).toLocaleString()} KG`}
        />

        <Row
          icon={<Weight className="h-4 w-4 text-orange-600" />}
          label="Net Weight"
          value={`${Number(
            packingList.netWeight
          ).toLocaleString()} KG`}
        />

        <Row
          icon={<Container className="h-4 w-4 text-cyan-600" />}
          label="Containers"
          value={totalContainers}
        />

        <Row
          icon={<FileText className="h-4 w-4 text-red-600" />}
          label="Documents"
          value={totalDocuments}
        />

      </div>

    </div>

  );
}