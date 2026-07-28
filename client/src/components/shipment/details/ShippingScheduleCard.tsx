import {
  CalendarClock,
  PlaneTakeoff,
  PlaneLanding,
  Clock3,
} from "lucide-react";

import { Badge } from "../../ui/badge";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

function ScheduleRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  const hasValue = !!value;

  return (
    <div className="flex items-center justify-between border-b py-4 last:border-0">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-sm font-medium">
          {label}
        </span>

      </div>

      {hasValue ? (
        <span className="font-medium">
          {new Date(value).toLocaleDateString()}
        </span>
      ) : (
        <Badge variant="secondary">
          Pending
        </Badge>
      )}

    </div>
  );
}

export default function ShippingScheduleCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <h2 className="flex items-center gap-2 text-lg font-semibold">

          <CalendarClock className="h-5 w-5 text-primary" />

          Shipping Schedule

        </h2>

      </div>

      <div className="p-5">

        <ScheduleRow
          icon={
            <PlaneTakeoff className="h-4 w-4 text-blue-600" />
          }
          label="Expected Departure"
          value={shipment.expectedDeparture}
        />

        <ScheduleRow
          icon={
            <PlaneLanding className="h-4 w-4 text-green-600" />
          }
          label="Expected Arrival"
          value={shipment.expectedArrival}
        />

        <ScheduleRow
          icon={
            <Clock3 className="h-4 w-4 text-orange-600" />
          }
          label="Actual Departure"
          value={shipment.actualDeparture}
        />

        <ScheduleRow
          icon={
            <Clock3 className="h-4 w-4 text-red-600" />
          }
          label="Actual Arrival"
          value={shipment.actualArrival}
        />

      </div>

    </div>
  );
}