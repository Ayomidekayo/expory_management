import {
  ArrowRight,
  MapPin,
  Ship,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "../../ui/button";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

export default function ShippingInformationCard({
  allocation,
}: Props) {
  const shipment = allocation.shipment;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Ship className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Shipping Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Origin, destination and transportation details.
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Origin Country"
            value={allocation.originCountry}
          />

          <Info
            label="Origin City"
            value={allocation.originCity}
          />

          <Info
            label="Destination Country"
            value={allocation.destinationCountry}
          />

          <Info
            label="Destination City"
            value={allocation.destinationCity}
          />

          <Info
            label="Port of Loading"
            value={allocation.portOfLoading}
          />

          <Info
            label="Port of Discharge"
            value={allocation.portOfDischarge}
          />

          <Info
            label="Transport Mode"
            value={allocation.transportMode}
          />

          <Info
            label="Shipping Line"
            value={allocation.shippingLine}
          />

          <Info
            label="Incoterm"
            value={allocation.incoterm}
          />

          <Info
            label="Pickup Date"
            value={
              allocation.pickupDate
                ? new Date(
                    allocation.pickupDate
                  ).toLocaleDateString()
                : "-"
            }
          />

          <Info
            label="Expected Shipment"
            value={
              allocation.expectedShipmentDate
                ? new Date(
                    allocation.expectedShipmentDate
                  ).toLocaleDateString()
                : "-"
            }
          />
        </div>

        {/* Shipment */}
        <div className="mt-8 border-t border-slate-200 pt-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <Truck className="h-4 w-4 text-slate-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Shipment
              </h3>

              <p className="text-sm text-slate-500">
                Shipment created for this allocation.
              </p>
            </div>
          </div>

          {!shipment ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>

              <h4 className="text-sm font-semibold text-slate-900">
                No Shipment Created
              </h4>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Once a shipment is created, it will
                appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-slate-50/40 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h4 className="text-base font-semibold text-slate-900">
                  {shipment.shipmentNumber}
                </h4>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                  <span>
                    Status:{" "}
                    <strong className="font-medium text-slate-700">
                      {shipment.status}
                    </strong>
                  </span>

                  <span className="text-slate-300">•</span>

                  <span>
                    Transport:{" "}
                    <strong className="font-medium text-slate-700">
                      {shipment.transportMode}
                    </strong>
                  </span>

                  {shipment.shipmentDate && (
                    <>
                      <span className="text-slate-300">•</span>

                      <span>
                        {new Date(
                          shipment.shipmentDate
                        ).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Button
                asChild
                className="shrink-0"
              >
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
    </div>
  );
}