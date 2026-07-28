import type { UseFormReturn } from "react-hook-form";

import {
  Package,
  Truck,
  Scale,
  Ruler,
  MapPin,
} from "lucide-react";

import type {
  CreateContainerInput,
} from "../../../validations/container.validation";

interface Props {
  form: UseFormReturn<CreateContainerInput>;
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

      <span className="font-semibold text-right">
        {value || "-"}
      </span>

    </div>
  );
}

export default function Summary({
  form,
}: Props) {

  const values = form.watch();

  return (

    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <h2 className="text-lg font-semibold">

          Container Summary

        </h2>

        <p className="text-sm text-muted-foreground">

          Review the information before saving.

        </p>

      </div>

      <div className="p-5">

        <Row
          icon={
            <Package className="h-4 w-4 text-blue-600" />
          }
          label="Container Type"
          value={values.containerType}
        />

        <Row
          icon={
            <Package className="h-4 w-4 text-green-600" />
          }
          label="Container Size"
          value={values.containerSize}
        />

        <Row
          icon={
            <Truck className="h-4 w-4 text-orange-600" />
          }
          label="Status"
          value={values.status}
        />

        <Row
          icon={
            <Scale className="h-4 w-4 text-purple-600" />
          }
          label="Gross Weight"
          value={`${Number(
            values.grossWeight ?? 0
          ).toLocaleString()} KG`}
        />

        <Row
          icon={
            <Scale className="h-4 w-4 text-cyan-600" />
          }
          label="Net Weight"
          value={`${Number(
            values.netWeight ?? 0
          ).toLocaleString()} KG`}
        />

        <Row
          icon={
            <Scale className="h-4 w-4 text-pink-600" />
          }
          label="Tare Weight"
          value={`${Number(
            values.tareWeight ?? 0
          ).toLocaleString()} KG`}
        />

        <Row
          icon={
            <Ruler className="h-4 w-4 text-indigo-600" />
          }
          label="Volume"
          value={`${Number(
            values.volume ?? 0
          ).toLocaleString()} CBM`}
        />

        <Row
          icon={
            <MapPin className="h-4 w-4 text-red-600" />
          }
          label="Destination"
          value={values.destination}
        />

        <Row
          icon={
            <Truck className="h-4 w-4 text-slate-600" />
          }
          label="Shipping Line"
          value={values.shippingLine}
        />

      </div>

    </div>

  );
}