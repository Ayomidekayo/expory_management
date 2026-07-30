import {
  ShipWheel
} from "lucide-react";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-medium">
        {value || "-"}
      </span>

    </div>
  );
}

export default function BookingInformationCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <h2 className="flex items-center gap-2 text-lg font-semibold">

          <ShipWheel className="h-5 w-5 text-primary" />

          Booking Information

        </h2>

      </div>

      <div className="p-5">

        <Row
          label="Booking Number"
          value={shipment.bookingNumber}
        />

        <Row
          label="Shipping Line"
          value={shipment.shippingLine}
        />

        <Row
          label="Vessel Name"
          value={shipment.vesselName}
        />

        <Row
          label="Voyage Number"
          value={shipment.voyageNumber}
        />

        <Row
          label="Port of Loading"
          value={shipment.portOfLoading}
        />

        <Row
          label="Port of Discharge"
          value={shipment.portOfDischarge}
        />

      </div>

    </div>
  );
}