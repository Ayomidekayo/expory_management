import type { UseFormReturn } from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import type {
  CreateTransitInput,
} from "../../../validations/transit.validation";

interface Props {
  form: UseFormReturn<CreateTransitInput>;
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

export default function Summary({
  form,
}: Props) {

  const values =
    form.watch();

  return (

    <Card>

      <CardHeader>

        <CardTitle>

          Transit Summary

        </CardTitle>

      </CardHeader>

      <CardContent>

        <Row
          label="Shipment"
          value={values.shipmentId}
        />

        <Row
          label="Container"
          value={values.containerId}
        />

        <Row
          label="Origin"
          value={values.origin}
        />

        <Row
          label="Destination"
          value={values.destination}
        />

        <Row
          label="Transport Mode"
          value={values.transportMode}
        />

        <Row
          label="Transporter"
          value={values.transporter}
        />

        <Row
          label="Quantity"
          value={
            values.quantity
              ? Number(
                  values.quantity
                ).toLocaleString()
              : "-"
          }
        />

        <Row
          label="Unit Price"
          value={
            values.unitPrice
              ? Number(
                  values.unitPrice
                ).toLocaleString()
              : "-"
          }
        />

        <Row
          label="Total Price"
          value={
            values.totalPrice
              ? Number(
                  values.totalPrice
                ).toLocaleString()
              : "-"
          }
        />

      </CardContent>

    </Card>

  );

}