import { ShipWheel } from "lucide-react";

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
    <div className="flex items-center justify-between gap-6 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[60%] break-words text-right text-sm font-medium text-slate-900">
        {value || "-"}
      </span>
    </div>
  );
}

export default function BookingInformationCard({
  shipment,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShipWheel className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Booking Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Shipping and vessel booking details.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
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