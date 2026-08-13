import {
  Building2,
  ContactRound,
  PackageCheck,
  UserRound,
} from "lucide-react";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
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
        {value || "-"}
      </p>
    </div>
  );
}

export default function ClientInformationCard({
  allocation,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Client Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Client, exporter and consignee details.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Info
            icon={Building2}
            label="Client"
            value={allocation.client?.companyName}
          />

          <Info
            icon={ContactRound}
            label="Client Code"
            value={allocation.client?.clientCode}
          />

          <Info
            icon={PackageCheck}
            label="Exporter"
            value={allocation.exporter?.name}
          />

          <Info
            icon={UserRound}
            label="Consignee"
            value={allocation.consignee?.name}
          />
        </div>
      </div>
    </div>
  );
}