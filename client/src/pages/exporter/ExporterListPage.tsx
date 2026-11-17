


////new add ntt

import { Link } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "../../components/ui/button";
import ExporterTable from "../../components/exporter/ExporterTable";
import ExporterSummaryCards from "../../components/exporter/ExporterSummaryCards";

import { useExporters } from "../../hooks/exporter/useExporters";

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
   * Earliest exporter -> latest exporter.
   */
  const exporters = useMemo(() => {
    const dataList = data?.data ?? [];

    return [...dataList].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }, [data?.data]);

  /* Pagination */
  const total = exporters.length;

  const totalPages = Math.max(
    Math.ceil(total / pageLimit),
    1
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageLimit;

  const paginatedExporters = exporters.slice(
    startIndex,
    startIndex + pageLimit
  );

  const hasPreviousPage = safeCurrentPage > 1;
  const hasNextPage = safeCurrentPage < totalPages;

  function handlePrevious() {
    if (!hasPreviousPage || isFetching) return;

    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  function handleNext() {
    if (!hasNextPage || isFetching) return;

    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-screen-2xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6">
      {/* HEADER */}
      <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Exporters
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage exporters.
          </p>
        </div>

        <Button
          asChild
          className="w-full shrink-0 bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600 sm:w-auto"
        >
          <Link to="/exporters/new">
            <Plus className="mr-2 h-4 w-4" />
            New Exporter
          </Link>
        </Button>
      </header>

      {/* SUMMARY */}
      {!isLoading && !isError && (
        <section className="w-full min-w-0" aria-label="Exporter summary">
          <ExporterSummaryCards exporters={exporters} />
        </section>
      )}

      {/* FETCHING */}
      {isFetching && !isLoading && (
        <div
          className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground sm:text-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          <span>Refreshing exporters...</span>
        </div>
      )}

      {/* ERROR */}
      {isError ? (
        <div
          className="w-full rounded-xl border border-red-200 bg-red-50 p-4 text-center sm:p-6"
          role="alert"
        >
          <h3 className="font-semibold text-red-800">
            Unable to load exporters
          </h3>
          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>
        </div>
      ) : (
        <section className="w-full min-w-0" aria-label="Exporter records">
          {/* MOBILE: individual exporter cards */}
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
            {isLoading ? (
              <div className="col-span-full flex min-h-36 items-center justify-center rounded-xl border bg-white p-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading exporters...
              </div>
            ) : paginatedExporters.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed bg-white px-4 py-10 text-center">
                <Building2 className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  No exporters found
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Exporters will appear here once they have been added.
                </p>
              </div>
            ) : (
              paginatedExporters.map((exporter) => (
                <article
                  key={exporter.id}
                  className="min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  <div className="flex min-w-0 items-start gap-3 border-b bg-muted/20 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="break-words text-sm font-semibold leading-5 text-foreground">
                        {exporter.name || "Unnamed exporter"}
                      </h2>
                      <p className="mt-1 flex min-w-0 items-center gap-1.5 break-words text-xs text-muted-foreground">
                        <UserRound className="h-3.5 w-3.5 shrink-0" />
                        <span>{exporter.contactPerson || "No contact person"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-0 gap-3 p-4">
                    <div className="flex min-w-0 items-start gap-2.5 text-sm">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      {exporter.phone ? (
                        <a
                          href={`tel:${exporter.phone}`}
                          className="min-w-0 break-all text-foreground hover:text-primary"
                        >
                          {exporter.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No phone number</span>
                      )}
                    </div>

                    <div className="flex min-w-0 items-start gap-2.5 text-sm">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      {exporter.email ? (
                        <a
                          href={`mailto:${exporter.email}`}
                          className="min-w-0 break-all text-foreground hover:text-primary"
                        >
                          {exporter.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No email address</span>
                      )}
                    </div>

                    <div className="flex min-w-0 items-start gap-2.5 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 break-words text-foreground">
                        {exporter.address || "No address provided"}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-2.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      <span>Added {formatDate(exporter.createdAt)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t p-3">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/exporters/${exporter.id}`}>
                        View details
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600"
                    >
                      <Link to={`/exporters/${exporter.id}/edit`}>
                        Edit exporter
                      </Link>
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* TABLET / DESKTOP: preserve the existing table and its row actions */}
          <div className="hidden w-full min-w-0 overflow-x-auto overscroll-x-contain md:block">
            <div className="min-w-0">
              <ExporterTable
                exporters={paginatedExporters}
                isLoading={isLoading}
                currentPage={safeCurrentPage}
                pageLimit={pageLimit}
              />
            </div>
          </div>
        </section>
      )}

      {/* PAGINATION */}
      {!isLoading && !isError && total > 0 && (
        <nav
          className="flex w-full min-w-0 flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
          aria-label="Exporter pagination"
        >
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span>
              Page <strong className="text-foreground">{safeCurrentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
            <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
              •
            </span>
            <span>{total} total</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0">
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
