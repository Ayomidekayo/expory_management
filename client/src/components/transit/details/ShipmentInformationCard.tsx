import {
  Ship,
} from "lucide-react";

import type {
  Transit,
} from "../../../types";

interface Props {
  transit: Transit;
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-right">
        {value || "-"}
      </span>

    </div>
  );
}

export default function ShipmentInformationCard({
  transit,
}: Props) {

  return (

    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Ship className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">

            Shipment Information

          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          label="Shipment"
          value={transit.shipment.shipmentNumber}
        />

        <Row
          label="Client"
          value={transit.shipment.client?.companyName}
        />

        <Row
          label="Exporter"
          value={transit.shipment.exporter?.name}
        />

        <Row
          label="Consignee"
          value={transit.shipment.consignee?.name}
        />

        <Row
          label="Container"
          value={transit.container.containerNumber}
        />

        <Row
          label="Container Type"
          value={transit.container.containerType}
        />

        <Row
          label="Container Size"
          value={transit.container.containerSize}
        />

      </div>

    </div>

  );

}