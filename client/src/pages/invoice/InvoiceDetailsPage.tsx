import { useState } from "react";
import {
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useInvoice } from "../../hooks/invoices/useInvoice";
import { useDeleteInvoice } from "../../hooks/invoices/useDeleteInvoice";

import {
  useInvoicePayments,
  useDeleteInvoicePayment,
} from "../../hooks/invoices/useInvoicePayments";

import InvoiceHeader from "../../components/invoice/details/InvoiceHeader";
import InvoiceSummaryCard from "../../components/invoice/details/InvoiceSummaryCard";
import InvoiceItemsTable from "../../components/invoice/details/InvoiceItemsTable";
import FinancialSummaryCard from "../../components/invoice/details/FinancialSummaryCard";
import RemarksCard from "../../components/invoice/details/RemarksCard";
import ShipmentInformationCard from "../../components/invoice/details/ShipmentInformationCard";
import InvoiceDocumentsCard from "../../components/invoice/details/InvoiceDocumentsCard";

import InvoicePaymentSummaryCard from "../../components/invoice/details/InvoicePaymentSummaryCard";
import InvoicePaymentHistory from "../../components/invoice/details/InvoicePaymentHistory";
import RecordPaymentDialog from "../../components/invoice/details/RecordPaymentDialog";
import DeletePaymentDialog from "../../components/invoice/details/DeletePaymentDialog";
import { printInvoice } from "../../utils/printInvoice";

export default function InvoiceDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [showPaymentDialog, setShowPaymentDialog] =
    useState(false);

  const [paymentToDelete, setPaymentToDelete] =
    useState<any | null>(null);

  const {
    data,
    isLoading,
  } = useInvoice(id);

  const deleteInvoice =
    useDeleteInvoice();

  const {
    data: paymentData,
    isLoading: paymentsLoading,
  } = useInvoicePayments(id);

  const deletePayment =
    useDeleteInvoicePayment();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="py-20 text-center">
        Invoice not found.
      </div>
    );
  }

  const invoice = data.data;

  const paymentSummary =
    paymentData?.summary;

  const payments =
    paymentData?.payments ?? [];

  const handleConfirmDeletePayment = () => {
    if (!paymentToDelete) return;

    deletePayment.mutate(
      {
        id: paymentToDelete.id,
        invoiceId: invoice.id,
      },
      {
        onSuccess: () => {
          setPaymentToDelete(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6">

      {/* Invoice Header */}
  <InvoiceHeader
  invoice={invoice}
  onPrint={() => {
    printInvoice(invoice);
  }}
  onDownloadPdf={() => {
    printInvoice(invoice);
  }}
  onDelete={() =>
    deleteInvoice.mutate(
      invoice.id,
      {
        onSuccess() {
          navigate("/invoices");
        },
      }
    )
  }
/>
      {/* Invoice Overview */}
      <div className="grid gap-6 lg:grid-cols-2">

        <InvoiceSummaryCard
          invoice={invoice}
        />

        <ShipmentInformationCard
          invoice={invoice}
        />

      </div>

      {/* Invoice Items */}
      <InvoiceItemsTable
        invoice={invoice}
      />

      {/* ========================= */}
      {/* PAYMENT SECTION */}
      {/* ========================= */}

      <div className="space-y-6">

        {/* Payment Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Payments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record and track payments made against this invoice.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowPaymentDialog(true)
            }
            disabled={paymentsLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CreditCard size={17} />
            Record Payment
          </button>

        </div>

        {/* Payment Loading */}
        {paymentsLoading ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-slate-200 bg-white">

            <div className="flex items-center gap-3 text-sm text-slate-500">

              <Loader2 className="h-5 w-5 animate-spin" />

              Loading payment information...

            </div>

          </div>
        ) : paymentSummary ? (
          <>

            {/* Payment Summary */}
            <InvoicePaymentSummaryCard
              summary={paymentSummary}
              currency={invoice.currency}
            />

            {/* Payment History */}
            <InvoicePaymentHistory
              payments={payments}
              summary={paymentSummary}
              currency={invoice.currency}
              onDelete={(payment) => {
                setPaymentToDelete(payment);
              }}
            />

          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">

            <p className="text-sm text-slate-500">
              Payment information is not available.
            </p>

          </div>
        )}

      </div>

      {/* Financial Information */}
      <div className="grid gap-6 lg:grid-cols-2">

        <FinancialSummaryCard
          invoice={invoice}
        />

        <RemarksCard
          invoice={invoice}
        />

      </div>

      {/* Documents */}
      <InvoiceDocumentsCard
        invoice={invoice}
      />

      {/* Delete Payment Dialog */}
      <DeletePaymentDialog
        open={!!paymentToDelete}
        loading={deletePayment.isPending}
        onClose={() => {
          if (!deletePayment.isPending) {
            setPaymentToDelete(null);
          }
        }}
        onConfirm={handleConfirmDeletePayment}
      />

      {/* Record Payment Dialog */}
      {showPaymentDialog && (
        <RecordPaymentDialog
          invoice={invoice}
          onClose={() =>
            setShowPaymentDialog(false)
          }
        />
      )}

    </div>
  );
}