import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function WorkflowCard({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Workflow
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div>

          <p className="text-sm text-muted-foreground">
            Created By
          </p>

          <p className="font-medium">
            {allocation.createdBy?.name ?? "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">
            Assigned To
          </p>

          <p className="font-medium">
            {allocation.assignedTo?.name ?? "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">
            Approved By
          </p>

          <p className="font-medium">
            {allocation.approvedBy?.name ?? "-"}
          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">
            Assigned At
          </p>

          <p className="font-medium">
            {allocation.assignedAt
              ? new Date(
                  allocation.assignedAt
                ).toLocaleString()
              : "-"}

          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">
            Approved At
          </p>

          <p className="font-medium">
            {allocation.approvedAt
              ? new Date(
                  allocation.approvedAt
                ).toLocaleString()
              : "-"}

          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">
            Completed At
          </p>

          <p className="font-medium">
            {allocation.completedAt
              ? new Date(
                  allocation.completedAt
                ).toLocaleString()
              : "-"}

          </p>

        </div>

      </div>

    </div>
  );
}