import { Loader2 } from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useInvoice } from "../../hooks/invoices/useInvoice";
import { useDeleteInvoice } from "../../hooks/invoices/useDeleteInvoice";

import InvoiceHeader from "../../components/invoice/details/InvoiceHeader";
import InvoiceSummaryCard from "../../components/invoice/details/InvoiceSummaryCard";
import InvoiceItemsTable from "../../components/invoice/details/InvoiceItemsTable";
import FinancialSummaryCard from "../../components/invoice/details/FinancialSummaryCard";
import RemarksCard from "../../components/invoice/details/RemarksCard";
import DocumentsCard from "../../components/invoice/details/DocumentCard";
import ShipmentInformationCard from "../../components/invoice/details/ShipmentInformationCard";

export default function InvoiceDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data,
    isLoading,
  } = useInvoice(id);

  const deleteInvoice =
    useDeleteInvoice();

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

  return (
    <div className="space-y-6">

      <InvoiceHeader
        invoice={invoice}
        onPrint={() => window.print()}
        onDownloadPdf={() => {
          console.log("Generate PDF");
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

      <div className="grid gap-6 lg:grid-cols-2">

        <InvoiceSummaryCard
          invoice={invoice}
        />

        <ShipmentInformationCard
          invoice={invoice}
        />

      </div>

      <InvoiceItemsTable
        invoice={invoice}
      />

      <div className="grid gap-6 lg:grid-cols-2">

        <FinancialSummaryCard
          invoice={invoice}
        />

        <RemarksCard
          invoice={invoice}
        />

      </div>

      <DocumentsCard
        invoice={invoice}
      />

    </div>
  );
}