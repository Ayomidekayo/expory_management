import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DoorOpen,
  Edit3,
  FileText,
  Package,
  Ship,
  Trash2,
  Truck,
  XCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
  useDeleteGateMovement,
  useGateMovement,
} from "../../hooks/gates/useGateMovements";

import DeleteGateMovementModal from "../../components/gates/DeleteGateMovementModal";

import { useState } from "react";

import type { GateMovementStatus } from "../../api/gate-movement.api";

/* =========================================
   HELPERS
========================================= */

function formatStatus(status: GateMovementStatus) {
  return (
    status.charAt(0) +
    status.slice(1).toLowerCase()
  );
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
    return <DoorOpen size={15} />;
  }

  if (status === "CLEARED") {
    return <CheckCircle2 size={15} />;
  }

  if (status === "CANCELLED") {
    return <XCircle size={15} />;
  }

  return <Clock3 size={15} />;
}

function formatDate(
  value?: string | null
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

/* =========================================
   PAGE
========================================= */

export default function GateDetailsPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useGateMovement(id);

  const deleteMovement =
    useDeleteGateMovement();

  const movement = response?.data;

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = () => {
    if (!movement) return;

    deleteMovement.mutate(movement.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate("/gates");
      },
    });
  };

  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" />

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl bg-slate-100"
              />
            )
          )}
        </div>
      </div>
    );
  }

  /* =========================================
     ERROR / NOT FOUND
  ========================================= */

  if (isError || !movement) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-red-800">
          Gate movement not found
        </h2>

        <p className="mt-2 text-sm text-red-600">
          The gate movement may have been deleted
          or the requested ID is invalid.
        </p>

        <button
          type="button"
          onClick={() => navigate("/gates")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={17} />
          Back to Gates
        </button>
      </div>
    );
  }

  /* =========================================
     RELATED SHIPMENT
  ========================================= */

  const shipment =
    movement.container?.shipment;

  return (
    <div className="space-y-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/gates")}
            className="mt-1 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
            aria-label="Back to gates"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-sm text-slate-500">
              Gate Movement
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {movement.containerNumber}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Gate movement details and history
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              navigate(`/gates/${movement.id}/edit`)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Edit3 size={17} />
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              setDeleteOpen(true)
            }
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </div>

      {/* =====================================
          STATUS
      ===================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Current Status
            </p>

            <div
              className={`mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                movement.status
              )}`}
            >
              <StatusIcon
                status={movement.status}
              />

              {formatStatus(movement.status)}
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Created{" "}
            <span className="font-medium text-slate-700">
              {formatDate(
                movement.createdAt
              )}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================
          MAIN INFORMATION
      ===================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ===================================
            SHIPMENT
        =================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Ship size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Shipment Information
              </h2>

              <p className="text-xs text-slate-500">
                Shipment connected to this gate movement
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <InfoItem
              label="Shipment Number"
              value={
                shipment?.shipmentNumber ||
                "Not linked"
              }
            />

            <InfoItem
              label="Shipment Status"
              value={
                shipment?.status || "—"
              }
            />

            <InfoItem
              label="Shipment Date"
              value={formatDate(
                shipment?.shipmentDate
              )}
            />

            <InfoItem
              label="Transport Mode"
              value={
                shipment?.transportMode || "—"
              }
            />

            <InfoItem
              label="Booking Number"
              value={
                shipment?.bookingNumber || "—"
              }
            />

            <InfoItem
              label="Shipping Line"
              value={
                shipment?.shippingLine || "—"
              }
            />

            <InfoItem
              label="Vessel"
              value={
                shipment?.vesselName || "—"
              }
            />

            <InfoItem
              label="Voyage Number"
              value={
                shipment?.voyageNumber || "—"
              }
            />

            <InfoItem
              label="Client"
              value={
                shipment?.client?.companyName ||
                "—"
              }
            />

            <InfoItem
              label="Exporter"
              value={
                shipment?.exporter?.name || "—"
              }
            />

            <InfoItem
              label="Consignee"
              value={
                shipment?.consignee?.name || "—"
              }
            />
          </div>
        </section>

        {/* ===================================
            CONTAINER
        =================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
              <Package size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Container Information
              </h2>

              <p className="text-xs text-slate-500">
                Container connected to this movement
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <InfoItem
              label="Container Number"
              value={movement.containerNumber}
            />

            <InfoItem
              label="Yard / Store Number"
              value={
                movement.yardStoreNumber || "—"
              }
            />

            <InfoItem
              label="Gate Type"
              value={
                movement.gateType ===
                "ECOWAS_GATE"
                  ? "ECOWAS Gate"
                  : "Terminal Gate"
              }
            />

            <InfoItem
              label="Container ID"
              value={
                movement.container?.id || "—"
              }
            />
          </div>
        </section>

        {/* ===================================
            TRUCK
        =================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Truck size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Truck Information
              </h2>

              <p className="text-xs text-slate-500">
                Vehicle information recorded at the gate
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <InfoItem
              label="Front Plate"
              value={
                movement.truckFrontPlate || "—"
              }
            />

            <InfoItem
              label="Back Plate"
              value={
                movement.truckBackPlate || "—"
              }
            />
          </div>
        </section>

        {/* ===================================
            TIMELINE
        =================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Gate Timeline
              </h2>

              <p className="text-xs text-slate-500">
                Movement timestamps
              </p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <TimelineItem
              label="Created"
              value={movement.createdAt}
            />

            <TimelineItem
              label="Cleared"
              value={movement.clearedAt}
            />

            <TimelineItem
              label="Crossed"
              value={movement.crossedAt}
            />

            <TimelineItem
              label="Last Updated"
              value={movement.updatedAt}
            />
          </div>
        </section>
      </div>

      {/* =====================================
          NOTES
      ===================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
            <FileText size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Notes
            </h2>

            <p className="text-xs text-slate-500">
              Additional information about this gate movement
            </p>
          </div>
        </div>

        <div className="p-6">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {movement.notes ||
              "No notes recorded."}
          </p>
        </div>
      </section>

      {/* =====================================
          DELETE MODAL
      ===================================== */}

      <DeleteGateMovementModal
        open={deleteOpen}
        containerNumber={
          movement.containerNumber
        }
        loading={deleteMovement.isPending}
        onClose={() => {
          if (!deleteMovement.isPending) {
            setDeleteOpen(false);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

/* =========================================
   INFO ITEM
========================================= */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* =========================================
   TIMELINE ITEM
========================================= */

function TimelineItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-500">
        <CalendarDays size={14} />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {formatDate(value)}
        </p>
      </div>
    </div>
  );
}