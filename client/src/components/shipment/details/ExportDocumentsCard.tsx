import {
  FileText,
  BadgeCheck,
  CircleDashed,
} from "lucide-react";

import { Badge } from "../../ui/badge";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

function DocumentRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const hasValue =
    value && value.trim() !== "";

  return (
    <div className="flex items-center justify-between border-b py-4 last:border-0">

      <div>

        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <p className="font-medium">
          {hasValue
            ? value
            : "Not Assigned"}
        </p>

      </div>

      {hasValue ? (
        <Badge className="gap-1">

          <BadgeCheck className="h-3.5 w-3.5" />

          Available

        </Badge>
      ) : (
        <Badge
          variant="secondary"
          className="gap-1"
        >

          <CircleDashed className="h-3.5 w-3.5" />

          Pending

        </Badge>
      )}

    </div>
  );
}

export default function ExportDocumentsCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <h2 className="flex items-center gap-2 text-lg font-semibold">

          <FileText className="h-5 w-5 text-primary" />

          Export Documents

        </h2>

      </div>

      <div className="p-5">

        <DocumentRow
          label="XF Number"
          value={shipment.xfNumber}
        />

        <DocumentRow
          label="NXP Number"
          value={shipment.nxpNumber}
        />

        <DocumentRow
          label="CCI Number"
          value={shipment.cciNumber}
        />

        <DocumentRow
          label="E Number"
          value={shipment.eNumber}
        />

      </div>

    </div>
  );
}