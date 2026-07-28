import { FileText } from "lucide-react";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

export default function RemarksCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <h2 className="flex items-center gap-2 text-lg font-semibold">

          <FileText className="h-5 w-5 text-primary" />

          Remarks

        </h2>

      </div>

      <div className="p-5">

        {shipment.remarks ? (
          <p className="leading-7 text-muted-foreground">
            {shipment.remarks}
          </p>
        ) : (
          <p className="italic text-slate-400">
            No remarks available.
          </p>
        )}

      </div>

    </div>
  );
}