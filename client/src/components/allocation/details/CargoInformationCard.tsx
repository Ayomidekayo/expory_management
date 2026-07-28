import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function CargoInformationCard({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Cargo Information
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div>
          <p className="text-sm text-muted-foreground">
            Cargo Description
          </p>

          <p className="font-medium">
            {allocation.cargoDescription}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Cargo Type
          </p>

          <p className="font-medium">
            {allocation.cargoType ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Commodity
          </p>

          <p className="font-medium">
            {allocation.commodityName ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Commodity Code
          </p>

          <p className="font-medium">
            {allocation.commodityCode ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Quantity
          </p>

          <p className="font-medium">
            {allocation.quantity ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Package Type
          </p>

          <p className="font-medium">
            {allocation.packageType ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Number of Packages
          </p>

          <p className="font-medium">
            {allocation.numberOfPackages ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Gross Weight
          </p>

          <p className="font-medium">
            {allocation.grossWeight ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Net Weight
          </p>

          <p className="font-medium">
            {allocation.netWeight ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Volume
          </p>

          <p className="font-medium">
            {allocation.volume ?? "-"}
          </p>
        </div>

      </div>

    </div>
  );
}