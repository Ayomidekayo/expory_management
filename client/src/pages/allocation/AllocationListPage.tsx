import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";

import { Button } from "../../components/ui/button";
import AllocationStatisticsCards from "../../components/allocation/AllocationStatisticsCards";
import type { AllocationQuery } from "../../types/allocation.types";
import { useAllocations } from "../../hooks/allocation/useAllocations";
import AllocationTable from "../../components/allocation/AllocationTable";

export default function AllocationListPage() {
  const [filters, setFilters] = useState<AllocationQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",

    // Earliest → Latest
    sortOrder: "asc",
  });

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useAllocations(filters);

  const allocations = data?.data ?? [];

  const currentPage =
    data?.pagination?.page ??
    filters.page ??
    1;

  const pageLimit =
    data?.pagination?.limit ??
    filters.limit ??
    10;

  const totalPages =
    data?.pagination?.totalPages ?? 1;

  const total =
    data?.pagination?.total ??
    allocations.length;

  const hasPreviousPage =
    currentPage > 1;

  const hasNextPage =
    currentPage < totalPages;

  function handlePrevious() {
    if (!hasPreviousPage || isFetching) {
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
    if (!hasNextPage || isFetching) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      page: (prev.page ?? 1) + 1,
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
            Allocations
          </h1>

          <p className="text-muted-foreground">
            Manage export allocations.
          </p>
        </div>

        <Button asChild>
          <Link to="/allocations/new">
            <Plus className="mr-2 h-4 w-4" />
            New Allocation
          </Link>
        </Button>
      </div>

      {/* =========================================
          STATISTICS
      ========================================= */}

      <AllocationStatisticsCards />

      {/* =========================================
          TABLE
      ========================================= */}

      <AllocationTable
        allocations={allocations}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        currentPage={currentPage}
        pageLimit={pageLimit}
      />

      {/* =========================================
          PAGINATION
      ========================================= */}

      {!isLoading &&
        !isError &&
        totalPages > 0 && (
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
                onClick={handlePrevious}
              >
                {isFetching &&
                  hasPreviousPage && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                Previous
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={
                  !hasNextPage ||
                  isFetching
                }
                onClick={handleNext}
              >
                {isFetching &&
                  hasNextPage && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                Next
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}