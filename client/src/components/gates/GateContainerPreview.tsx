import {
  Building2,
  FileText,
  Package,
  Ship,
  UserRound,
} from "lucide-react";

import type { Container } from "../../types/container.type";

interface Props {
  container: Container;
}

export default function GateContainerPreview({
  container,
}: Props) {
  const shipment =
    container.shipment;

  return (
    <div className="rounded-2xl border bg-muted/30 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Package className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h3 className="font-semibold">
            Container Information
          </h3>

          <p className="text-sm text-muted-foreground">
            Details retrieved from the container record
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoItem
          icon={Package}
          label="Container"
          value={
            container.containerNumber
          }
        />

        <InfoItem
          icon={FileText}
          label="Shipment"
          value={
            shipment?.shipmentNumber
          }
        />

        <InfoItem
          icon={Building2}
          label="Client"
          value={
            shipment?.client
              ?.companyName
          }
        />

        <InfoItem
          icon={UserRound}
          label="Exporter"
          value={
            shipment?.exporter
              ?.name
          }
        />

        <InfoItem
          icon={UserRound}
          label="Consignee"
          value={
            shipment?.consignee
              ?.name
          }
        />

        <InfoItem
          icon={Ship}
          label="Shipping Line"
          value={
            container.shippingLine
          }
        />
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4" />

        {label}
      </div>

      <p className="mt-2 truncate font-medium">
        {value || "—"}
      </p>
    </div>
  );
}