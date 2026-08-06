import {
  ArrowRight,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "../../ui/button";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function ShippingInformationCard({
  allocation,
}: Props) {
  const shipment = allocation.shipment;

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

      {/* Shipment */}

      <div className="mt-10 border-t pt-8">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h3 className="text-lg font-semibold">
              Shipment
            </h3>

            <p className="text-sm text-muted-foreground">
              Shipment created for this allocation.
            </p>

          </div>

        </div>

        {!shipment ? (

          <div className="rounded-xl border border-dashed py-10 text-center">

            <Truck className="mx-auto mb-4 h-12 w-12 text-slate-400" />

            <h4 className="text-lg font-semibold">
              No Shipment Created
            </h4>

            <p className="mt-2 text-sm text-muted-foreground">
              Once a shipment is created, it will appear here.
            </p>

          </div>

        ) : (

          <div className="flex flex-col gap-5 rounded-xl border p-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h4 className="text-lg font-semibold">
                {shipment.shipmentNumber}
              </h4>

              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">

                <span>
                  Status:
                  {" "}
                  <strong>{shipment.status}</strong>
                </span>

                <span>•</span>

                <span>
                  Transport:
                  {" "}
                  {shipment.transportMode}
                </span>

                {shipment.shipmentDate && (
                  <>
                    <span>•</span>

                    <span>
                      {new Date(
                        shipment.shipmentDate
                      ).toLocaleDateString()}
                    </span>
                  </>
                )}

              </div>

            </div>

            <Button asChild>

              <Link
                to={`/shipments/${shipment.id}`}
              >
                Open Shipment

                <ArrowRight className="ml-2 h-4 w-4" />

              </Link>

            </Button>

          </div>

        )}

      </div>

    </div>
  );
}