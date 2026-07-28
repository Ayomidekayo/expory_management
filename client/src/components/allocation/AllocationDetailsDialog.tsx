import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Badge } from "../ui/badge";

import type {
  Allocation,
} from "../../types/allocation.types";
import InfoCard from "./InfoCard";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocation?: Allocation;
}

export default function AllocationDetailsDialog({
  open,
  onOpenChange,
  allocation,
}: Props) {
  if (!allocation) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>

          <DialogTitle>

            Allocation Details

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-8">
            <div className="grid grid-cols-4 gap-4">

  <InfoCard
    label="Allocation No."
    value={allocation.allocationNumber}
  />

  <InfoCard
    label="Status"
    value={
      <Badge>
        {allocation.status}
      </Badge>
    }
  />

  <InfoCard
    label="Priority"
    value={
      <Badge variant="secondary">
        {allocation.priority}
      </Badge>
    }
  />

  <InfoCard
    label="Service"
    value={allocation.serviceType}
  />

</div>
<section>

<h2 className="mb-4 text-lg font-semibold">

Client Information

</h2>

<div className="grid grid-cols-2 gap-6">

<InfoCard
label="Client"
value={allocation.client.companyName}
/>

<InfoCard
label="Exporter"
value={
allocation.exporter?.name ?? "-"
}
/>

<InfoCard
label="Consignee"
value={
allocation.consignee?.name ?? "-"
}
/>

<InfoCard
label="Assigned Officer"
value={
allocation.assignedTo?.name ?? "-"
}
/>

</div>

</section>
<section>

<h2 className="mb-4 text-lg font-semibold">

Cargo

</h2>

<div className="grid grid-cols-2 gap-6">

<InfoCard
label="Description"
value={allocation.cargoDescription}
/>

<InfoCard
label="Cargo Type"
value={
allocation.cargoType ?? "-"
}
/>

<InfoCard
label="Quantity"
value={
allocation.quantity ?? "-"
}
/>

<InfoCard
label="Destination Country"
value={
allocation.destinationCountry
}
/>

<InfoCard
label="Destination City"
value={
allocation.destinationCity ?? "-"
}
/>

</div>

</section>
<section>

<h2 className="mb-4 text-lg font-semibold">

Shipment

</h2>

<div className="grid grid-cols-2 gap-6">

<InfoCard
label="Shipment"
value={
allocation.shipment
? allocation.shipment.shipmentNumber
: "Not Generated"
}
/>

<InfoCard
label="Expected Shipment Date"
value={
allocation.expectedShipmentDate ?? "-"
}
/>

</div>

</section>
<section>

<h2 className="mb-4 text-lg font-semibold">

Special Instruction

</h2>

<div className="rounded-lg border p-4">

{allocation.specialInstruction || "None"}

</div>

</section>

              </div>

      </DialogContent>

    </Dialog>
  );
}