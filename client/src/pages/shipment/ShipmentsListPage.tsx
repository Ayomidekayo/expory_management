import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Loader2,
  MapPin,
  Package,
  Plus,
  Search,
  Ship,
  Truck,
  X,
} from "lucide-react";

import { Button } from "../../components/ui/button";

import ShipmentStatisticsCards from "../../components/shipment/ShipmentStatisticsCards";
import ShipmentTable from "../../components/shipment/ShipmentTable";

import { useShipments } from "../../hooks/shipments/useShipments";

import type { ShipmentQuery } from "../../types/shipment.types";

const DEFAULT_FILTERS: ShipmentQuery = {
  page: 1,
  limit: 10,
  search: "",
  sortBy: "shipmentDate",
  sortOrder: "asc",
};

function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusStyle(status?: string) {
  switch ((status ?? "").toUpperCase()) {
    case "COMPLETED":
    case "ARRIVED":
    case "DELIVERED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "IN_TRANSIT":
    case "INTRANSIT":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "CANCELLED":
    case "REJECTED":
      return "border-red-200 bg-red-50 text-red-700";
    case "BOOKED":
    case "APPROVED":
      return "border-violet-200 bg-violet-50 text-violet-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getTransportIcon(mode?: string) {
  switch ((mode ?? "").toUpperCase()) {
    case "ROAD":
      return Truck;
    case "AIR":
      return ArrowUpRight;
    case "RAIL":
      return ArrowDownRight;
    default:
      return Ship;
  }
}

export default function ShipmentListPage() {
  const [filters, setFilters] = useState<ShipmentQuery>({
    ...DEFAULT_FILTERS,
  });

  // Keep the text responsive while debouncing requests to the API.
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
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

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError } = useShipments(filters);

  const shipments = data?.data ?? [];

  const currentPage = data?.pagination?.page ?? filters.page ?? 1;
  const pageLimit = data?.pagination?.limit ?? filters.limit ?? 10;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const total = data?.pagination?.total ?? shipments.length;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

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
      <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Shipments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage, search and track export shipments.
          </p>
        </div>

        <Button
          asChild
          className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
        >
          <Link to="/shipments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Link>
        </Button>
      </header>

      {/* Statistics */}
      <section className="min-w-0" aria-label="Shipment statistics">
        <ShipmentStatisticsCards />
      </section>

      {/* Search */}
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-slate-900">Search shipments</h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Search by shipment number, booking number, client, vessel or shipping line. Partial numbers and names are supported.
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
            placeholder="e.g. SHP-001, 001, client name, vessel..."
            aria-label="Search shipments by shipment number, booking number, client, vessel or shipping line"
            autoComplete="off"
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          />

          {searchInput.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear shipment search"
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center rounded-xl border bg-white py-16 sm:py-24" role="status" aria-live="polite">
          <Loader2 className="h-9 w-9 animate-spin text-green-600" />
          <span className="sr-only">Loading shipments...</span>
        </div>
      )}

      {/* Fetching state */}
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating shipments...
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 sm:p-6" role="alert">
          <h3 className="font-semibold text-red-800">Unable to load shipments</h3>
          <p className="mt-1 text-sm text-red-600">
            Please check your connection and try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && shipments.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-14 text-center sm:py-20">
          <Package className="mx-auto mb-4 h-11 w-11 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900">
            {filters.search?.trim() ? "No matching shipments" : "No shipments found"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {filters.search?.trim()
              ? "Try a different shipment number, booking number, client, vessel or shipping line."
              : "Create your first shipment to start tracking export activities."}
          </p>
          {filters.search?.trim() ? (
            <Button type="button" variant="outline" className="mt-5" onClick={handleClearSearch}>
              Clear search
            </Button>
          ) : (
            <Button asChild className="mt-5 bg-green-600 text-white hover:bg-green-700">
              <Link to="/shipments/new">
                <Plus className="mr-2 h-4 w-4" />
                New Shipment
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Mobile shipment cards */}
      {!isLoading && !isError && shipments.length > 0 && (
        <section className="grid min-w-0 grid-cols-1 gap-3 md:hidden" aria-label="Shipment cards">
          {shipments.map((shipment) => {
            const TransportIcon = getTransportIcon(shipment.transportMode);
            const status = String(shipment.status ?? "UNKNOWN");
            const mode = String(shipment.transportMode ?? "—");
            const shipmentNumber = shipment.shipmentNumber || "Shipment details";

            return (
              <Link
                key={shipment.id}
                to={`/shipments/${shipment.id}`}
                aria-label={`View shipment ${shipmentNumber}`}
                className="group block min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-green-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 active:bg-slate-50"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                        Shipment number
                      </p>
                      <h3 className="mt-0.5 break-words text-sm font-semibold text-slate-900 group-hover:text-green-700">
                        {shipmentNumber}
                      </h3>
                    </div>
                  </div>

                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(status)}`}>
                    {status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-slate-100 pt-4">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Client</p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-800">
                      {shipment.client?.companyName || "—"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Shipment date</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {formatDate(shipment.shipmentDate)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Transport mode</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                      <TransportIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {mode.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Booking number</p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-800">
                      {shipment.bookingNumber || "—"}
                    </p>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <p className="text-xs text-slate-500">Route</p>
                    <div className="mt-1 flex min-w-0 items-center gap-2 text-sm font-medium text-slate-800">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{shipment.portOfLoading || "Origin not specified"}</span>
                      </span>
                      <span className="shrink-0 text-slate-300">→</span>
                      <span className="min-w-0 truncate">{shipment.portOfDischarge || "Destination not specified"}</span>
                    </div>
                  </div>

                  {(shipment.shippingLine || shipment.vesselName) && (
                    <div className="col-span-2 min-w-0">
                      <p className="text-xs text-slate-500">Shipping details</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-800">
                        {[shipment.shippingLine, shipment.vesselName, shipment.voyageNumber]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-green-700">
                  <span>View shipment details</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </section>
      )}

      {/* Desktop/tablet table. Kept intact to preserve existing table features. */}
      {!isLoading && !isError && shipments.length > 0 && (
        <section className="hidden min-w-0 md:block">
          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="min-w-0 overflow-x-auto">
              <ShipmentTable
                shipments={shipments}
                isLoading={isLoading}
                currentPage={currentPage}
                pageLimit={pageLimit}
              />
            </div>
          </div>
        </section>
      )}

      {/* Pagination */}
      {!isLoading && !isError && shipments.length > 0 && (
        <nav
          className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4"
          aria-label="Shipment pagination"
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>
              Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
              <strong className="text-slate-900">{totalPages}</strong>
            </span>
            <span className="hidden text-slate-300 sm:inline" aria-hidden="true">•</span>
            <span>{total} {total === 1 ? "shipment" : "shipments"} total</span>
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
