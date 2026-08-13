import {
  Box,
  Boxes,
  Scale,
  Ruler,
} from "lucide-react";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | null;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>

      <p className="break-words text-sm font-semibold text-slate-900">
        {value !== null && value !== undefined && value !== ""
          ? value
          : "-"}
      </p>
    </div>
  );
}

export default function CargoInformationCard({
  allocation,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Box className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Cargo Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Detailed information about the allocated cargo.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            icon={Box}
            label="Cargo Description"
            value={allocation.cargoDescription}
          />

          <Info
            icon={Boxes}
            label="Cargo Type"
            value={allocation.cargoType}
          />

          <Info
            icon={Box}
            label="Commodity"
            value={allocation.commodityName}
          />

          <Info
            icon={Ruler}
            label="Commodity Code"
            value={allocation.commodityCode}
          />

          <Info
            icon={Scale}
            label="Quantity"
            value={allocation.quantity}
          />

          <Info
            icon={Boxes}
            label="Package Type"
            value={allocation.packageType}
          />

          <Info
            icon={Boxes}
            label="Number of Packages"
            value={allocation.numberOfPackages}
          />

          <Info
            icon={Scale}
            label="Gross Weight"
            value={
              allocation.grossWeight != null
                ? `${allocation.grossWeight} KG`
                : null
            }
          />

          <Info
            icon={Scale}
            label="Net Weight"
            value={
              allocation.netWeight != null
                ? `${allocation.netWeight} KG`
                : null
            }
          />

          <Info
            icon={Ruler}
            label="Volume"
            value={
              allocation.volume != null
                ? `${allocation.volume} m³`
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}