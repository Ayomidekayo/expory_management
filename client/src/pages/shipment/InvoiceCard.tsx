import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";


interface Props {
  shipment: any;
}

export default function InvoiceCard({
  shipment,
}: Props) {
  const invoice = shipment.invoice;

  return (
    <Card>

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle>
          Commercial Invoice
        </CardTitle>

        {invoice ? (
          <Button asChild variant="outline">
            <Link to={`/invoices/${invoice.id}`}>
              View Invoice
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link
              to={`/invoices/new?shipment=${shipment.id}`}
            >
              Create Invoice
            </Link>
          </Button>
        )}

      </CardHeader>

      <CardContent>

        {invoice ? (

          <div className="grid grid-cols-3 gap-6">

            <div>
              <p className="text-sm text-muted-foreground">
                Invoice Number
              </p>

              <p className="font-medium">
                {invoice.invoiceNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Currency
              </p>

              <p>{invoice.currency}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total
              </p>

              <p>
                {invoice.totalAmount}
              </p>
            </div>

          </div>

        ) : (

          <div className="flex items-center gap-3 text-muted-foreground">

            <FileText className="w-6 h-6"/>

            <p>
              No invoice has been created for this shipment.
            </p>

          </div>

        )}

      </CardContent>

    </Card>
  );
}