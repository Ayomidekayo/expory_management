import { useNavigate } from "react-router-dom";

import InvoiceForm from "../../components/invoice/InvoiceForm";
import { useCreateInvoice } from "../../hooks/invoices/useCreateInvoice";



export default function CreateInvoicePage() {
  const navigate = useNavigate();

  const createInvoice =
    useCreateInvoice();

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Create Invoice
        </h1>

        <p className="text-muted-foreground">
          Create a commercial invoice for a shipment.
        </p>

      </div>

      <InvoiceForm
        loading={
          createInvoice.isPending
        }
        onSubmit={(values) =>
          createInvoice.mutate(
            values,
            {
              onSuccess: () => {
                navigate("/invoices");
              },
            }
          )
        }
      />

    </div>
  );
}