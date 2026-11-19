import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "../../components/ui/button";
import TransitStatisticsCards from "../../components/transit/TransitStatisticsCards";
import TransitTable from "../../components/transit/TransitTable";
import { useTransits } from "../../hooks/transit/useTransits";
import TransitFilters from "./TransitFilters";
import type { TransitQuery } from "../../types/transit.type";

const PAGE_SIZE = 10;

type TransitPagination = {
  total?: number;
  totalPages?: number;
};

export default function TransitsPage() {
  const [filters, setFilters] = useState<TransitQuery>({
    page: 1,
    limit: PAGE_SIZE,
  });

  const { data, isLoading, isFetching } = useTransits(filters);

  const currentPage = filters.page ?? 1;
  const pageLimit = filters.limit ?? PAGE_SIZE;

  // The API response is expected to include pagination metadata alongside data.
  // The fallback keeps the page working if the endpoint only returns the data array.
  const pagination = (
    data as (typeof data & { pagination?: TransitPagination }) | undefined
  )?.pagination;
  const records = data?.data ?? [];
  const total = pagination?.total ?? records.length;
  const totalPages = Math.max(
    1,
    pagination?.totalPages ?? Math.ceil(total / pageLimit),
  );

  const showingFrom = total === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const showingTo = Math.min(currentPage * pageLimit, total);

  const handleFiltersChange: typeof setFilters = (nextFilters) => {
    setFilters((current) => {
      const resolvedFilters =
        typeof nextFilters === "function" ? nextFilters(current) : nextFilters;

      return {
        ...current,
        ...resolvedFilters,
        page: 1,
        limit: resolvedFilters.limit ?? current.limit ?? PAGE_SIZE,
      };
    });
  };

  const goToPreviousPage = () => {
    setFilters((current) => ({
      ...current,
      page: Math.max(1, (current.page ?? 1) - 1),
    }));
  };

  const goToNextPage = () => {
    setFilters((current) => ({
      ...current,
      page: Math.min(totalPages, (current.page ?? 1) + 1),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Transits</h1>
          <p className="text-muted-foreground">
            Manage shipment transit records.
          </p>
        </div>

        <Link to="/transits/create">
          <Button className="bg-green-700 hover:bg-green-800">
            <Plus className="mr-2 h-4 w-4" />
            Create Transit
          </Button>
        </Link>
      </div>

      <TransitStatisticsCards data={records} />

      <TransitFilters
        filters={filters}
        onChange={handleFiltersChange}
      />

      <TransitTable
        data={records}
        loading={isLoading}
        currentPage={currentPage}
        pageLimit={pageLimit}
      />

      {total > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-slate-900">{showingFrom}</span>
            {" – "}
            <span className="font-medium text-slate-900">{showingTo}</span>
            {" of "}
            <span className="font-medium text-slate-900">{total.toLocaleString()}</span>
            {" transit records"}
          </p>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage <= 1 || isFetching}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages || isFetching}
                className="gap-1 bg-green-700 hover:bg-green-800"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
