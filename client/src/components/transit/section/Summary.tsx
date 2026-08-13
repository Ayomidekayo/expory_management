import type { UseFormReturn } from "react-hook-form";

import {
  ClipboardList,
  Container,
  DollarSign,
  MapPin,
  Ship,
  Truck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import type {
  CreateTransitInput,
} from "../../../validations/transit.validation";

interface Props {
  form: UseFormReturn<CreateTransitInput>;
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
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
          {value || "-"}
        </span>
      </div>
    </div>
  );
}

export default function Summary({
  form,
}: Props) {
  const values = form.watch();

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      {/* =====================================
          HEADER
      ===================================== */}

      <CardHeader className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Transit Summary
            </CardTitle>

            <p className="mt-0.5 text-sm text-slate-500">
              Review the transit information before submitting.
            </p>
          </div>
        </div>
      </CardHeader>

      {/* =====================================
          CONTENT
      ===================================== */}

      <CardContent className="px-6 py-2">
        {/* Shipment */}

        <Row
          icon={<Ship className="h-4 w-4" />}
          label="Shipment"
          value={values.shipmentId}
        />

        {/* Container */}

        <Row
          icon={<Container className="h-4 w-4" />}
          label="Container"
          value={values.containerId}
        />

        {/* Origin */}

        <Row
          icon={<MapPin className="h-4 w-4" />}
          label="Origin"
          value={values.origin}
        />

        {/* Destination */}

        <Row
          icon={<MapPin className="h-4 w-4" />}
          label="Destination"
          value={values.destination}
        />

        {/* Transport Mode */}

        <Row
          icon={<Truck className="h-4 w-4" />}
          label="Transport Mode"
          value={values.transportMode}
        />

        {/* Transporter */}

        <Row
          icon={<Truck className="h-4 w-4" />}
          label="Transporter"
          value={values.transporter}
        />

        {/* Quantity */}

        <Row
          icon={<ClipboardList className="h-4 w-4" />}
          label="Quantity"
          value={
            values.quantity !== undefined &&
            values.quantity !== null &&
            values.quantity !== ""
              ? Number(values.quantity).toLocaleString()
              : "-"
          }
        />

        {/* Unit Price */}

        <Row
          icon={<DollarSign className="h-4 w-4" />}
          label="Unit Price"
          value={
            values.unitPrice !== undefined &&
            values.unitPrice !== null &&
            values.unitPrice !== ""
              ? Number(values.unitPrice).toLocaleString()
              : "-"
          }
        />

        {/* Total Price */}

        <Row
          icon={<DollarSign className="h-4 w-4" />}
          label="Total Price"
          value={
            values.totalPrice !== undefined &&
            values.totalPrice !== null &&
            values.totalPrice !== ""
              ? Number(values.totalPrice).toLocaleString()
              : "-"
          }
        />
      </CardContent>
    </Card>
  );
}