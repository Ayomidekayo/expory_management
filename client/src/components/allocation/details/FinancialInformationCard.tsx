import {
  BadgeDollarSign,
  ShieldCheck,
} from "lucide-react";

import type { Allocation } from "../../../types/allocation.types";
import { Badge } from "../../ui/badge";

interface Props {
  allocation: Allocation;
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-900">
        {value ?? "-"}
      </p>
    </div>
  );
}

export default function FinancialInformationCard({
  allocation,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BadgeDollarSign className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Financial Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Commercial and payment details for this allocation.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Estimated Value"
            value={
              allocation.estimatedValue != null
                ? Number(
                    allocation.estimatedValue
                  ).toLocaleString()
                : "-"
            }
          />

          <Info
            label="Currency"
            value={allocation.currency}
          />

          <Info
            label="Payment Terms"
            value={allocation.paymentTerms}
          />

          <Info
            label="Freight Type"
            value={allocation.freightType}
          />

          {/* Insurance */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Insurance Required
            </p>

            <div className="mt-2 flex items-center gap-2">
              <ShieldCheck
                className={`h-4 w-4 ${
                  allocation.insuranceRequired
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              />

              <Badge
                variant={
                  allocation.insuranceRequired
                    ? "default"
                    : "outline"
                }
              >
                {allocation.insuranceRequired
                  ? "Required"
                  : "Not Required"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}