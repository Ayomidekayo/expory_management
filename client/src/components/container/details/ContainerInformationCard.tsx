import {
  Package,
} from "lucide-react";
import type { Container } from "../../../types/container.type";

interface Props {
  container: Container;
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

      <span className="font-medium text-right">
        {value || "-"}
      </span>

    </div>
  );
}

export default function ContainerInformationCard({
  container,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Package className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">

            Container Information

          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          label="Container Number"
          value={container.containerNumber}
        />

        <Row
          label="Seal Number"
          value={container.sealNumber}
        />

        <Row
          label="Type"
          value={container.containerType}
        />

        <Row
          label="Size"
          value={container.containerSize}
        />

        <Row
          label="Gross Weight"
          value={`${container.grossWeight ?? 0} KG`}
        />

        <Row
          label="Net Weight"
          value={`${container.netWeight ?? 0} KG`}
        />

        <Row
          label="Tare Weight"
          value={`${container.tareWeight ?? 0} KG`}
        />

        <Row
          label="Volume"
          value={`${container.volume ?? 0} CBM`}
        />

        <Row
          label="Condition"
          value={container.containerCondition}
        />

      </div>

    </div>
  );
}