import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

import {
  Calendar,
  Package,
  Pencil,
  Truck,
  UserCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function AllocationHeader({
  allocation,
}: Props) {
  const navigate = useNavigate();

  const priorityVariant =
    allocation.priority === "URGENT"
      ? "destructive"
      : allocation.priority === "HIGH"
      ? "default"
      : "secondary";

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT */}

        <div className="space-y-3">

          <div className="flex items-center gap-3">

            <Package className="h-8 w-8 text-emerald-600" />

            <div>

              <h1 className="text-2xl font-bold">

                {allocation.allocationNumber}

              </h1>

              <p className="text-sm text-muted-foreground">

                Export Allocation

              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <Badge>

              {allocation.status.replaceAll(
                "_",
                " "
              )}
            </Badge>

            <Badge variant={priorityVariant}>

              {allocation.priority}

            </Badge>

            <Badge variant="outline">

              {allocation.serviceType.replaceAll(
                "_",
                " "
              )}

            </Badge>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex flex-wrap gap-3">

          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/allocations/${allocation.id}/edit`
              )
            }
          >
            <Pencil className="mr-2 h-4 w-4" />

            Edit

          </Button>

          <Button>

            <UserCheck className="mr-2 h-4 w-4" />

            Assign Officer

          </Button>

          <Button variant="secondary">

            <Truck className="mr-2 h-4 w-4" />

            Generate Shipment

          </Button>

        </div>

      </div>

      <Separator />

      <div className="grid gap-6 p-6 md:grid-cols-3">

        <div>

          <p className="text-sm text-muted-foreground">

            Client

          </p>

          <p className="font-semibold">

            {allocation.client.companyName}

          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">

            Destination

          </p>

          <p className="font-semibold">

            {allocation.destinationCountry}

            {allocation.destinationCity &&
              `, ${allocation.destinationCity}`}

          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">

            Expected Shipment

          </p>

          <div className="flex items-center gap-2">

            <Calendar className="h-4 w-4 text-muted-foreground" />

            <span className="font-semibold">

              {allocation.expectedShipmentDate
                ? new Date(
                    allocation.expectedShipmentDate
                  ).toLocaleDateString()
                : "-"}

            </span>

          </div>

        </div>

      </div>

    </div>
  );
}