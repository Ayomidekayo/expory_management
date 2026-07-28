import {
  CalendarDays,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

interface Props {
  shipments: any[];
}

const statusColors: Record<
  string,
  string
> = {
  DRAFT:
    "bg-yellow-100 text-yellow-700",
  PENDING:
    "bg-blue-100 text-blue-700",
  IN_TRANSIT:
    "bg-emerald-100 text-emerald-700",
  COMPLETED:
    "bg-purple-100 text-purple-700",
  CANCELLED:
    "bg-red-100 text-red-700",
};

export default function UpcomingShipmentsCard({
  shipments,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Upcoming Shipments
          </h2>

          <p className="text-sm text-slate-500">
            Next scheduled departures
          </p>

        </div>

        <Button
          asChild
          variant="outline"
          className="border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50"
        >
          <Link to="/shipments">
            View All
          </Link>
        </Button>

      </div>

      <div className="space-y-4">

        {shipments.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            No upcoming shipments.
          </p>
        ) : (
          shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="
                group
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-slate-200
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-emerald-400
                hover:bg-slate-50
                hover:shadow-md
              "
            >
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Truck className="h-6 w-6" />
                </div>

                <div>

                  <h4 className="font-semibold text-slate-900">
                    {shipment.shipmentNumber}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {shipment.client.companyName}
                  </p>

                </div>

              </div>

              <div className="space-y-2 text-right">

                <div className="flex items-center justify-end gap-2 text-sm text-slate-600">

                  <CalendarDays className="h-4 w-4 text-blue-600" />

                  {shipment.expectedDeparture
                    ? new Date(
                        shipment.expectedDeparture
                      ).toLocaleDateString()
                    : "-"}

                </div>

                <span
                  className={`
                    inline-flex
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${
                      statusColors[
                        shipment.status
                      ] ??
                      "bg-slate-100 text-slate-700"
                    }
                  `}
                >
                  {shipment.status.replaceAll(
                    "_",
                    " "
                  )}
                </span>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}