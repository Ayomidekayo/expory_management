import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import type { Shipment } from "../../types/shipment.types";


interface Props {
  shipment: Shipment;
}

interface DetailRowProps {
  label: string;
  value?: string | null;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

export default function ShipmentSummary({ shipment }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-2">
        {/* LEFT COLUMN */}
        <div>
          <DetailRow label="Shipment Number" value={shipment.shipmentNumber} />
          <Separator />
          <DetailRow label="XF Number" value={shipment.xfNumber} />
          <Separator />
          <DetailRow label="NXP Number" value={shipment.nxpNumber} />
          <Separator />
          <DetailRow label="CCI Number" value={shipment.cciNumber} />
          <Separator />
          <DetailRow label="E Number" value={shipment.eNumber} />
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <DetailRow label="Created By" value={shipment.createdBy.name} />
          <Separator />
          <DetailRow
            label="Shipment Date"
            value={format(new Date(shipment.shipmentDate), "PPP")}
          />
          <Separator />
          <DetailRow
            label="Created At"
            value={format(new Date(shipment.createdAt), "PPP p")}
          />
          <Separator />
          <DetailRow
            label="Last Updated"
            value={format(new Date(shipment.updatedAt), "PPP p")}
          />
          <Separator />
          <DetailRow
            label="Status"
            value={shipment.status.replaceAll("_", " ")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
