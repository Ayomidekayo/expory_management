import {
  CheckCircle2,
  Clock3,
  DoorOpen,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import type { GateMovement, GateMovementStatus, GateType } from "../../api/gate-movement.api";


interface Props {
  movements: GateMovement[];
  isLoading?: boolean;
  onStatusChange: (
    movement: GateMovement,
    status: GateMovementStatus
  ) => void;
  onDelete: (
    movement: GateMovement
  ) => void;
}

function getGateLabel(
  gateType: GateType
) {
  return gateType === "ECOWAS_GATE"
    ? "ECOWAS Gate"
    : "Terminal Gate";
}

function getStatusClasses(
  status: GateMovementStatus
) {
  switch (status) {
    case "CROSSED":
      return "bg-emerald-50 text-emerald-700";

    case "CLEARED":
      return "bg-blue-50 text-blue-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function StatusIcon({
  status,
}: {
  status: GateMovementStatus;
}) {
  if (status === "CROSSED") {
    return <DoorOpen size={14} />;
  }

  if (status === "CLEARED") {
    return <CheckCircle2 size={14} />;
  }

  if (status === "CANCELLED") {
    return <XCircle size={14} />;
  }

  return <Clock3 size={14} />;
}

function formatStatus(
  status: GateMovementStatus
) {
  return (
    status.charAt(0) +
    status.slice(1).toLowerCase()
  );
}

export default function GateMovementsTable({
  movements,
  isLoading,
  onStatusChange,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-slate-100"
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (!movements.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <MoreHorizontal className="text-slate-400" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No gate movements found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Gate movements will appear here once they are recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-[1100px] w-full">

          <thead className="border-b border-slate-200 bg-slate-50">

            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Yard / Store
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Container
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Truck
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Gate
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {movements.map(
              (movement) => (
                <tr
                  key={movement.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4 text-sm font-medium text-slate-900">
                    {movement.yardStoreNumber ||
                      "—"}
                  </td>

                  <td className="px-5 py-4">

                    <p className="text-sm font-semibold text-slate-900">
                      {movement.containerNumber}
                    </p>

                  </td>

                  <td className="px-5 py-4">

                    <p className="text-xs text-slate-500">
                      Front:{" "}
                      <span className="font-medium text-slate-700">
                        {movement.truckFrontPlate}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Back:{" "}
                      <span className="font-medium text-slate-700">
                        {movement.truckBackPlate}
                      </span>
                    </p>

                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {getGateLabel(
                        movement.gateType
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4">

                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        movement.status
                      )}`}
                    >
                      <StatusIcon
                        status={
                          movement.status
                        }
                      />

                      {formatStatus(
                        movement.status
                      )}
                    </div>

                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {new Date(
                      movement.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center justify-end gap-2">

                      <select
                        value={
                          movement.status
                        }
                        onChange={(event) =>
                          onStatusChange(
                            movement,
                            event.target
                              .value as GateMovementStatus
                          )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 outline-none focus:border-slate-500"
                      >
                        <option value="PENDING">
                          Pending
                        </option>

                        <option value="CLEARED">
                          Cleared
                        </option>

                        <option value="CROSSED">
                          Crossed
                        </option>

                        <option value="CANCELLED">
                          Cancelled
                        </option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(
                            movement
                          )
                        }
                        className="rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}