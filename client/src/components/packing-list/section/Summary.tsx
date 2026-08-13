import {
  Package,
  Scale,
  Weight,
  Calculator,
} from "lucide-react";

import type { UseFormReturn } from "react-hook-form";

import { FormField } from "../../ui/form";

import type { CreatePackingListInput } from "../../../validations/packing-list.validation";

interface Props {
  form: UseFormReturn<CreatePackingListInput>;
}

function SummaryRow({
  icon,
  label,
  value,
  unit,
  iconClassName,
  bgClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  iconClassName: string;
  bgClassName: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bgClassName}`}
        >
          <span className={iconClassName}>
            {icon}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">
            {label}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="text-lg font-bold text-slate-900">
          {value.toLocaleString("en-US", {
            minimumFractionDigits: unit === "KG" ? 2 : 0,
            maximumFractionDigits: 2,
          })}
        </span>

        {unit && (
          <span className="ml-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Summary({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Calculator className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Packing Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Automatically calculated totals from the packing items.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 py-2">
        <FormField
          control={form.control}
          name="totalPackages"
          render={({ field }) => (
            <SummaryRow
              icon={<Package className="h-5 w-5" />}
              label="Total Packages"
              value={Number(field.value) || 0}
              iconClassName="text-blue-600"
              bgClassName="bg-blue-50"
            />
          )}
        />

        <FormField
          control={form.control}
          name="grossWeight"
          render={({ field }) => (
            <SummaryRow
              icon={<Scale className="h-5 w-5" />}
              label="Gross Weight"
              value={Number(field.value) || 0}
              unit="KG"
              iconClassName="text-emerald-600"
              bgClassName="bg-emerald-50"
            />
          )}
        />

        <FormField
          control={form.control}
          name="netWeight"
          render={({ field }) => (
            <SummaryRow
              icon={<Weight className="h-5 w-5" />}
              label="Net Weight"
              value={Number(field.value) || 0}
              unit="KG"
              iconClassName="text-orange-600"
              bgClassName="bg-orange-50"
            />
          )}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3">
        <p className="text-xs text-slate-500">
          Totals are calculated automatically from the packing items.
        </p>
      </div>
    </div>
  );
}