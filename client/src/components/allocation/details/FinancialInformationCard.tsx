import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function FinancialInformationCard({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Financial Information
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div>
          <p className="text-sm text-muted-foreground">
            Estimated Value
          </p>

          <p className="font-medium">
            {allocation.estimatedValue ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Currency
          </p>

          <p className="font-medium">
            {allocation.currency ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Payment Terms
          </p>

          <p className="font-medium">
            {allocation.paymentTerms ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Freight Type
          </p>

          <p className="font-medium">
            {allocation.freightType ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Insurance Required
          </p>

          <p className="font-medium">
            {allocation.insuranceRequired
              ? "Yes"
              : "No"}
          </p>
        </div>

      </div>

    </div>
  );
}