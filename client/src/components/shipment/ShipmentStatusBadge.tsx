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

  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-300",
  },

  IN_TRANSIT: {
    label: "In Transit",
    className:
      "bg-blue-100 text-blue-800 border-blue-300",
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
  const config =
    statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}