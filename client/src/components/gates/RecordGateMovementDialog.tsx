import {
  Loader2,
  X,
} from "lucide-react";

import { useState } from "react";

import {
  useCreateGateMovement,
} from "../../hooks/gates/useGateMovements";
import type { GateMovementStatus, GateType } from "../../api/gate-movement.api";



interface Props {
  onClose: () => void;
}

export default function RecordGateMovementDialog({
  onClose,
}: Props) {
  const createGateMovement =
    useCreateGateMovement();

  const [containerNumber, setContainerNumber] =
    useState("");

  const [yardStoreNumber, setYardStoreNumber] =
    useState("");

  const [truckFrontPlate, setTruckFrontPlate] =
    useState("");

  const [truckBackPlate, setTruckBackPlate] =
    useState("");

  const [gateType, setGateType] =
    useState<GateType>(
      "TERMINAL_GATE"
    );

  const [status, setStatus] =
    useState<GateMovementStatus>(
      "PENDING"
    );

  const [notes, setNotes] =
    useState("");

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    createGateMovement.mutate(
      {
        containerNumber:
          containerNumber.trim(),

        yardStoreNumber:
          yardStoreNumber.trim() ||
          undefined,

        truckFrontPlate:
          truckFrontPlate.trim(),

        truckBackPlate:
          truckBackPlate.trim(),

        gateType,

        status,

        notes:
          notes.trim() ||
          undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Record Gate Movement
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record a container movement through a gate.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* Container */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Container Number
            </label>

            <input
              value={containerNumber}
              onChange={(event) =>
                setContainerNumber(
                  event.target.value
                )
              }
              placeholder="e.g. MSCU1234567"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />

            <p className="mt-1.5 text-xs text-slate-500">
              Existing container selection will be connected to your container records.
            </p>
          </div>

          {/* Yard / Store */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Yard / Store Number
            </label>

            <input
              value={yardStoreNumber}
              onChange={(event) =>
                setYardStoreNumber(
                  event.target.value
                )
              }
              placeholder="e.g. YARD-001"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Truck */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Truck Front Plate
              </label>

              <input
                value={truckFrontPlate}
                onChange={(event) =>
                  setTruckFrontPlate(
                    event.target.value
                  )
                }
                placeholder="e.g. ABC-123"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Truck Back Plate
              </label>

              <input
                value={truckBackPlate}
                onChange={(event) =>
                  setTruckBackPlate(
                    event.target.value
                  )
                }
                placeholder="e.g. XYZ-456"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

          </div>

          {/* Gate */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Gate
            </label>

            <select
              value={gateType}
              onChange={(event) =>
                setGateType(
                  event.target.value as GateType
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="TERMINAL_GATE">
                Terminal Gate
              </option>

              <option value="EKO_WISE_GATE">
                Eko Wise Gate
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as GateMovementStatus
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              rows={3}
              placeholder="Optional notes..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Error */}
          {createGateMovement.isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              Unable to record gate movement. Please check the information and try again.
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createGateMovement.isPending
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createGateMovement.isPending && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              Record Movement
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}