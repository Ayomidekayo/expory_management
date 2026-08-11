import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Loader2,
  Plus,
  FileText,
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

export default function InvoiceListPage() {
  /* ===========================================
     FILTERS
  =========================================== */

  const [filters, setFilters] =
    useState<InvoiceQuery>({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  /* ===========================================
     DELETE DIALOG
  =========================================== */

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedInvoiceId, setSelectedInvoiceId] =
    useState<string | undefined>();

  /* ===========================================
     GET INVOICES
  =========================================== */

  const {
    data,
    isLoading,
    isFetching,
  } = useInvoices(filters);

  /* ===========================================
     MUTATIONS
  =========================================== */

  const deleteInvoice =
    useDeleteInvoice();

  const updateStatus =
    useUpdateInvoiceStatus();

  /* ===========================================
     DATA
  =========================================== */

  const invoices =
    data?.data ?? [];

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
    if (!selectedInvoiceId) {
      return;
    }

    deleteInvoice.mutate(
      selectedInvoiceId,
      {
        onSuccess: () => {
          toast.success(
            "Invoice deleted successfully."
          );

          setDeleteOpen(false);
          setSelectedInvoiceId(undefined);
        },

        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ??
              "Unable to delete invoice."
          );
        },
      }
    );
  };

  /* ===========================================
     UPDATE STATUS
  =========================================== */

  const handleStatusChange = (
    id: string,
    status: InvoiceStatus
  ) => {
    updateStatus.mutate(
      {
        id,
        status,
      },
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
    <div className="space-y-6">

      {/* ===========================================
          HEADER
      =========================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <FileText className="h-8 w-8 text-primary" />

            Invoices
          </h1>

          <p className="text-muted-foreground">
            Manage all commercial invoices.
          </p>
        </div>

        <Button asChild>
          <Link to="/invoices/create">
            <Plus className="mr-2 h-4 w-4" />

            Create Invoice
          </Link>
        </Button>

      </div>

      {/* ===========================================
          STATISTICS
      =========================================== */}

      <InvoiceStatisticsCards
        invoices={invoices}
      />

      {/* ===========================================
          FILTERS
      =========================================== */}

      <InvoiceFilters
        filters={filters}
        onChange={setFilters}
      />

      {/* ===========================================
          LOADING
      =========================================== */}

      {isLoading && (
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {/* ===========================================
          EMPTY
      =========================================== */}

      {!isLoading &&
        invoices.length === 0 && (
          <div className="rounded-xl border border-dashed bg-white py-20 text-center">

            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-xl font-semibold">
              No invoices found
            </h2>

            <p className="mt-2 text-muted-foreground">
              Create your first commercial invoice.
            </p>

            <Button
              asChild
              className="mt-6"
            >
              <Link to="/invoices/create">
                <Plus className="mr-2 h-4 w-4" />

                Create Invoice
              </Link>
            </Button>

          </div>
        )}

      {/* ===========================================
          TABLE
      =========================================== */}

      {!isLoading &&
        invoices.length > 0 && (
          <>
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />

                Refreshing...
              </div>
            )}

            <InvoiceTable
              invoices={invoices}
              onDelete={handleDelete}
              onStatusChange={
                handleStatusChange
              }
              statusUpdatingId={
                updateStatus.isPending
                  ? updateStatus
                      .variables?.id
                  : undefined
              }
            />

            {/* ===========================================
                PAGINATION
            =========================================== */}

            <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-muted-foreground">
                Page{" "}

                <strong>
                  {
                    data?.pagination
                      .page
                  }
                </strong>{" "}

                of{" "}

                <strong>
                  {
                    data?.pagination
                      .totalPages
                  }
                </strong>
              </p>

              <div className="flex gap-2">

                <Button
                  variant="outline"
                  disabled={
                    filters.page === 1 ||
                    isFetching
                  }
                  onClick={() =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        page:
                          (prev.page ??
                            1) - 1,
                      })
                    )
                  }
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  disabled={
                    (filters.page ??
                      1) >=
                      (data?.pagination
                        .totalPages ??
                        1) ||
                    isFetching
                  }
                  onClick={() =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        page:
                          (prev.page ??
                            1) + 1,
                      })
                    )
                  }
                >
                  Next
                </Button>

              </div>
            </div>
          </>
        )}

      {/* ===========================================
          DELETE INVOICE DIALOG
      =========================================== */}

      <DeleteInvoiceDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        loading={
          deleteInvoice.isPending
        }
        onConfirm={
          handleConfirmDelete
        }
      />

    </div>
  );
}