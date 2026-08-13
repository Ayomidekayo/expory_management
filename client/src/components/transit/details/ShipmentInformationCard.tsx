import {
  Container,
  Ship,
  UserRound,
  Users,
} from "lucide-react";

import type { ReactNode } from "react";
import type { Transit } from "../../../types/transit.type";

interface Props {
  transit: Transit;
}

function Row({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(140px,0.8fr)_minmax(0,1.5fr)] items-center gap-4 border-b border-slate-100 py-4 last:border-b-0">
      {/* Label */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="min-w-0 text-right">
        <span className="break-words text-sm font-semibold text-slate-900">
          {value ?? "-"}
        </span>
      </div>
    </div>
  );
}

export default function ShipmentInformationCard({
  transit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Ship className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Shipment Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Shipment and container details associated with this transit.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="px-5">
        {/* Shipment */}

        <Row
          icon={<Ship className="h-4 w-4" />}
          label="Shipment"
          value={
            transit.shipment?.shipmentNumber ?? "-"
          }
        />

        {/* Client */}

        <Row
          icon={<Users className="h-4 w-4" />}
          label="Client"
          value={
            transit.shipment?.client?.companyName ??
            "-"
          }
        />

        {/* Exporter */}

        <Row
          icon={<UserRound className="h-4 w-4" />}
          label="Exporter"
          value={
            transit.shipment?.exporter?.name ?? "-"
          }
        />

        {/* Consignee */}

        <Row
          icon={<UserRound className="h-4 w-4" />}
          label="Consignee"
          value={
            transit.shipment?.consignee?.name ?? "-"
          }
        />

        {/* Container */}

        <Row
          icon={<Container className="h-4 w-4" />}
          label="Container"
          value={
            transit.container?.containerNumber ?? "-"
          }
        />

        {/* Container Type */}

        <Row
          icon={<Container className="h-4 w-4" />}
          label="Container Type"
          value={
            transit.container?.containerType ?? "-"
          }
        />

        {/* Container Size */}

        <Row
          icon={<Container className="h-4 w-4" />}
          label="Container Size"
          value={
            transit.container?.containerSize ?? "-"
          }
        />
      </div>
    </div>
  );
}