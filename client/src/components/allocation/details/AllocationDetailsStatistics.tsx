import {
  User,
  Truck,
  Briefcase,
  Flag,
} from "lucide-react";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function AllocationDetailsStatistics({
  allocation,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Status */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {allocation.status.replaceAll("_", " ")}
            </h3>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            <Flag className="h-7 w-7 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Priority */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Priority
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {allocation.priority}
            </h3>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
            <Briefcase className="h-7 w-7 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Client */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              Client
            </p>

            <h3 className="mt-2 truncate text-lg font-bold text-slate-900">
              {allocation.client.companyName}
            </h3>
          </div>

          <div className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <User className="h-7 w-7 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Shipment */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              Shipment
            </p>

            <h3 className="mt-2 truncate text-lg font-bold text-slate-900">
              {allocation.shipment
                ? allocation.shipment.shipmentNumber
                : "Not Created"}
            </h3>
          </div>

          <div className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <Truck className="h-7 w-7 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}