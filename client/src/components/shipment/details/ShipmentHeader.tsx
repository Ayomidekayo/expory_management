import { Link } from "react-router-dom";

import {
  Pencil,
  Trash2,
  Ship,
  ArrowLeft,
} from "lucide-react";

import { Button } from "../../ui/button";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;

  onDelete?: () => void;
}

export default function ShipmentHeader({
  shipment,
  onDelete,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-start gap-4">

  <Link to="/shipments">
    <Button
      variant="outline"
      className="
        h-11
        rounded-xl
        border-slate-300
        bg-white
        px-4
        shadow-sm
        transition-all
        hover:border-emerald-500
        hover:bg-emerald-50
        hover:text-emerald-700
        hover:shadow-md
      "
    >
      <ArrowLeft className="mr-2 h-5 w-5" />
      Back
    </Button>
  </Link>

  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
    <Ship className="h-7 w-7 text-emerald-700" />
  </div>

  <div>
    <h1 className="text-3xl font-bold text-slate-900">
      {shipment.shipmentNumber}
    </h1>

    <p className="mt-1 text-slate-500">
      Shipment Details
    </p>
  </div>

</div>

        <div className="flex gap-3">

          <Button
            asChild
            variant="outline"
          >

            <Link
              to={`/shipments/${shipment.id}/edit`}
            >

              <Pencil className="mr-2 h-4 w-4" />

              Edit

            </Link>

          </Button>

          <Button
            variant="destructive"
            onClick={onDelete}
          >

            <Trash2 className="mr-2 h-4 w-4" />

            Delete

          </Button>

        </div>

      </div>

    </div>
  );
}