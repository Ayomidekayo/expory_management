import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Truck,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import type { Shipment } from "../../../types/shipment.types";

import { useUpdateShipmentStatus } from "../../../hooks/shipments/useUpdateShipmentStatus";

interface Props {
  shipment: Shipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* =========================================
   STATUS OPTIONS
========================================= */

const STATUS_OPTIONS: Array<{
  value: Shipment["status"];
  label: string;
  description: string;
}> = [
  {
    value: "DRAFT",
    label: "Draft",
    description: "Shipment is still being prepared.",
  },
  {
    value: "READY",
    label: "Ready",
    description: "Shipment is ready for the next operational step.",
  },
  {
    value: "BOOKED",
    label: "Booked",
    description: "Shipment booking has been confirmed.",
  },
  {
    value: "LOADED",
    label: "Loaded",
    description: "Cargo has been loaded.",
  },
  {
    value: "IN_TRANSIT",
    label: "In Transit",
    description: "Shipment is currently in transit.",
  },
  {
    value: "ARRIVED",
    label: "Arrived",
    description: "Shipment has arrived at its destination.",
  },
  {
    value: "CUSTOMS_CLEARANCE",
    label: "Customs Clearance",
    description: "Shipment is undergoing customs clearance.",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    description: "Cargo has been delivered.",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    description: "Shipment lifecycle has been completed.",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    description: "Shipment has been cancelled.",
  },
];

/* =========================================
   HELPERS
========================================= */

function getStatusLabel(status: Shipment["status"]) {
  return (
    STATUS_OPTIONS.find((item) => item.value === status)?.label ??
    status
  );
}

function getStatusIcon(status: Shipment["status"]) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-4 w-4" />;

    case "IN_TRANSIT":
      return <Truck className="h-4 w-4" />;

    case "DRAFT":
      return <Clock3 className="h-4 w-4" />;

    default:
      return <RefreshCw className="h-4 w-4" />;
  }
}

/* =========================================
   COMPONENT
========================================= */

export default function ChangeShipmentStatusDialog({
  shipment,
  open,
  onOpenChange,
}: Props) {
  const updateStatus = useUpdateShipmentStatus();

  const [selectedStatus, setSelectedStatus] =
    useState<Shipment["status"]>(
      shipment?.status ?? "DRAFT"
    );

  /* =========================================
     SYNC WITH SHIPMENT
  ========================================= */

  useEffect(() => {
    if (shipment) {
      setSelectedStatus(shipment.status);
    }
  }, [shipment]);

  /* =========================================
     DON'T RENDER IF CLOSED
  ========================================= */

  if (!open || !shipment) {
    return null;
  }

  /*
   * IMPORTANT:
   * Create a narrowed reference after the null check.
   *
   * TypeScript now knows that currentShipment
   * can never be null inside the rest of this
   * component.
   */
  const currentShipment = shipment;

  const currentStatus = currentShipment.status;

  const hasChanged = selectedStatus !== currentStatus;

  const selectedOption = STATUS_OPTIONS.find(
    (item) => item.value === selectedStatus
  );

  const isMovingToCompleted =
    selectedStatus === "COMPLETED" &&
    currentStatus !== "COMPLETED";

  const isMovingToCancelled =
    selectedStatus === "CANCELLED" &&
    currentStatus !== "CANCELLED";

  /* =========================================
     UPDATE
  ========================================= */

  function handleUpdate() {
    if (!hasChanged) {
      return;
    }

    updateStatus.mutate(
      {
        id: currentShipment.id,
        status: selectedStatus,
      },
      {
        onSuccess: () => {
          toast.success(
            "Shipment status updated successfully."
          );

          onOpenChange(false);
        },

        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to update shipment status.";

          toast.error(message);
        },
      }
    );
  }

  /* =========================================
     CLOSE
  ========================================= */

  function handleClose() {
    if (updateStatus.isPending) {
      return;
    }

    onOpenChange(false);
  }

  return (
    <>
      {/* =====================================
          BACKDROP
      ===================================== */}

      <div
        className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
        onMouseDown={handleClose}
      />

      {/* =====================================
          MODAL
      ===================================== */}

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      >
        <div
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-status-title"
        >
          {/* =================================
              HEADER
          ================================= */}

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <RefreshCw className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    id="change-status-title"
                    className="text-lg font-semibold text-slate-900"
                  >
                    Change Shipment Status
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Update the operational status of this shipment.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={updateStatus.isPending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* =================================
              CONTENT
          ================================= */}

          <div className="space-y-5 px-6 py-6">
            {/* ===============================
                SHIPMENT INFORMATION
            =============================== */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Shipment
              </p>

              <p className="mt-1 text-base font-bold text-slate-900">
                {currentShipment.shipmentNumber}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {currentShipment.client?.companyName ??
                  "No client assigned"}
              </p>
            </div>

            {/* ===============================
                CURRENT STATUS
            =============================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Status
              </label>

              <div className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                {getStatusIcon(currentStatus)}

                <span>
                  {getStatusLabel(currentStatus)}
                </span>
              </div>
            </div>

            {/* ===============================
                NEW STATUS
            =============================== */}

            <div>
              <label
                htmlFor="shipment-status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New Status
              </label>

              <select
                id="shipment-status"
                value={selectedStatus}
                disabled={updateStatus.isPending}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target.value as Shipment["status"]
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              {selectedOption && (
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {selectedOption.description}
                </p>
              )}
            </div>

            {/* ===============================
                STATUS CHANGE NOTICE
            =============================== */}

            {hasChanged && (
              <div
                className={`rounded-xl border p-4 ${
                  isMovingToCompleted ||
                  isMovingToCancelled
                    ? "border-amber-200 bg-amber-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={
                      isMovingToCompleted ||
                      isMovingToCancelled
                        ? "mt-0.5 text-amber-600"
                        : "mt-0.5 text-blue-600"
                    }
                  >
                    {isMovingToCompleted ||
                    isMovingToCancelled ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <RefreshCw className="h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {getStatusLabel(currentStatus)} →{" "}
                      {getStatusLabel(selectedStatus)}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {selectedOption?.description}
                    </p>

                    {isMovingToCompleted && (
                      <p className="mt-2 text-xs font-semibold leading-5 text-amber-700">
                        This shipment will move into the
                        completed archive and will no longer
                        appear in the normal active shipment
                        list.
                      </p>
                    )}

                    {isMovingToCancelled && (
                      <p className="mt-2 text-xs font-semibold leading-5 text-amber-700">
                        This shipment will move into the
                        cancelled archive and will no longer
                        appear in the normal active shipment
                        list.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =================================
              FOOTER
          ================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={updateStatus.isPending}
              className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={
                !hasChanged ||
                updateStatus.isPending
              }
              className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateStatus.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}