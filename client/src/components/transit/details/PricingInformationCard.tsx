import {
  DollarSign,
} from "lucide-react";

import type {
  Transit,
} from "../../../types";

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

      <span className="font-medium">
        {value || "-"}
      </span>

    </div>
  );
}

export default function PricingInformationCard({
  transit,
}: Props) {

  return (

    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <DollarSign className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">

            Pricing

          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          label="Quantity"
          value={Number(
            transit.quantity ?? 0
          ).toLocaleString()}
        />

        <Row
          label="Unit Price"
          value={`$${Number(
            transit.unitPrice ?? 0
          ).toLocaleString()}`}
        />

        <Row
          label="Total Price"
          value={`$${Number(
            transit.totalPrice ?? 0
          ).toLocaleString()}`}
        />

        <Row
          label="Description"
          value={transit.description}
        />

      </div>

    </div>

  );

}