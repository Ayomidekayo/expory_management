import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Route,
  Truck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "../../components/ui/button";

import { useConsignees } from "../../hooks/consignee/useConsignees";

import ConsigneeSummaryCards from "../../components/consignee/ConsigneeSummaryCards";
import ConsigneeTable from "../../components/consignee/ConsigneeTable";
import ConsigneeFilters from "../../components/consignee/ConsigneeFilters";

const PAGE_LIMIT = 10;

function displayValue(value?: string | null) {
  return value?.trim() || "Not provided";
}

function formatDate(value?: string | Date | null) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ConsigneeListPage() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useConsignees();

  const allConsignees = data?.data ?? [];

  // Search and status filters are read from the URL and applied to the
  // complete list returned by useConsignees, before local pagination.
  const search = searchParams.get("search")?.trim().toLocaleLowerCase() ?? "";
  const activeFilter = searchParams.get("isActive") ?? "";

  const filteredConsignees = useMemo(() => {
    return allConsignees.filter((consignee) => {
      const searchableValues = [
        consignee.name,
        consignee.contactPerson,
        consignee.email,
        consignee.phone,
        consignee.address,
        consignee.transporter,
        consignee.placeOfLoading,
        consignee.transitRoute,
        consignee.portOfDischarge,
        consignee.transportMode,
      ];

      const matchesSearch =
        !search ||
        searchableValues.some((value) =>
          value?.toLocaleLowerCase().includes(search),
        );

      // Retains the existing URL filter behaviour. If the API record does
      // not include isActive, an active/inactive filter will not match it.
      const matchesStatus =
        !activeFilter || String(consignee.isActive) === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allConsignees, search, activeFilter]);

  // Preserve the original earliest-to-latest ordering.
  const sortedConsignees = useMemo(() => {
    return [...filteredConsignees].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });
  }, [filteredConsignees]);

  const total = sortedConsignees.length;
  const totalPages = Math.max(Math.ceil(total / PAGE_LIMIT), 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_LIMIT;

  const paginatedConsignees = sortedConsignees.slice(
    startIndex,
    startIndex + PAGE_LIMIT,
  );

  const hasPreviousPage = safeCurrentPage > 1;
  const hasNextPage = safeCurrentPage < totalPages;

  // Return to the first page whenever search or status filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter]);

  function handlePrevious() {
    if (!hasPreviousPage || isFetching) return;
    setCurrentPage((previous) => Math.max(previous - 1, 1));
  }

  function handleNext() {
    if (!hasNextPage || isFetching) return;
    setCurrentPage((previous) => Math.min(previous + 1, totalPages));
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-screen-2xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6">
      {/* PAGE HEADER */}
      <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Consignees
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage registered consignees and their transport details.
          </p>
        </div>

        <Button asChild className="w-full shrink-0 bg-green-600 text-white hover:bg-green-700 sm:w-auto">
          <Link to="/consignees/new" className="inline-flex items-center justify-center">
            <Plus className="mr-2 h-4 w-4" />
            New Consignee
          </Link>
        </Button>
      </header>

      {/* SUMMARY */}
      {!isLoading && !isError && (
        <section className="w-full min-w-0" aria-label="Consignee summary">
          <ConsigneeSummaryCards consignees={filteredConsignees} />
        </section>
      )}

      {/* SEARCH AND FILTERS. The existing filter component continues to own
          the URL query parameters, so bookmarks and filter behaviour remain. */}
      <section className="w-full min-w-0" aria-label="Consignee search and filters">
        <ConsigneeFilters />
      </section>

      {/* FETCHING */}
      {isFetching && !isLoading && (
        <div
          className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          <span>Refreshing consignees...</span>
        </div>
      )}

      {/* ERROR */}
      {isError ? (
        <div className="w-full min-w-0 rounded-xl border border-red-200 bg-red-50 p-4 text-center sm:p-6" role="alert">
          <h3 className="font-semibold text-red-800">Unable to load consignees</h3>
          <p className="mt-1 text-sm text-red-600">Please check your connection and try again.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center rounded-xl border bg-white py-16" role="status" aria-label="Loading consignees">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : total === 0 ? (
        <div className="w-full min-w-0 rounded-xl border border-dashed bg-white px-4 py-14 text-center sm:py-20">
          <Building2 className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <h2 className="text-lg font-semibold text-slate-900">No consignees found</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {search || activeFilter
              ? "Try adjusting your search or filters."
              : "Add your first consignee to get started."}
          </p>
          {!search && !activeFilter && (
            <Button asChild className="mt-5 bg-green-600 text-white hover:bg-green-700">
              <Link to="/consignees/new">
                <Plus className="mr-2 h-4 w-4" />
                New Consignee
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* MOBILE CARDS: visible below the desktop table breakpoint. A full
              card link opens the matching consignee detail page. */}
          <section className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:hidden" aria-label="Consignee cards">
            {paginatedConsignees.map((consignee) => (
              <article
                key={consignee.id}
                className="relative isolate min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
              >
                <Link
                  to={`/consignees/${consignee.id}`}
                  aria-label={`View details for ${displayValue(consignee.name)}`}
                  className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600"
                />

                <div className="pointer-events-none relative z-10 flex min-w-0 items-start justify-between gap-3 border-b border-slate-100 p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="break-words text-sm font-semibold leading-5 text-slate-900 sm:text-base">
                        {displayValue(consignee.name)}
                      </h2>
                      <p className="mt-1 break-words text-xs text-slate-500">
                        {consignee.contactPerson
                          ? `Contact: ${consignee.contactPerson}`
                          : "Contact person not provided"}
                      </p>
                    </div>
                  </div>

                  {typeof consignee.isActive === "boolean" && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        consignee.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {consignee.isActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>

                <div className="pointer-events-none relative z-10 grid min-w-0 grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Email</p>
                      <p className="break-all text-sm text-slate-700">{displayValue(consignee.email)}</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Phone</p>
                      <p className="break-words text-sm text-slate-700">{displayValue(consignee.phone)}</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Address</p>
                      <p className="break-words text-sm text-slate-700">{displayValue(consignee.address)}</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Transport mode</p>
                      <p className="break-words text-sm text-slate-700">{displayValue(consignee.transportMode)}</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-2.5">
                    <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Transporter</p>
                      <p className="break-words text-sm text-slate-700">{displayValue(consignee.transporter)}</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Place of loading</p>
                      <p className="break-words text-sm text-slate-700">{displayValue(consignee.placeOfLoading)}</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Route className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Transit route</p>
                      <p className="break-words text-sm text-slate-700">{displayValue(consignee.transitRoute)}</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Port of discharge</p>
                      <p className="break-words text-sm text-slate-700">{displayValue(consignee.portOfDischarge)}</p>
                    </div>
                  </div>
                </div>

                <div className="relative z-20 flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3">
                  <span className="text-xs text-slate-500">Added {formatDate(consignee.createdAt)}</span>
                  <Link
                    to={`/consignees/${consignee.id}`}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-green-700 hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  >
                    View details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {/* TABLE: preserved for tablet/desktop, with its own horizontal
              overflow boundary to prevent page-wide horizontal scrolling. */}
          <section className="hidden w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block" aria-label="Consignee table">
            <div className="w-full min-w-0 overflow-x-auto">
              <ConsigneeTable
                consignees={paginatedConsignees}
                isLoading={isLoading}
                currentPage={safeCurrentPage}
                pageLimit={PAGE_LIMIT}
              />
            </div>
          </section>
        </>
      )}

      {/* PAGINATION */}
      {!isLoading && !isError && total > 0 && (
        <nav
          className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
          aria-label="Consignee pagination"
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>
              Page <strong className="text-foreground">{safeCurrentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <span>
              Showing {startIndex + 1}–{Math.min(startIndex + PAGE_LIMIT, total)} of {total.toLocaleString()}
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
