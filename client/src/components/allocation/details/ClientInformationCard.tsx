import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function ClientInformationCard({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Client Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <p className="text-sm text-muted-foreground">
            Client
          </p>

          <p className="font-medium">
            {allocation.client.companyName}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Client Code
          </p>

          <p className="font-medium">
            {allocation.client.clientCode}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Exporter
          </p>

          <p className="font-medium">
            {allocation.exporter?.name ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Consignee
          </p>

          <p className="font-medium">
            {allocation.consignee?.name ?? "-"}
          </p>
        </div>

      </div>

    </div>
  );
}