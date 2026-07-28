import { Loader2 } from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import InvoiceForm from "../../components/invoice/InvoiceForm";
import { useUpdateInvoice } from "../../hooks/invoices/useUpdateInvoice";
import { useInvoice } from "../../hooks/invoices/useInvoice";
import { toInputDate } from "../../utils/date";



export default function EditInvoicePage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const updateInvoice =
    useUpdateInvoice();

  const {
    data,
    isLoading,
  } = useInvoice(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">

        <Loader2 className="h-8 w-8 animate-spin" />

      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        Invoice not found.
      </div>
    );
  }

  const invoice = data.data;

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Edit Invoice
        </h1>

        <p className="text-muted-foreground">
          Update invoice information.
        </p>

      </div>

      <InvoiceForm
        isEditing

        loading={
          updateInvoice.isPending
        }

        defaultValues={{
          ...invoice,

          invoiceDate:
            toInputDate(
              invoice.invoiceDate
            ),

          items:
            invoice.items.map(
              (item) => ({
                description:
                  item.description,

                hsCode:
                  item.hsCode ?? "",

                packageType:
                  item.packageType ??
                  "",

                packages:
                  item.packages ??
                  undefined,

                grossWeight:
                  item.grossWeight ??
                  undefined,

                netWeight:
                  item.netWeight ??
                  undefined,

                quantity:
                  Number(
                    item.quantity
                  ),

                unit:
                  item.unit ?? "",

                unitPrice:
                  Number(
                    item.unitPrice
                  ),

                remarks:
                  item.remarks ??
                  "",
              })
            ),
        }}

        onSubmit={(values) =>
          updateInvoice.mutate(
            {
              id: id!,
              payload: values,
            },
            {
              onSuccess: () =>
                navigate(
                  "/invoices"
                ),
            }
          )
        }
      />

    </div>
  );
}