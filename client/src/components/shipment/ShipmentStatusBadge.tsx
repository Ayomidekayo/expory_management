import { Badge } from "../ui/badge";
import type { ShipmentStatus } from "../../types/shipment.types";

interface Props {
  status: ShipmentStatus;
}

const statusConfig: Record<
  ShipmentStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-700 border-slate-300",
  },

  READY: {
    label: "Ready",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-300",
  },

  BOOKED: {
    label: "Booked",
    className:
      "bg-purple-100 text-purple-700 border-purple-300",
  },

  LOADED: {
    label: "Loaded",
    className:
      "bg-cyan-100 text-cyan-700 border-cyan-300",
  },

  IN_TRANSIT: {
    label: "In Transit",
    className:
      "bg-blue-100 text-blue-800 border-blue-300",
  },

  ARRIVED: {
    label: "Arrived",
    className:
      "bg-amber-100 text-amber-800 border-amber-300",
  },

  CUSTOMS_CLEARANCE: {
    label: "Customs Clearance",
    className:
      "bg-orange-100 text-orange-800 border-orange-300",
  },

  DELIVERED: {
    label: "Delivered",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-300",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "bg-green-100 text-green-800 border-green-300",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-800 border-red-300",
  },
};

export default function ShipmentStatusBadge({
  status,
}: Props) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}