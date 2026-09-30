import {
  Plus,
  RefreshCw,
  Search,
  Loader2,
} from "lucide-react";

import { useMemo, useState } from "react";
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

  /* =========================================
     FILTERS
  ========================================= */

  const [search, setSearch] = useState("");

  const [gateType, setGateType] =
    useState<GateType | "">("");

  const [status, setStatus] =
    useState<GateMovementStatus | "">("");

  /* =========================================
     PAGINATION
  ========================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const pageLimit = 10;

  /* =========================================
     BUILD QUERY
  ========================================= */

  const filters = {
    ...(search.trim()
      ? {
          search: search.trim(),
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

  /* =========================================
     GET GATE MOVEMENTS
  ========================================= */

  const {
    data: movementsResponse,
    isLoading,
    refetch,
    isFetching,
  } = useGateMovements(filters);

  /*
   * Current API response:
   *
   * {
   *   success: boolean;
   *   data: GateMovement[];
   * }
   */

  const movements =
    movementsResponse?.data ?? [];

  /* =========================================
     SORT + PAGINATE
  ========================================= */

  const sortedMovements = useMemo(() => {
    return [...movements].sort((a, b) => {
      const dateA = new Date(
        a.createdAt
      ).getTime();

      const dateB = new Date(
        b.createdAt
      ).getTime();

      return dateA - dateB;
    });
  }, [movements]);

  const total = sortedMovements.length;

  const totalPages = Math.max(
    Math.ceil(total / pageLimit),
    1
  );

  /*
   * Prevent current page from going beyond
   * the available pages after filtering/deleting.
   */
  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * pageLimit;

  const paginatedMovements =
    sortedMovements.slice(
      startIndex,
      startIndex + pageLimit
    );

  const hasPreviousPage =
    safeCurrentPage > 1;

  const hasNextPage =
    safeCurrentPage < totalPages;

  /* =========================================
     STATISTICS
  ========================================= */

  const {
    data: statisticsResponse,
    isLoading: statisticsLoading,
  } = useGateStatistics();

  /* =========================================
     MUTATIONS
  ========================================= */

  const updateStatus =
    useUpdateGateMovementStatus();

  const deleteMovement =
    useDeleteGateMovement();

  /* =========================================
     STATUS CHANGE
  ========================================= */

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

  /* =========================================
     DELETE
  ========================================= */

  const [
    movementToDelete,
    setMovementToDelete,
  ] = useState<GateMovement | null>(null);

  const handleDelete = (
    movement: GateMovement
  ) => {
    setMovementToDelete(movement);
  };

  const handleConfirmDelete = () => {
    if (!movementToDelete) {
      return;
    }

    deleteMovement.mutate(
      movementToDelete.id,
      {
        onSuccess: () => {
          setMovementToDelete(null);

          /*
           * If the deleted item was the only item
           * on the current page, move back one page.
           */
          if (
            paginatedMovements.length === 1 &&
            safeCurrentPage > 1
          ) {
            setCurrentPage(
              safeCurrentPage - 1
            );
          }
        },
      }
    );
  };

  /* =========================================
     PAGINATION HANDLERS
  ========================================= */

  function handlePrevious() {
    if (
      !hasPreviousPage ||
      isFetching
    ) {
      return;
    }

    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  }

  function handleNext() {
    if (
      !hasNextPage ||
      isFetching
    ) {
      return;
    }

    setCurrentPage((page) =>
      Math.min(
        page + 1,
        totalPages
      )
    );
  }

  /* =========================================
     FILTER HANDLERS
  ========================================= */

  function handleSearchChange(
    value: string
  ) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleGateTypeChange(
    value: GateType | ""
  ) {
    setGateType(value);
    setCurrentPage(1);
  }

  function handleStatusFilterChange(
    value: GateMovementStatus | ""
  ) {
    setStatus(value);
    setCurrentPage(1);
  }

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="space-y-6">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

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
          onClick={() =>
            navigate("/gates/create")
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Record Gate Movement
        </button>
      </div>

      {/* =========================================
          STATISTICS
      ========================================= */}

      <GateStatisticsCards
        statistics={
          statisticsResponse?.data
        }
        isLoading={statisticsLoading}
      />

      {/* =========================================
          FILTERS
      ========================================= */}

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
                handleSearchChange(
                  event.target.value
                )
              }
              placeholder="Search container number..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Gate Type */}
          <select
            value={gateType}
            onChange={(event) =>
              handleGateTypeChange(
                event.target.value as
                  | GateType
                  | ""
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
              handleStatusFilterChange(
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

      {/* =========================================
          FETCHING INDICATOR
      ========================================= */}

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing gate movements...
        </div>
      )}

      {/* =========================================
          TABLE
      ========================================= */}

      <GateMovementsTable
        movements={paginatedMovements}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        currentPage={safeCurrentPage}
        pageLimit={pageLimit}
      />

      {/* =========================================
          PAGINATION
      ========================================= */}

      {!isLoading &&
        total > 0 && (
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            {/* Page information */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Page{" "}
                <strong className="text-foreground">
                  {safeCurrentPage}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground">
                  {totalPages}
                </strong>
              </span>

              <span className="text-slate-300">
                •
              </span>

              <span>
                {total} total
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  !hasPreviousPage ||
                  isFetching
                }
                onClick={
                  handlePrevious
                }
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  !hasNextPage ||
                  isFetching
                }
                onClick={handleNext}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

      {/* =========================================
          DELETE MODAL
      ========================================= */}

      <DeleteGateMovementModal
        open={!!movementToDelete}
        containerNumber={
          movementToDelete?.containerNumber
        }
        loading={
          deleteMovement.isPending
        }
        onClose={() => {
          if (
            !deleteMovement.isPending
          ) {
            setMovementToDelete(null);
          }
        }}
        onConfirm={
          handleConfirmDelete
        }
      />
    </div>
  );
}