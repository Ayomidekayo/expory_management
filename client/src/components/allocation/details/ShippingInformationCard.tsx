import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function ShippingInformationCard({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Shipping Information
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div>
          <p className="text-sm text-muted-foreground">
            Origin Country
          </p>

          <p className="font-medium">
            {allocation.originCountry ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Origin City
          </p>

          <p className="font-medium">
            {allocation.originCity ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Destination Country
          </p>

          <p className="font-medium">
            {allocation.destinationCountry}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Destination City
          </p>

          <p className="font-medium">
            {allocation.destinationCity ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Port of Loading
          </p>

          <p className="font-medium">
            {allocation.portOfLoading ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Port of Discharge
          </p>

          <p className="font-medium">
            {allocation.portOfDischarge ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Transport Mode
          </p>

          <p className="font-medium">
            {allocation.transportMode ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Shipping Line
          </p>

          <p className="font-medium">
            {allocation.shippingLine ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Incoterm
          </p>

          <p className="font-medium">
            {allocation.incoterm ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Pickup Date
          </p>

          <p className="font-medium">
            {allocation.pickupDate
              ? new Date(
                  allocation.pickupDate
                ).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Expected Shipment
          </p>

          <p className="font-medium">
            {allocation.expectedShipmentDate
              ? new Date(
                  allocation.expectedShipmentDate
                ).toLocaleDateString()
              : "-"}
          </p>
        </div>

      </div>

    </div>
  );
}