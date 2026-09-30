import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "../../components/ui/button";

import { useConsignees } from "../../hooks/consignee/useConsignees";

import ConsigneeSummaryCards from "../../components/consignee/ConsigneeSummaryCards";
import ConsigneeTable from "../../components/consignee/ConsigneeTable";
import ConsigneeFilters from "../../components/consignee/ConsigneeFilters";

export default function ConsigneeListPage() {
  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);

  const pageLimit = 10;

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useConsignees();

  const allConsignees = data?.data ?? [];

  /*
   * Apply the filters from the URL locally.
   *
   * This avoids assuming that the backend currently supports
   * pagination/filter parameters.
   */
  const filteredConsignees = useMemo(() => {
    const search =
      searchParams.get("search")?.trim().toLowerCase() ?? "";

    const activeFilter =
      searchParams.get("isActive") ?? "";

    return allConsignees.filter((consignee) => {
      const matchesSearch =
        !search ||
        consignee.name?.toLowerCase().includes(search) ||
        consignee.contactPerson
          ?.toLowerCase()
          .includes(search) ||
        consignee.email
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        !activeFilter ||
        String(consignee.isActive) === activeFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [allConsignees, searchParams]);

  /*
   * Earliest -> latest
   */
  const sortedConsignees = useMemo(() => {
    return [...filteredConsignees].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }, [filteredConsignees]);

  /*
   * Pagination
   */
  const total = sortedConsignees.length;

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

  const paginatedConsignees =
    sortedConsignees.slice(
      startIndex,
      startIndex + pageLimit
    );

  const hasPreviousPage =
    safeCurrentPage > 1;

  const hasNextPage =
    safeCurrentPage < totalPages;

  /*
   * Reset pagination when filters change.
   */
  const search = searchParams.get("search") ?? "";
  const active = searchParams.get("isActive") ?? "";

  const filterKey = `${search}-${active}`;

  useMemo(() => {
    setCurrentPage(1);
  }, [filterKey]);

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
            Consignees
          </h1>

          <p className="text-muted-foreground">
            Manage registered consignees.
          </p>
        </div>

        <Button asChild>
          <Link to="/consignees/new">
            <Plus className="mr-2 h-4 w-4" />
            New Consignee
          </Link>
        </Button>

      </div>

      {/* =========================================
          SUMMARY
      ========================================= */}

      {!isLoading && !isError && (
        <ConsigneeSummaryCards
          consignees={filteredConsignees}
        />
      )}

      {/* =========================================
          FILTERS
      ========================================= */}

      <ConsigneeFilters />

      {/* =========================================
          FETCHING
      ========================================= */}

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing consignees...
        </div>
      )}

      {/* =========================================
          ERROR
      ========================================= */}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

          <h3 className="font-semibold text-red-800">
            Unable to load consignees
          </h3>

          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>

        </div>
      ) : (
        <ConsigneeTable
          consignees={paginatedConsignees}
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