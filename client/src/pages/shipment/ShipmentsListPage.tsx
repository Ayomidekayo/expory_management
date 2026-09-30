import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";

import { Button } from "../../components/ui/button";

import ShipmentStatisticsCards from "../../components/shipment/ShipmentStatisticsCards";
import ShipmentTable from "../../components/shipment/ShipmentTable";

import { useShipments } from "../../hooks/shipments/useShipments";

import type { ShipmentQuery } from "../../types/shipment.types";

export default function ShipmentListPage() {
  /* =========================================
     FILTERS
  ========================================= */

  const [filters, setFilters] =
    useState<ShipmentQuery>({
      page: 1,
      limit: 10,
      sortBy: "shipmentDate",
      sortOrder: "asc",
    });

  /* =========================================
     GET SHIPMENTS
  ========================================= */

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useShipments(filters);

  /* =========================================
     DATA
  ========================================= */

  const shipments = data?.data ?? [];

  const currentPage =
    data?.pagination?.page ??
    filters.page ??
    1;

  const pageLimit =
    data?.pagination?.limit ??
    filters.limit ??
    10;

  const totalPages =
    data?.pagination?.totalPages ??
    1;

  const total =
    data?.pagination?.total ??
    shipments.length;

  const hasPreviousPage =
    currentPage > 1;

  const hasNextPage =
    currentPage < totalPages;

  /* =========================================
     PAGINATION
  ========================================= */

  function handlePrevious() {
    if (
      !hasPreviousPage ||
      isFetching
    ) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      page: Math.max(
        (prev.page ?? 1) - 1,
        1
      ),
    }));
  }

  function handleNext() {
    if (
      !hasNextPage ||
      isFetching
    ) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      page:
        (prev.page ?? 1) + 1,
    }));
  }

  return (
    <div className="space-y-8">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Shipments
          </h1>

          <p className="text-muted-foreground">
            Manage export shipments.
          </p>
        </div>

        <Button asChild>
          <Link to="/shipments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Link>
        </Button>

      </div>

      {/* =========================================
          STATISTICS
      ========================================= */}

      <ShipmentStatisticsCards />

      {/* =========================================
          FETCHING
      ========================================= */}

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing shipments...
        </div>
      )}

      {/* =========================================
          ERROR
      ========================================= */}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="font-semibold text-red-800">
            Unable to load shipments
          </h3>

          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>
        </div>
      )}

      {/* =========================================
          TABLE
      ========================================= */}

      {!isError && (
        <ShipmentTable
          shipments={shipments}
          isLoading={isLoading}
          currentPage={currentPage}
          pageLimit={pageLimit}
        />
      )}

      {/* =========================================
          PAGINATION
      ========================================= */}

      {!isLoading &&
        !isError &&
        shipments.length > 0 && (
          <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            {/* PAGE INFORMATION */}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">

              <span>
                Page{" "}
                <strong className="text-foreground">
                  {currentPage}
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

            {/* BUTTONS */}

            <div className="flex gap-2">

              <Button
                type="button"
                variant="outline"
                disabled={
                  !hasPreviousPage ||
                  isFetching
                }
                onClick={
                  handlePrevious
                }
              >
                Previous
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={
                  !hasNextPage ||
                  isFetching
                }
                onClick={
                  handleNext
                }
              >
                Next
              </Button>

            </div>

          </div>
        )}

    </div>
  );
}