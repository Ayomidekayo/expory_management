


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

      <div className="rounded-xl border bg-white p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {allocation.status.replaceAll(
                "_",
                " "
              )}
            </h3>

          </div>

          <Flag className="h-8 w-8 text-primary" />

        </div>

      </div>

      {/* Priority */}

      <div className="rounded-xl border bg-white p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Priority
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {allocation.priority}
            </h3>

          </div>

          <Briefcase className="h-8 w-8 text-primary" />

        </div>

      </div>

      {/* Client */}

      <div className="rounded-xl border bg-white p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Client
            </p>

            <h3 className="mt-2 text-lg font-bold">
              {allocation.client.companyName}
            </h3>

          </div>

          <User className="h-8 w-8 text-primary" />

        </div>

      </div>

      {/* Shipment */}

      <div className="rounded-xl border bg-white p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Shipment
            </p>

            <h3 className="mt-2 text-lg font-bold">

              {allocation.shipment
                ? allocation.shipment
                    .shipmentNumber
                : "Not Created"}

            </h3>

          </div>

          <Truck className="h-8 w-8 text-primary" />

        </div>

      </div>

    </div>
  );
}