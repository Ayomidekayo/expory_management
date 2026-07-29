import {
  Truck,
} from "lucide-react";
import type { Transit } from "../../../types/transit.type";


interface Props {
  transit: Transit;
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="max-w-[55%] break-words text-right font-medium">
        {value || "-"}
      </span>

    </div>
  );
}

export default function TransitInformationCard({
  transit,
}: Props) {

  return (

    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Truck className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">

            Transit Information

          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          label="Transit Number"
          value={transit.transitNumber}
        />

        <Row
          label="Origin"
          value={transit.origin}
        />

        <Row
          label="Destination"
          value={transit.destination}
        />

        <Row
          label="Transport Mode"
          value={transit.transportMode}
        />

        <Row
          label="Transporter"
          value={transit.transporter}
        />

        <Row
          label="Transit Invoice"
          value={transit.transitInvoice}
        />

        <Row
          label="Agent Number"
          value={transit.agentNumber}
        />

        <Row
          label="Exporter Number"
          value={transit.exporterNumber}
        />

        <Row
          label="WIB Number"
          value={transit.wibNumber}
        />

        <Row
          label="Created"
          value={new Date(
            transit.createdAt
          ).toLocaleDateString()}
        />

        <Row
          label="Last Updated"
          value={new Date(
            transit.updatedAt
          ).toLocaleDateString()}
        />

      </div>

    </div>

  );

}