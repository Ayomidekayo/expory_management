import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "../../components/ui/button";
import ExporterTable from "../../components/exporter/ExporterTable";
import ExporterSummaryCards from "../../components/exporter/ExporterSummaryCards";

import { useExporters } from "../../hooks/exporter/useExporters";

export default function ExporterListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const pageLimit = 10;

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useExporters();

  /*
   * Keep the complete exporter list for the summary cards,
   * but sort it before applying client-side pagination.
   *
   * Earliest exporter -> latest exporter
   */
  const exporters = useMemo(() => {
    const dataList = data?.data ?? [];

    return [...dataList].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }, [data?.data]);

  /*
   * Pagination
   */
  const total = exporters.length;

  const totalPages = Math.max(
    Math.ceil(total / pageLimit),
    1
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * pageLimit;

  const paginatedExporters = exporters.slice(
    startIndex,
    startIndex + pageLimit
  );

  const hasPreviousPage =
    safeCurrentPage > 1;

  const hasNextPage =
    safeCurrentPage < totalPages;

  function handlePrevious() {
    if (
      !hasPreviousPage ||
      isFetching
    ) {
      return;
    }

    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  }

  function handleNext() {
    if (
      !hasNextPage ||
      isFetching
    ) {
      return;
    }

    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Exporters
          </h1>

          <p className="text-muted-foreground">
            Manage exporters.
          </p>
        </div>

        <Button asChild>
          <Link to="/exporters/new">
            <Plus className="mr-2 h-4 w-4" />
            New Exporter
          </Link>
        </Button>
      </div>

      {/* =========================================
          SUMMARY
      ========================================= */}

      {!isLoading && !isError && (
        <ExporterSummaryCards
          exporters={exporters}
        />
      )}

      {/* =========================================
          FETCHING
      ========================================= */}

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing exporters...
        </div>
      )}

      {/* =========================================
          ERROR
      ========================================= */}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="font-semibold text-red-800">
            Unable to load exporters
          </h3>

          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>
        </div>
      ) : (
        <ExporterTable
          exporters={paginatedExporters}
          isLoading={isLoading}
          currentPage={safeCurrentPage}
          pageLimit={pageLimit}
        />
      )}

      {/* =========================================
          PAGINATION
      ========================================= */}

      {!isLoading &&
        !isError &&
        total > 0 && (
          <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

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