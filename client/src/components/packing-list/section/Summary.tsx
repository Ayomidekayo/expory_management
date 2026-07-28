import {
  Package,
  Scale,
  Weight,
} from "lucide-react";

import type { UseFormReturn } from "react-hook-form";

import {
  FormField,
} from "../../ui/form";

import type { CreatePackingListInput } from "../../../validations/packing-list.validation";

interface Props {
  form: UseFormReturn<CreatePackingListInput>;
}

function SummaryRow({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b py-4 last:border-0">

      <div className="flex items-center gap-3">

        {icon}

        <span className="font-medium">
          {label}
        </span>

      </div>

      <span className="text-lg font-bold">

        {value.toLocaleString()}

        {unit && (
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {unit}
          </span>
        )}

      </span>

    </div>
  );
}

export default function Summary({
  form,
}: Props) {

  return (

    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Packing Summary
        </h2>

        <p className="text-sm text-muted-foreground">
          Automatically calculated totals.
        </p>

      </div>

      <FormField
        control={form.control}
        name="totalPackages"
        render={({ field }) => (

          <SummaryRow
            icon={
              <Package className="h-5 w-5 text-blue-600" />
            }
            label="Total Packages"
            value={Number(field.value) || 0}
          />

        )}
      />

      <FormField
        control={form.control}
        name="grossWeight"
        render={({ field }) => (

          <SummaryRow
            icon={
              <Scale className="h-5 w-5 text-green-600" />
            }
            label="Gross Weight"
            value={Number(field.value) || 0}
            unit="KG"
          />

        )}
      />

      <FormField
        control={form.control}
        name="netWeight"
        render={({ field }) => (

          <SummaryRow
            icon={
              <Weight className="h-5 w-5 text-orange-600" />
            }
            label="Net Weight"
            value={Number(field.value) || 0}
            unit="KG"
          />

        )}
      />

    </div>

  );
}