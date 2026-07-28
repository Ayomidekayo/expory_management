import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function ServiceInformationCard({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Service Information
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div>

          <p className="text-sm text-muted-foreground">
            Service Type
          </p>

          <p className="font-medium">
            {allocation.serviceType.replaceAll("_", " ")}
          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">
            Priority
          </p>

          <p className="font-medium">
            {allocation.priority}
          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <p className="font-medium">
            {allocation.status.replaceAll("_", " ")}
          </p>

        </div>

      </div>

    </div>
  );
}