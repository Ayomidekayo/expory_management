import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  useGateMovement,
  useUpdateGateMovement,
} from "../../hooks/gates/useGateMovements";

import type {
  GateMovementStatus,
  GateType,
} from "../../api/gate-movement.api";

export default function EditGateMovementPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const {
    data: response,
    isLoading,
    isError,
  } = useGateMovement(id);

  const updateGate =
    useUpdateGateMovement();

  const movement = response?.data;

  /* =========================================
     FORM STATE
  ========================================= */

  const [containerNumber, setContainerNumber] =
    useState("");

  const [yardStoreNumber, setYardStoreNumber] =
    useState("");

  const [truckFrontPlate, setTruckFrontPlate] =
    useState("");

  const [truckBackPlate, setTruckBackPlate] =
    useState("");

  const [gateType, setGateType] =
    useState<GateType>("TERMINAL_GATE");

  const [status, setStatus] =
    useState<GateMovementStatus>("PENDING");

  const [notes, setNotes] =
    useState("");

  /* =========================================
     LOAD MOVEMENT INTO FORM
  ========================================= */

  useEffect(() => {
    if (!movement) return;

    setContainerNumber(
      movement.containerNumber || ""
    );

    setYardStoreNumber(
      movement.yardStoreNumber || ""
    );

    setTruckFrontPlate(
      movement.truckFrontPlate || ""
    );

    setTruckBackPlate(
      movement.truckBackPlate || ""
    );

    setGateType(movement.gateType);

    setStatus(movement.status);

    setNotes(movement.notes || "");
  }, [movement]);

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!movement) return;

    const trimmedContainerNumber =
      containerNumber.trim();

    const trimmedFrontPlate =
      truckFrontPlate.trim();

    const trimmedBackPlate =
      truckBackPlate.trim();

    if (!trimmedContainerNumber) {
      return;
    }

    if (!trimmedFrontPlate) {
      return;
    }

    if (!trimmedBackPlate) {
      return;
    }

    updateGate.mutate(
      {
        id: movement.id,

        payload: {
          /*
           * Required by UpdateGateMovementDto.
           * Kept read-only in the UI because the
           * container relationship should not be
           * changed from this page.
           */
          containerId:
            movement.containerId ||
            undefined,

          containerNumber:
            trimmedContainerNumber,

          yardStoreNumber:
            yardStoreNumber.trim() || undefined,

          truckFrontPlate:
            trimmedFrontPlate,

          truckBackPlate:
            trimmedBackPlate,

          gateType,

          status,

          notes:
            notes.trim() || undefined,
        },
      },

      {
        onSuccess: () => {
          navigate(
            `/gates/${movement.id}`
          );
        },
      }
    );
  };

  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-slate-200" />

        <div className="rounded-2xl bg-slate-100 p-8">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-white"
                />
              )
            )}
          </div>
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
          onClick={() =>
            navigate("/gates")
          }
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={17} />
          Back to Gates
        </button>
      </div>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/gates/${movement.id}`
              )
            }
            className="mt-1 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
            aria-label="Back to gate movement"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-sm text-slate-500">
              Gate Movement
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              Edit Gate Movement
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {movement.containerNumber}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          FORM
      ===================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ===================================
            READ-ONLY RELATIONSHIP
        =================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold text-slate-900">
              Movement Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Container and shipment relationships
              cannot be changed from this page.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">

            <ReadOnlyField
              label="Container"
              value={
                movement.containerNumber ||
                "—"
              }
            />

            <ReadOnlyField
              label="Shipment"
              value={
                movement.container?.shipment
                  ?.shipmentNumber ||
                "Not linked"
              }
            />

            <ReadOnlyField
              label="Shipment Status"
              value={
                movement.container?.shipment
                  ?.status || "—"
              }
            />

            <ReadOnlyField
              label="Transport Mode"
              value={
                movement.container?.shipment
                  ?.transportMode || "—"
              }
            />
          </div>
        </section>

        {/* ===================================
            EDITABLE GATE DETAILS
        =================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold text-slate-900">
              Gate Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the operational information
              recorded for this gate movement.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">

            {/* Container Number */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Container Number
              </label>

              <input
                value={containerNumber}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 outline-none"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Container assignment cannot be changed here.
              </p>
            </div>

            {/* Yard */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Yard / Store Number
              </label>

              <input
                value={yardStoreNumber}
                onChange={(event) =>
                  setYardStoreNumber(
                    event.target.value
                  )
                }
                placeholder="Enter yard/store number"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Gate */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Gate Type
              </label>

              <select
                value={gateType}
                onChange={(event) =>
                  setGateType(
                    event.target.value as GateType
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="TERMINAL_GATE">
                  Terminal Gate
                </option>

                <option value="ECOWAS_GATE">
                  ECOWAS Gate
                </option>
              </select>
            </div>

            {/* Front plate */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Truck Front Plate
              </label>

              <input
                value={truckFrontPlate}
                onChange={(event) =>
                  setTruckFrontPlate(
                    event.target.value
                  )
                }
                placeholder="Enter front plate"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Back plate */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Truck Back Plate
              </label>

              <input
                value={truckBackPlate}
                onChange={(event) =>
                  setTruckBackPlate(
                    event.target.value
                  )
                }
                placeholder="Enter back plate"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Status */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as GateMovementStatus
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
            </div>
          </div>
        </section>

        {/* ===================================
            NOTES
        =================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold text-slate-900">
              Notes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add or update additional information
              about this movement.
            </p>
          </div>

          <div className="p-6">
            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={5}
              placeholder="Enter notes..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </section>

        {/* ===================================
            ACTIONS
        =================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/gates/${movement.id}`
              )
            }
            disabled={updateGate.isPending}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              updateGate.isPending ||
              !containerNumber.trim() ||
              !truckFrontPlate.trim() ||
              !truckBackPlate.trim()
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateGate.isPending ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================
   READ ONLY FIELD
========================================= */

function ReadOnlyField({
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