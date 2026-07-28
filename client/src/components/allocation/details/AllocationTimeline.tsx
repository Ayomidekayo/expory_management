import { Clock3 } from "lucide-react";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function AllocationTimeline({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6 flex items-center gap-2">

        <Clock3 className="h-5 w-5" />

        <h2 className="text-xl font-semibold">
          Timeline
        </h2>

      </div>

      <div className="space-y-5">

        <div>

          <p className="font-medium">
            Allocation Created
          </p>

          <p className="text-sm text-muted-foreground">

            {new Date(
              allocation.createdAt
            ).toLocaleString()}

          </p>

        </div>

        {allocation.assignedAt && (

          <div>

            <p className="font-medium">
              Assigned
            </p>

            <p className="text-sm text-muted-foreground">

              {new Date(
                allocation.assignedAt
              ).toLocaleString()}

            </p>

          </div>

        )}

        {allocation.approvedAt && (

          <div>

            <p className="font-medium">
              Approved
            </p>

            <p className="text-sm text-muted-foreground">

              {new Date(
                allocation.approvedAt
              ).toLocaleString()}

            </p>

          </div>

        )}

        {allocation.completedAt && (

          <div>

            <p className="font-medium">
              Completed
            </p>

            <p className="text-sm text-muted-foreground">

              {new Date(
                allocation.completedAt
              ).toLocaleString()}

            </p>

          </div>

        )}

      </div>

    </div>
  );
}