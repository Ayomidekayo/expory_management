import {
  CalendarDays,
  Ship,
  Truck,
  Clock,
} from "lucide-react";

import { Badge } from "../../ui/badge";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-right">
        {value}
      </span>
    </div>
  );
}

export default function ShipmentInformationCard({
  shipment,
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
          label="Shipment Number"
          value={shipment.shipmentNumber}
        />

        <Row
          label="Shipment Date"
          value={
            <div className="flex items-center gap-2 justify-end">

              <CalendarDays className="h-4 w-4 text-muted-foreground" />

              {new Date(
                shipment.shipmentDate
              ).toLocaleDateString()}

            </div>
          }
        />

        <Row
          label="Transport Mode"
          value={
            <Badge variant="outline">
              {shipment.transportMode}
            </Badge>
          }
        />

        <Row
          label="Status"
          value={
            <Badge variant="secondary">
              {shipment.status.replaceAll(
                "_",
                " "
              )}
            </Badge>
          }
        />

        <Row
          label="Created"
          value={
            <div className="flex items-center gap-2 justify-end">

              <Clock className="h-4 w-4 text-muted-foreground" />

              {new Date(
                shipment.createdAt
              ).toLocaleDateString()}

            </div>
          }
        />

        <Row
          label="Last Updated"
          value={
            <div className="flex items-center gap-2 justify-end">

              <Truck className="h-4 w-4 text-muted-foreground" />

              {new Date(
                shipment.updatedAt
              ).toLocaleDateString()}

            </div>
          }
        />

      </div>

    </div>
  );
}