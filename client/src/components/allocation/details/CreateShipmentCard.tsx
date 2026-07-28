import { Truck } from "lucide-react";

import { Button } from "../../ui/button";

import type { Allocation } from "../../../types/allocation.types";
import { Link } from "react-router-dom";

interface Props {
  allocation: Allocation;
}

export default function CreateShipmentCard({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Shipment
          </h2>

          <p className="text-sm text-muted-foreground">
            Create a shipment from this allocation.
          </p>

        </div>

        <Button asChild>

<Link
to={`/shipments/create?allocationId=${allocation.id}`}
>

Create Shipment

</Link>

</Button>

       

      </div>

      <div className="mt-8 rounded-lg border border-dashed py-10 text-center">

        <p className="font-medium">
          No shipment has been created.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Shipment functionality will be available after the Shipment module is completed.
        </p>

      </div>

    </div>
  );
}