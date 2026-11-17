import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "../../components/ui/button";

import InvoiceFilters from "../../components/invoice/InvoiceFilters";
import InvoiceStatisticsCards from "../../components/invoice/InvoiceStatisticsCards";
import InvoiceTable from "../../components/invoice/table/InvoiceTable";
import DeleteInvoiceDialog from "../../components/invoice/table/DeleteInvoiceDialog";

import { useInvoices } from "../../hooks/invoices/useInvoices";
import { useDeleteInvoice } from "../../hooks/invoices/useDeleteInvoice";
import { useUpdateInvoiceStatus } from "../../hooks/invoices/useUpdateInvoiceStatus";

import type {
  InvoiceQuery,
  InvoiceStatus,
} from "../../types/invoice";

/**
 * The list endpoint returns the invoice's shipment relationship for the table.
 * This narrow view keeps the mobile card resilient to optional relationship
 * fields while leaving the existing InvoiceTable and API types untouched.
 */
type InvoiceCardData = {
  id: string;
  invoiceNumber?: string | null;
  externalInvoiceNumber?: string | null;
  commercialReference?: string | null;
  invoiceDate?: string | Date | null;
  currency?: string | null;
  totalAmount?: string | number | null;
  status?: InvoiceStatus | null;
  paymentTerms?: string | null;
  shipment?: {
    shipmentNumber?: string | null;
    client?: {
      companyName?: string | null;
    } | null;
  } | null;
};

function formatInvoiceDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value instanceof Date ? value.getTime() : value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatInvoiceAmount(value?: string | number | null) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getStatusClasses(status?: InvoiceStatus | null) {
  switch (status) {
    case "PAID":
      return "border-green-200 bg-green-50 text-green-700";
    case "PARTIALLY_PAID":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "SENT":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "APPROVED":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";
    case "DRAFT":
    case "UNPAID":
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

export default function InvoiceListPage() {
  /* ===========================================
     FILTERS
  =========================================== */

  const [filters, setFilters] = useState<InvoiceQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    // Earliest → Latest
    sortOrder: "asc",
  });

  /* ===========================================
     DELETE DIALOG
  =========================================== */

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] =
    useState<string | undefined>();

  /* ===========================================
     GET INVOICES
  =========================================== */

  const { data, isLoading, isFetching } = useInvoices(filters);

  /* ===========================================
     MUTATIONS
  =========================================== */

  const deleteInvoice = useDeleteInvoice();
  const updateStatus = useUpdateInvoiceStatus();

  /* ===========================================
     DATA
  =========================================== */

  const invoices = data?.data ?? [];
  const currentPage = data?.pagination?.page ?? filters.page ?? 1;
  const pageLimit = data?.pagination?.limit ?? filters.limit ?? 10;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const total = data?.pagination?.total ?? invoices.length;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  /* ===========================================
     OPEN DELETE DIALOG
  =========================================== */

  const handleDelete = (id: string) => {
    setSelectedInvoiceId(id);
    setDeleteOpen(true);
  };

  /* ===========================================
     CONFIRM DELETE
  =========================================== */

  const handleConfirmDelete = () => {
    if (!selectedInvoiceId) return;

    deleteInvoice.mutate(selectedInvoiceId, {
      onSuccess: () => {
        toast.success("Invoice deleted successfully.");
        setDeleteOpen(false);
        setSelectedInvoiceId(undefined);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ?? "Unable to delete invoice."
        );
      },
    });
  };

  /* ===========================================
     UPDATE STATUS
  =========================================== */

  const handleStatusChange = (id: string, status: InvoiceStatus) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success(
            status === "PAID"
              ? "Invoice marked as paid."
              : "Invoice marked as unpaid."
          );
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ??
              "Unable to update invoice status."
          );
        },
      }
    );
  };

  return (
    <main className="w-full min-w-0 space-y-5 sm:space-y-6">
      {/* ===========================================
          HEADER
      =========================================== */}

      <header className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <FileText className="h-6 w-6 shrink-0 text-primary sm:h-8 sm:w-8" />
            Invoices
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage all commercial invoices.
          </p>
        </div>

        <Button
          asChild
          className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
        >
          <Link to="/invoices/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </header>

      {/* ===========================================
          STATISTICS
      =========================================== */}

      <section className="min-w-0" aria-label="Invoice statistics">
        <InvoiceStatisticsCards invoices={invoices} />
      </section>

      {/* ===========================================
          FILTERS
      =========================================== */}

      <section className="min-w-0">
        <InvoiceFilters filters={filters} onChange={setFilters} />
      </section>

      {/* ===========================================
          LOADING
      =========================================== */}

      {isLoading && (
        <div className="flex justify-center py-16 sm:py-24" role="status">
          <Loader2 className="h-8 w-8 animate-spin text-primary sm:h-10 sm:w-10" />
          <span className="sr-only">Loading invoices...</span>
        </div>
      )}

      {/* ===========================================
          EMPTY
      =========================================== */}

      {!isLoading && invoices.length === 0 && (
        <div className="rounded-xl border border-dashed bg-white px-4 py-14 text-center sm:py-20">
          <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
          <h2 className="text-lg font-semibold sm:text-xl">No invoices found</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Create your first commercial invoice.
          </p>
          <Button asChild className="mt-6 bg-green-600 text-white hover:bg-green-700">
            <Link to="/invoices/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
      )}

      {/* ===========================================
          INVOICE LIST
      =========================================== */}

      {!isLoading && invoices.length > 0 && (
        <>
          {isFetching && (
            <div
              className="flex items-center gap-2 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Refreshing invoices...
            </div>
          )}

          {/* MOBILE CARDS: each card opens its matching invoice details page. */}
          <section className="space-y-3 md:hidden" aria-label="Invoice cards">
            {invoices.map((row) => {
              const invoice = row as unknown as InvoiceCardData;
              const isPaid = invoice.status === "PAID";
              const isUpdating =
                updateStatus.isPending &&
                updateStatus.variables?.id === invoice.id;
              const statusLabel = (invoice.status ?? "UNPAID")
                .toString()
                .replace(/_/g, " ");

              return (
                <article
                  key={invoice.id}
                  className="relative isolate min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                >
                  <Link
                    to={`/invoices/${invoice.id}`}
                    aria-label={`Open invoice ${invoice.invoiceNumber ?? "details"}`}
                    className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600"
                  />

                  <div className="pointer-events-none relative z-10 space-y-4 p-4">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Invoice number
                        </p>
                        <h2 className="mt-1 break-words text-base font-bold text-slate-900">
                          {invoice.invoiceNumber || "Invoice"}
                        </h2>
                        {invoice.externalInvoiceNumber && (
                          <p className="mt-1 break-words text-xs text-slate-500">
                            Ref: {invoice.externalInvoiceNumber}
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(invoice.status)}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Client</p>
                        <p className="mt-0.5 break-words text-sm font-medium text-slate-800">
                          {invoice.shipment?.client?.companyName || "—"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Shipment</p>
                          <p className="mt-0.5 break-words text-sm font-medium text-slate-800">
                            {invoice.shipment?.shipmentNumber || "—"}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Invoice date</p>
                          <p className="mt-0.5 text-sm font-medium text-slate-800">
                            {formatInvoiceDate(invoice.invoiceDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-end justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Total amount</p>
                          <p className="mt-0.5 break-words text-lg font-bold tabular-nums text-slate-900">
                            {formatInvoiceAmount(invoice.totalAmount)}
                          </p>
                        </div>
                        <span className="shrink-0 pb-0.5 text-xs font-semibold text-slate-600">
                          {invoice.currency || ""}
                        </span>
                      </div>

                      {(invoice.paymentTerms || invoice.commercialReference) && (
                        <div className="grid grid-cols-2 gap-3">
                          {invoice.paymentTerms && (
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">Payment terms</p>
                              <p className="mt-0.5 break-words text-sm text-slate-700">
                                {invoice.paymentTerms.replace(/_/g, " ")}
                              </p>
                            </div>
                          )}
                          {invoice.commercialReference && (
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">Commercial reference</p>
                              <p className="mt-0.5 break-words text-sm text-slate-700">
                                {invoice.commercialReference}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Only the controls themselves receive pointer events so
                        clicking the rest of the card follows the detail link. */}
                    <div className="pointer-events-none flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="pointer-events-auto relative z-20 inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs font-semibold text-green-700 transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                      >
                        View invoice
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusChange(
                              invoice.id,
                              (isPaid ? "UNPAID" : "PAID") as InvoiceStatus
                            )
                          }
                          aria-label={isPaid ? "Mark invoice as unpaid" : "Mark invoice as paid"}
                          className="pointer-events-auto relative z-20 inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : isPaid ? (
                            <CircleDollarSign className="h-3.5 w-3.5" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          {isPaid ? "Unpaid" : "Mark paid"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(invoice.id)}
                          aria-label={`Delete invoice ${invoice.invoiceNumber ?? ""}`}
                          className="pointer-events-auto relative z-20 inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* TABLE: retained for tablet and desktop, with all existing actions. */}
          <section className="hidden min-w-0 md:block">
            <InvoiceTable
              invoices={invoices}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              statusUpdatingId={
                updateStatus.isPending
                  ? updateStatus.variables?.id
                  : undefined
              }
              currentPage={currentPage}
              pageLimit={pageLimit}
            />
          </section>

          {/* ===========================================
              PAGINATION
          =========================================== */}

          <nav
            className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4"
            aria-label="Invoice pagination"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>
                Page <strong className="text-foreground">{currentPage}</strong> of{" "}
                <strong className="text-foreground">{totalPages}</strong>
              </span>
              <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
                •
              </span>
              <span>
                {total} {total === 1 ? "invoice" : "invoices"} total
              </span>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={!hasPreviousPage || isFetching}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: Math.max((previous.page ?? 1) - 1, 1),
                  }))
                }
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={!hasNextPage || isFetching}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: (previous.page ?? 1) + 1,
                  }))
                }
              >
                Next
              </Button>
            </div>
          </nav>
        </>
      )}

      {/* ===========================================
          DELETE INVOICE DIALOG
      =========================================== */}

      <DeleteInvoiceDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        loading={deleteInvoice.isPending}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
