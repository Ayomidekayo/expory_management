import {
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useDeleteGateMovement,
  useGateMovements,
  useGateStatistics,
  useUpdateGateMovementStatus,
} from "../../hooks/gates/useGateMovements";

import GateStatisticsCards from "../../components/gates/GateStatisticsCards";
import GateMovementsTable from "../../components/gates/GateMovementsTable";

import type {
  GateMovement,
  GateMovementStatus,
  GateType,
} from "../../api/gate-movement.api";
import DeleteGateMovementModal from "../../components/gates/DeleteGateMovementModal";

export default function GatesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [gateType, setGateType] =
    useState<GateType | "">("");

  const [status, setStatus] =
    useState<GateMovementStatus | "">("");

  const filters = {
    ...(search.trim()
      ? {
          containerNumber: search.trim(),
        }
      : {}),

    ...(gateType
      ? {
          gateType,
        }
      : {}),

    ...(status
      ? {
          status,
        }
      : {}),
  };

  /*
   * Gate movements
   *
   * API returns:
   * {
   *   success: boolean,
   *   data: GateMovement[]
   * }
   *
   * So we extract the actual array using .data
   */
  const {
    data: movementsResponse,
    isLoading,
    refetch,
    isFetching,
  } = useGateMovements(filters);

  const movements = movementsResponse?.data ?? [];

  /*
   * Statistics
   *
   * API returns:
   * {
   *   success: boolean,
   *   data: GateStatistics
   * }
   */
  const {
    data: statisticsResponse,
    isLoading: statisticsLoading,
  } = useGateStatistics();

  const updateStatus =
    useUpdateGateMovementStatus();

  const deleteMovement =
    useDeleteGateMovement();

  const handleStatusChange = (
    movement: GateMovement,
    nextStatus: GateMovementStatus
  ) => {
    if (movement.status === nextStatus) {
      return;
    }

    updateStatus.mutate({
      id: movement.id,
      status: nextStatus,
    });
  };
const [movementToDelete, setMovementToDelete] =
  useState<GateMovement | null>(null);
const handleDelete = (movement: GateMovement) => {
  setMovementToDelete(movement);
};
const handleConfirmDelete = () => {
  if (!movementToDelete) return;

  deleteMovement.mutate(movementToDelete.id, {
    onSuccess: () => {
      setMovementToDelete(null);
    },
  });
};

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gates
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track container movements through the terminal and ECOWAS gates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/gates/create")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />

          Record Gate Movement
        </button>

      </div>

      {/* Statistics */}
      <GateStatisticsCards
        statistics={statisticsResponse?.data}
        isLoading={statisticsLoading}
      />

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px_auto]">

          {/* Search */}
          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search container number..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

          </div>

          {/* Gate Type */}
          <select
            value={gateType}
            onChange={(event) =>
              setGateType(
                event.target.value as GateType | ""
              )
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            <option value="">
              All Gates
            </option>

            <option value="TERMINAL_GATE">
              Terminal Gate
            </option>

            <option value="ECOWAS_GATE">
              ECOWAS Gate
            </option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | GateMovementStatus
                  | ""
              )
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            <option value="">
              All Statuses
            </option>

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

          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw
              size={17}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

      </div>

      {/* Gate Movements Table */}
      <GateMovementsTable
        movements={movements}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
<DeleteGateMovementModal
  open={!!movementToDelete}
  containerNumber={movementToDelete?.containerNumber}
  loading={deleteMovement.isPending}
  onClose={() => {
    if (!deleteMovement.isPending) {
      setMovementToDelete(null);
    }
  }}
  onConfirm={handleConfirmDelete}
/>
    </div>
  );
}