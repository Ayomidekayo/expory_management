import {
  Scale,
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
        {value ?? "-"}
      </span>

    </div>
  );
}

export default function WeightInformationCard({
  container,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Scale className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Weight Information
          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          label="Gross Weight"
          value={`${Number(
            container.grossWeight ?? 0
          ).toLocaleString()} KG`}
        />

        <Row
          label="Net Weight"
          value={`${Number(
            container.netWeight ?? 0
          ).toLocaleString()} KG`}
        />

        <Row
          label="Tare Weight"
          value={`${Number(
            container.tareWeight ?? 0
          ).toLocaleString()} KG`}
        />

        <Row
          label="Volume"
          value={`${Number(
            container.volume ?? 0
          ).toLocaleString()} CBM`}
        />

      </div>

    </div>
  );
}