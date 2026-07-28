import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function RemarksCard({
  allocation,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Remarks
      </h2>

      <div className="space-y-6">

        <div>

          <p className="mb-2 text-sm text-muted-foreground">
            Special Instructions
          </p>

          <div className="rounded-lg border bg-slate-50 p-4">

            {allocation.specialInstruction || "-"}

          </div>

        </div>

        <div>

          <p className="mb-2 text-sm text-muted-foreground">
            Internal Remarks
          </p>

          <div className="rounded-lg border bg-slate-50 p-4">

            {allocation.internalRemark || "-"}

          </div>

        </div>

      </div>

    </div>
  );
}