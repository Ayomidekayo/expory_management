import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Loader2,
  MapPin,
  Package,
  Plus,
  Search,
  X,
  Weight,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import AllocationStatisticsCards from "../../components/allocation/AllocationStatisticsCards";
import type { AllocationQuery } from "../../types/allocation.types";
import { useAllocations } from "../../hooks/allocation/useAllocations";
import AllocationTable from "../../components/allocation/AllocationTable";

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLabel(value: string | null | undefined): string {
  if (!value) return "—";

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return String(value);

  return parsed.toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  });
}

function getStatusStyles(status: string | null | undefined): string {
  const styles: Record<string, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    UNDER_REVIEW: "border-sky-200 bg-sky-50 text-sky-700",
    APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
    COMPLETED: "border-green-200 bg-green-50 text-green-700",
    REJECTED: "border-red-200 bg-red-50 text-red-700",
    CANCELLED: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return styles[String(status ?? "").toUpperCase()] ?? "border-slate-200 bg-slate-50 text-slate-700";
}

function getPriorityStyles(priority: string | null | undefined): string {
  const styles: Record<string, string> = {
    LOW: "border-slate-200 bg-slate-50 text-slate-600",
    MEDIUM: "border-blue-200 bg-blue-50 text-blue-700",
    HIGH: "border-orange-200 bg-orange-50 text-orange-700",
    URGENT: "border-red-200 bg-red-50 text-red-700",
  };

  return styles[String(priority ?? "").toUpperCase()] ?? "border-slate-200 bg-slate-50 text-slate-700";
}

export default function AllocationListPage() {
  const [allocationSearch, setAllocationSearch] = useState("");
  const [filters, setFilters] = useState<AllocationQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    // Earliest → Latest
    sortOrder: "asc",
  });

  const { data, isLoading, isFetching, isError } = useAllocations(filters);

  const allocations = data?.data ?? [];

  // Search the records currently returned for this server-side page.
  const filteredAllocations = useMemo(() => {
    const query = allocationSearch.trim().toLocaleLowerCase();
    if (!query) return allocations;

    return allocations.filter((allocation) => {
      const searchableValues = [
        allocation.allocationNumber,
        allocation.commodityName,
        allocation.cargoDescription,
        allocation.status,
        formatLabel(allocation.status),
        allocation.serviceType,
        formatLabel(allocation.serviceType),
        allocation.destinationCity,
        allocation.destinationCountry,
        allocation.packageType,
        allocation.priority,
        formatLabel(allocation.priority),
        allocation.quantity,
        allocation.numberOfPackages,
        allocation.grossWeight,
      ];

      return searchableValues.some((value) =>
        String(value ?? "").toLocaleLowerCase().includes(query),
      );
    });
  }, [allocationSearch, allocations]);

  const currentPage = data?.pagination?.page ?? filters.page ?? 1;
  const pageLimit = data?.pagination?.limit ?? filters.limit ?? 10;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const total = data?.pagination?.total ?? allocations.length;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  function handlePrevious() {
    if (!hasPreviousPage || isFetching) return;

    setFilters((prev) => ({
      ...prev,
      page: Math.max((prev.page ?? 1) - 1, 1),
    }));
  }

  function handleNext() {
    if (!hasNextPage || isFetching) return;

    setFilters((prev) => ({
      ...prev,
      page: (prev.page ?? 1) + 1,
    }));
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-screen-2xl space-y-5 overflow-x-hidden px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6">
      {/* HEADER */}
      <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
            Allocations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage export allocations.
          </p>
        </div>

        <Button
          asChild
          className="w-full shrink-0 bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600 sm:w-auto"
        >
          <Link to="/allocations/new" className="inline-flex items-center justify-center">
            <Plus className="mr-2 h-4 w-4" />
            New Allocation
          </Link>
        </Button>
      </header>

      {/* STATISTICS */}
      <section className="w-full min-w-0" aria-label="Allocation statistics">
        <AllocationStatisticsCards />
      </section>

      {/* SEARCH */}
      <section className="w-full min-w-0" aria-label="Search allocations">
        <div className="relative w-full max-w-2xl">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={allocationSearch}
            onChange={(event) => setAllocationSearch(event.target.value)}
            placeholder="Search allocation number, cargo, destination..."
            aria-label="Search allocations on this page"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm text-foreground shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
          />
          {allocationSearch && (
            <button
              type="button"
              onClick={() => setAllocationSearch("")}
              aria-label="Clear allocation search"
              className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-slate-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
          {allocationSearch.trim()
            ? `${filteredAllocations.length} matching ${filteredAllocations.length === 1 ? "allocation" : "allocations"} on this page`
            : "Search the allocations currently shown on this page."}
        </p>
      </section>

      {/* FETCHING */}
      {isFetching && !isLoading && (
        <div
          className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground sm:text-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          <span>Refreshing allocations...</span>
        </div>
      )}

      {/* MOBILE: CARD VIEW */}
      <section className="w-full min-w-0 md:hidden" aria-label="Allocation records">
        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center" role="alert">
            <h2 className="font-semibold text-red-800">Unable to load allocations</h2>
            <p className="mt-1 text-sm text-red-600">Please try again.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-xl border bg-white p-4 shadow-sm">
                <div className="h-4 w-2/5 rounded bg-slate-200" />
                <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-4 h-3 w-full rounded bg-slate-100" />
                <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
                <div className="mt-5 h-9 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : filteredAllocations.length === 0 && allocationSearch.trim() ? (
          <div className="rounded-xl border border-dashed bg-white px-4 py-10 text-center">
            <Search className="mx-auto h-9 w-9 text-muted-foreground/60" />
            <h2 className="mt-3 text-sm font-semibold text-foreground">No matching allocations</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              No allocations on this page match “{allocationSearch}”. Try another keyword.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => setAllocationSearch("")}
            >
              Clear search
            </Button>
          </div>
        ) : allocations.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white px-4 py-10 text-center">
            <ClipboardList className="mx-auto h-9 w-9 text-muted-foreground/60" />
            <h2 className="mt-3 text-sm font-semibold text-foreground">No allocations found</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              New allocations will appear here once they have been created.
            </p>
            <Button
              asChild
              size="sm"
              className="mt-4 bg-green-600 text-white hover:bg-green-700"
            >
              <Link to="/allocations/new">
                <Plus className="mr-2 h-4 w-4" />
                Create allocation
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredAllocations.map((allocation) => (
              <article
                key={allocation.id}
                className="relative isolate min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
              >
                {/* The card surface opens this allocation's detail page. */}
                <Link
                  to={`/allocations/${allocation.id}`}
                  aria-label={`Open allocation ${allocation.allocationNumber || "details"}`}
                  className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600"
                />

                <div className="pointer-events-none relative z-10 flex min-w-0 items-start justify-between gap-3 border-b bg-muted/20 p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="break-all text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {allocation.allocationNumber || "Allocation"}
                      </p>
                      <h2 className="mt-1 break-words text-sm font-semibold leading-5 text-foreground">
                        {allocation.commodityName || allocation.cargoDescription || "Untitled cargo"}
                      </h2>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusStyles(allocation.status)}`}
                  >
                    {formatLabel(allocation.status)}
                  </span>
                </div>

                <div className="pointer-events-none relative z-10 grid min-w-0 gap-3 p-4">
                  <div className="flex min-w-0 items-start gap-2.5 text-sm">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Service type</p>
                      <p className="mt-0.5 break-words text-sm text-foreground">{formatLabel(allocation.serviceType)}</p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-2.5 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Destination</p>
                      <p className="mt-0.5 break-words text-sm text-foreground">
                        {[allocation.destinationCity, allocation.destinationCountry].filter(Boolean).join(", ") || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-lg bg-slate-50 p-2.5">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Quantity</p>
                      <p className="mt-1 break-words text-sm font-semibold text-foreground">
                        {formatNumber(allocation.quantity)}
                        {allocation.packageType ? ` ${allocation.packageType}` : ""}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-lg bg-slate-50 p-2.5">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Packages</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatNumber(allocation.numberOfPackages)}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getPriorityStyles(allocation.priority)}`}
                    >
                      {formatLabel(allocation.priority)} priority
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(allocation.createdAt)}
                    </span>
                  </div>

                  {(allocation.grossWeight !== null && allocation.grossWeight !== undefined) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Weight className="h-3.5 w-3.5" />
                      <span>Gross weight: {formatNumber(allocation.grossWeight)}</span>
                    </div>
                  )}
                </div>

                {/* Keep the explicit detail/edit actions above the card-wide link. */}
                <div className="relative z-20 grid grid-cols-2 gap-2 border-t bg-white p-3">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to={`/allocations/${allocation.id}`}>
                      View details
                      <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600"
                  >
                    <Link to={`/allocations/${allocation.id}/edit`}>Edit allocation</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* TABLET / DESKTOP: keep the existing table and all of its actions */}
      <section className="hidden w-full min-w-0 overflow-hidden rounded-xl md:block" aria-label="Allocation table">
        <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain">
          <AllocationTable
            allocations={filteredAllocations}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            currentPage={currentPage}
            pageLimit={pageLimit}
          />
        </div>
      </section>

      {/* PAGINATION */}
      {!isLoading && !isError && total > 0 && (
        <nav
          className="flex w-full min-w-0 flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
          aria-label="Allocation pagination"
        >
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span>
              Page <strong className="text-foreground">{currentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
            <span className="hidden text-slate-300 sm:inline" aria-hidden="true">•</span>
            <span>{total.toLocaleString("en-NG")} total</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={!hasPreviousPage || isFetching}
              onClick={handlePrevious}
            >
              {isFetching && hasPreviousPage && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={!hasNextPage || isFetching}
              onClick={handleNext}
            >
              {isFetching && hasNextPage && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Next
            </Button>
          </div>
        </nav>
      )}
    </main>
  );
}
