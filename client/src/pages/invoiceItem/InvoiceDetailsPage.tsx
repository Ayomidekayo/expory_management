import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import { Badge } from "../../components/ui/badge";

import { useInvoice } from "../../hooks/invoices/useInvoice";
import { Separator } from "../../components/ui/separator";
import InvoiceItemsTable from "./InvoiceItemsTable";

export default function InvoiceDetailsPage() {
  const { id } = useParams();

  const { data: invoice, isLoading } =
    useInvoice(id!);

  if (isLoading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <Card>

        <CardHeader>

          <div className="flex justify-between">

            <div>

              <CardTitle className="text-3xl">

                {invoice.invoiceNumber}

              </CardTitle>

              <p className="text-muted-foreground">

                Invoice Details

              </p>

            </div>

            <Badge>

              {invoice.currency}

            </Badge>

          </div>

        </CardHeader>

        <Separator />

        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">

          <div>

            <p className="text-muted-foreground text-sm">
              Shipment
            </p>

            <p className="font-medium">
              {invoice.shipment.shipmentNumber}
            </p>

          </div>

          <div>

            <p className="text-muted-foreground text-sm">
              Invoice Date
            </p>

            <p className="font-medium">
              {new Date(
                invoice.invoiceDate
              ).toLocaleDateString()}
            </p>

          </div>

          <div>

            <p className="text-muted-foreground text-sm">
              Currency
            </p>

            <p className="font-medium">
              {invoice.currency}
            </p>

          </div>

          <div>

            <p className="text-muted-foreground text-sm">
              Number of Trucks
            </p>

            <p className="font-medium">
              {invoice.numberOfTrucks}
            </p>

          </div>

          <div>

            <p className="text-muted-foreground text-sm">
              Freight
            </p>

            <p className="font-medium">

              {Number(
                invoice.freight
              ).toLocaleString()}

            </p>

          </div>

          <div>

            <p className="text-muted-foreground text-sm">
              Total Amount
            </p>

            <p className="text-2xl font-bold text-green-700">

              {Number(
                invoice.totalAmount
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}

            </p>

          </div>

        </CardContent>

      </Card>

      <InvoiceItemsTable
        invoiceId={invoice.id}
      />

    </div>
  );
}