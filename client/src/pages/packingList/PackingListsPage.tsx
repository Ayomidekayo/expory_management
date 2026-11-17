import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Loader2,
  Package,
  Plus,
  Search,
  Truck,
  X,
} from "lucide-react";

import { Button } from "../../components/ui/button";

import PackingListStatisticsCards from "../../components/packing-list/PackingListStatisticsCards";
import PackingListTable from "../../components/packing-list/PackingListTable";
import PackingListFilters from "./PackingListFilters";

import { usePackingLists } from "../../hooks/packingList/usePackingLists";

import type { PackingListQuery } from "../../types/packing-list";

const DEFAULT_FILTERS: PackingListQuery = {
  page: 1,
  limit: 10,
  search: "",
  sortBy: "createdAt",
  sortOrder: "asc",
};

function formatDisplayDate(value: unknown): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDisplayNumber(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";

  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? new Intl.NumberFormat().format(numericValue)
    : String(value);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-800" title={value}>
        {value}
      </p>
    </div>
  );
}

export default function PackingListsPage() {
  const [filters, setFilters] = useState<PackingListQuery>({
    ...DEFAULT_FILTERS,
  });

  // Keep the text shown in the input separate from the API query.
  // This prevents a request from being sent for every keystroke.
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const search = searchInput.trim();

      setFilters((previous) => {
        if ((previous.search ?? "") === search && previous.page === 1) {
          return previous;
        }

        return {
          ...previous,
          search,
          page: 1,
        };
      });
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError } = usePackingLists(filters);

  const packingLists = data?.data ?? [];
  const currentPage = data?.pagination?.page ?? filters.page ?? 1;
  const pageLimit = data?.pagination?.limit ?? filters.limit ?? 10;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const total = data?.pagination?.total ?? packingLists.length;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  function handleFiltersChange(newFilters: Partial<PackingListQuery>) {
    setFilters((previous) => ({
      ...previous,
      ...newFilters,
      // Any filter change starts again from the first page unless
      // the caller explicitly supplies a page number.
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }

  function handleResetFilters() {
    setSearchInput("");
    setFilters({ ...DEFAULT_FILTERS });
  }

  function handleClearSearch() {
    setSearchInput("");
  }

  function handlePrevious() {
    if (!hasPreviousPage || isFetching) return;

    setFilters((previous) => ({
      ...previous,
      page: Math.max((previous.page ?? 1) - 1, 1),
    }));
  }

  function handleNext() {
    if (!hasNextPage || isFetching) return;

    setFilters((previous) => ({
      ...previous,
      page: (previous.page ?? 1) + 1,
    }));
  }

  return (
    <main className="w-full min-w-0 space-y-5 sm:space-y-6">
      {/* Header */}
      <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Packing Lists
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage and track all packing lists.
          </p>
        </div>

        <Button
          asChild
          className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
        >
          <Link to="/packing-lists/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Packing List
          </Link>
        </Button>
      </header>

      {/* Statistics */}
      <section className="min-w-0" aria-label="Packing list statistics">
        <PackingListStatisticsCards data={packingLists} />
      </section>

      {/* Search */}
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Search packing lists
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Search by packing list number, client, or shipment. Partial numbers and
            names are supported by the search query.
          </p>
        </div>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="e.g. PKL-001, 001, client name, shipment number..."
            aria-label="Search by packing list number, client, or shipment"
            autoComplete="off"
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          />

          {searchInput.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear packing list search"
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* Additional filters */}
      <section className="min-w-0">
        <PackingListFilters
          filters={filters}
          onChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
      </section>

      {/* Fetching state */}
      {isFetching && !isLoading && (
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating packing lists...
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-4 sm:p-6"
          role="alert"
        >
          <h3 className="font-semibold text-red-800">
            Unable to load packing lists
          </h3>
          <p className="mt-1 text-sm text-red-600">
            Please check your connection and try again.
          </p>
        </div>
      )}

      {/* Mobile cards: the complete card is a link to that packing list's detail page. */}
      {!isError && (
        <section className="space-y-3 md:hidden" aria-label="Packing list cards">
          {isLoading && packingLists.length === 0 ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border bg-white p-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading packing lists...
            </div>
          ) : packingLists.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <Package className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                No packing lists found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filters, or create a new packing list.
              </p>
            </div>
          ) : (
            packingLists.map((packingList) => {
              const clientName =
                packingList.shipment?.client?.companyName || "Client not specified";
              const shipmentNumber =
                packingList.shipment?.shipmentNumber || "No shipment reference";
              const packingListNumber =
                packingList.packingListNumber || "Packing list";

              return (
                <Link
                  key={packingList.id}
                  to={`/packing-lists/${packingList.id}`}
                  aria-label={`Open packing list ${packingListNumber}`}
                  className="group block min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 active:bg-slate-50"
                >
                  <article className="min-w-0">
                    {/* Card heading */}
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Packing list
                          </p>
                          <h2 className="mt-0.5 break-all text-base font-bold text-slate-900">
                            {packingListNumber}
                          </h2>
                        </div>
                      </div>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition group-hover:bg-green-50 group-hover:text-green-700">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Client and shipment references */}
                    <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                            Client
                          </p>
                          <p className="mt-0.5 break-words text-sm font-medium text-slate-800">
                            {clientName}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-2.5">
                        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                            Shipment
                          </p>
                          <p className="mt-0.5 break-words text-sm font-medium text-slate-800">
                            {shipmentNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Packing information */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <DetailItem
                        label="Packing date"
                        value={formatDisplayDate(packingList.packingDate)}
                      />
                      <DetailItem
                        label="Package type"
                        value={packingList.packageType || "—"}
                      />
                      <DetailItem
                        label="Total packages"
                        value={formatDisplayNumber(packingList.totalPackages)}
                      />
                      <DetailItem
                        label="Gross weight"
                        value={formatDisplayNumber(packingList.grossWeight)}
                      />
                      <DetailItem
                        label="Net weight"
                        value={formatDisplayNumber(packingList.netWeight)}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-green-700">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        View packing list details
                      </span>
                      <span className="inline-flex items-center gap-1">
                        Open <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })
          )}
        </section>
      )}

      {/* Desktop/tablet table: existing table component and all its functionality are retained. */}
      {!isError && (
        <section className="hidden min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="min-w-0 overflow-x-auto">
            <PackingListTable
              data={packingLists}
              loading={isLoading}
              currentPage={currentPage}
              pageLimit={pageLimit}
            />
          </div>
        </section>
      )}

      {/* Pagination */}
      {!isLoading && !isError && packingLists.length > 0 && (
        <nav
          className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4"
          aria-label="Packing list pagination"
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>
              Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
              <strong className="text-slate-900">{totalPages}</strong>
            </span>
            <span
              className="hidden text-slate-300 sm:inline"
              aria-hidden="true"
            >
              •
            </span>
            <span>
              {total} {total === 1 ? "packing list" : "packing lists"} total
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={!hasPreviousPage || isFetching}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={!hasNextPage || isFetching}
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </main>
  );
}
