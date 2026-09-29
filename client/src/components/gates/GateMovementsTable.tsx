import {
  CheckCircle2,
  Clock3,
  DoorOpen,
  Eye,
  Pencil,
  MoreHorizontal,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type {
  GateMovement,
  GateMovementStatus,
  GateType,
} from "../../api/gate-movement.api";

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

/* =========================================
   GATE LABEL
========================================= */

function getGateLabel(
  gateType: GateType
) {
  return gateType === "ECOWAS_GATE"
    ? "ECOWAS Gate"
    : "Terminal Gate";
}

/* =========================================
   STATUS CLASSES
========================================= */

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

/* =========================================
   STATUS ICON
========================================= */

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

/* =========================================
   STATUS LABEL
========================================= */

function formatStatus(
  status: GateMovementStatus
) {
  return (
    status.charAt(0) +
    status.slice(1).toLowerCase()
  );
}

/* =========================================
   DATE FORMAT
========================================= */

function formatDate(
  value?: string | null
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString();
}

/* =========================================
   TABLE
========================================= */

export default function GateMovementsTable({
  movements,
  isLoading,
  onStatusChange,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  /* =======================================
     LOADING
  ======================================= */

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map(
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

  /* =======================================
     EMPTY
  ======================================= */

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
          Gate movements will appear here once
          they are recorded.
        </p>
      </div>
    );
  }

  /* =======================================
     TABLE
  ======================================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1350px] w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>

              {/* Yard / Store */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Yard / Store
              </th>

              {/* Shipment */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Shipment
              </th>

              {/* Container */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Container
              </th>

              {/* Truck */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Truck
              </th>

              {/* Gate */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Gate
              </th>

              {/* Status */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              {/* Date */}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>

              {/* Actions */}

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {movements.map((movement) => {

              /* =================================
                 RELATED SHIPMENT
              ================================= */

              const shipment =
                movement.container?.shipment;

              const shipmentNumber =
                shipment?.shipmentNumber;

              return (
                <tr
                  key={movement.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* ===============================
                      YARD / STORE
                  =============================== */}

                  <td className="px-5 py-4 text-sm font-medium text-slate-900">
                    {movement.yardStoreNumber ||
                      "—"}
                  </td>

                  {/* ===============================
                      SHIPMENT
                  =============================== */}

                  <td className="px-5 py-4">
                    {shipmentNumber ? (
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {shipmentNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {shipment?.status ||
                            "Shipment"}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">
                        Not linked
                      </span>
                    )}
                  </td>

                  {/* ===============================
                      CONTAINER
                  =============================== */}

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/gates/${movement.id}`
                        )
                      }
                      className="text-left text-sm font-semibold text-slate-900 transition hover:text-blue-600"
                    >
                      {movement.containerNumber}
                    </button>
                  </td>

                  {/* ===============================
                      TRUCK
                  =============================== */}

                  <td className="px-5 py-4">
                    <p className="text-xs text-slate-500">
                      Front:{" "}
                      <span className="font-medium text-slate-700">
                        {movement.truckFrontPlate ||
                          "—"}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Back:{" "}
                      <span className="font-medium text-slate-700">
                        {movement.truckBackPlate ||
                          "—"}
                      </span>
                    </p>
                  </td>

                  {/* ===============================
                      GATE
                  =============================== */}

                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {getGateLabel(
                        movement.gateType
                      )}
                    </span>
                  </td>

                  {/* ===============================
                      STATUS
                  =============================== */}

                  <td className="px-5 py-4">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        movement.status
                      )}`}
                    >
                      <StatusIcon
                        status={movement.status}
                      />

                      {formatStatus(
                        movement.status
                      )}
                    </div>
                  </td>

                  {/* ===============================
                      DATE
                  =============================== */}

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(
                      movement.createdAt
                    )}
                  </td>

                  {/* ===============================
                      ACTIONS
                  =============================== */}

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">

                      {/* View */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/gates/${movement.id}`
                          )
                        }
                        title="View gate movement"
                        aria-label="View gate movement"
                        className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/gates/${movement.id}/edit`
                          )
                        }
                        title="Edit gate movement"
                        aria-label="Edit gate movement"
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Status */}

                      <select
                        value={movement.status}
                        onChange={(event) =>
                          onStatusChange(
                            movement,
                            event.target
                              .value as GateMovementStatus
                          )
                        }
                        title="Change status"
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(movement)
                        }
                        title="Delete gate movement"
                        className="rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}