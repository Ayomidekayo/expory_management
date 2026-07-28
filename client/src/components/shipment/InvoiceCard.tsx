import { Link } from "react-router-dom";

import { FileText, Plus, Eye } from "lucide-react";

import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Button } from "../ui/button";
import type { Shipment } from "../../types/shipment";

interface Props {
  shipment: Shipment;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function InvoiceCard({ shipment }: Props) {
  const invoice = shipment.invoice;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!invoice ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="font-semibold">No Invoice</h3>

            <p className="mb-6 text-sm text-muted-foreground">
              This shipment does not have an invoice yet.
            </p>

            <Button asChild>
              <Link to={`/invoices/new?shipmentId=${shipment.id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Row label="Invoice Number" value={invoice.invoiceNumber} />

            <Row
              label="Invoice Date"
              value={format(new Date(invoice.invoiceDate), "PPP")}
            />

            <Row label="Currency" value={invoice.currency} />

            <Row label="Trucks" value={invoice.numberOfTrucks.toString()} />

            <Row
              label="Freight"
              value={`${invoice.currency} ${Number(
                invoice.freight,
              ).toLocaleString()}`}
            />

            <Row
              label="Total Amount"
              value={`${invoice.currency} ${Number(
                invoice.totalAmount,
              ).toLocaleString()}`}
            />

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link to={`/invoices/${invoice.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Invoice
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
