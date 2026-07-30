import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Separator } from "../ui/separator";

import { Badge } from "../ui/badge";

import { format } from "date-fns";
import { useTransit } from "../../hooks/transit/useTransit";


interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  transitId?: string;
}

function Row({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 py-2">

      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium break-all">
        {value || "-"}
      </span>

    </div>
  );
}

export default function TransitDetailsDialog({
  open,
  onOpenChange,
  transitId,
}: Props) {
  const { data: transit } = useTransit(
    transitId ?? ""
  );

  if (!transit) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl">

        <DialogHeader>

          <DialogTitle>

            Transit Details

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <Badge>
            {transit.transportMode}
          </Badge>

          <Separator />

          <Row
            label="Origin"
            value={transit.origin}
          />

          <Row
            label="Destination"
            value={transit.destination}
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
            label="Quantity"
            value={transit.quantity}
          />

          <Row
            label="Unit Price"
            value={
              transit.unitPrice
                ? Number(
                    transit.unitPrice
                  ).toLocaleString()
                : "-"
            }
          />

          <Row
            label="Total Price"
            value={
              transit.totalPrice
                ? Number(
                    transit.totalPrice
                  ).toLocaleString()
                : "-"
            }
          />

          <Separator />

          <Row
            label="Description"
            value={transit.description}
          />

          <Separator />

          <Row
            label="Created"
            value={format(
              new Date(transit.createdAt),
              "PPP p"
            )}
          />

          <Row
            label="Updated"
            value={format(
              new Date(transit.updatedAt),
              "PPP p"
            )}
          />

        </div>

      </DialogContent>
    </Dialog>
  );
}