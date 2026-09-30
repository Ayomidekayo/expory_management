import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import { useContainers } from "../../hooks/container/useContainers";

import ContainerTable from "../../components/container/ContainerTable";

import type { ContainerQuery } from "../../types/container.type";

export default function ContainerListPage() {
  /* =========================================
     FILTERS / PAGINATION
  ========================================= */

  const [filters, setFilters] = useState<ContainerQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  /* =========================================
     GET CONTAINERS
  ========================================= */

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useContainers(filters);

  const containers = Array.isArray(data)
    ? data
    : data?.data ?? [];

  const pagination = Array.isArray(data)
    ? undefined
    : data?.pagination;

  /* =========================================
     PAGINATION DATA
  ========================================= */

  const currentPage =
    pagination?.page ??
    filters.page ??
    1;

  const pageLimit =
    pagination?.limit ??
    filters.limit ??
    10;

  const totalPages =
    pagination?.totalPages ??
    1;

  const total =
    pagination?.total ??
    containers.length;

  const hasPreviousPage =
    currentPage > 1;

  const hasNextPage =
    currentPage < totalPages;

  /* =========================================
     PAGINATION HANDLERS
  ========================================= */

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
    <div className="space-y-6">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Containers
          </h1>

          <p className="text-muted-foreground">
            Manage shipment containers.
          </p>
        </div>

        <Button asChild>
          <Link to="/containers/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Container
          </Link>
        </Button>
      </div>

      {/* =========================================
          FETCHING
      ========================================= */}

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing containers...
        </div>
      )}

      {/* =========================================
          ERROR
      ========================================= */}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="font-semibold text-red-800">
            Unable to load containers
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
        <ContainerTable
          data={containers}
          loading={isLoading}
          currentPage={currentPage}
          pageLimit={pageLimit}
        />
      )}

      {/* =========================================
          PAGINATION
      ========================================= */}

      {!isLoading &&
        !isError &&
        containers.length > 0 && (
          <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

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
                Next
              </Button>
            </div>

          </div>
        )}
    </div>
  );
}