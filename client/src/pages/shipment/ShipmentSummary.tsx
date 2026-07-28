import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";


interface Props {
  shipment: any;
}

export default function ShipmentSummary({
  shipment,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Shipment Summary
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div>
            <p className="text-sm text-muted-foreground">
              Exporter
            </p>

            <p className="font-semibold">
              {shipment.exporter.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Consignee
            </p>

            <p className="font-semibold">
              {shipment.consignee.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Documents
            </p>

            <p className="text-2xl font-bold">
              {shipment._count.documents}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Transit Records
            </p>

            <p className="text-2xl font-bold">
              {shipment._count.transits}
            </p>
          </div>

        </div>

      </CardContent>

    </Card>
  );
}