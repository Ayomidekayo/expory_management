import {
  Pencil,
  Printer,
  Download,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import type { Invoice } from "../../../types/invoice";

interface Props {
  invoice: Invoice;

  onPrint?: () => void;

  onDownloadPdf?: () => void;

  onDelete?: () => void;
}

export default function InvoiceHeader({
  invoice,
  onPrint,
  onDownloadPdf,
  onDelete,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <Link to="/invoices">

            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />

              Back to Invoices

            </Button>

          </Link>

          <div className="flex items-center gap-4">

            <div>

              <h1 className="text-3xl font-bold">

                {invoice.invoiceNumber}

              </h1>

              <p className="mt-1 text-muted-foreground">

                Commercial Invoice

              </p>

            </div>

            <Badge
              className="text-sm"
              variant={
                invoice.status === "PAID"
                  ? "default"
                  : invoice.status ===
                    "APPROVED"
                  ? "default"
                  : invoice.status ===
                    "SENT"
                  ? "secondary"
                  : invoice.status ===
                    "CANCELLED"
                  ? "destructive"
                  : "outline"
              }
            >
              {invoice.status.replaceAll(
                "_",
                " "
              )}
            </Badge>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            to={`/invoices/${invoice.id}/edit`}
          >
            <Button variant="outline">

              <Pencil className="mr-2 h-4 w-4" />

              Edit

            </Button>

          </Link>

          <Button
            variant="outline"
            onClick={onPrint}
          >

            <Printer className="mr-2 h-4 w-4" />

            Print

          </Button>

          <Button
            variant="outline"
            onClick={onDownloadPdf}
          >

            <Download className="mr-2 h-4 w-4" />

            PDF

          </Button>

          <Button
            variant="destructive"
            onClick={onDelete}
          >

            <Trash2 className="mr-2 h-4 w-4" />

            Delete

          </Button>

        </div>

      </div>

    </div>
  );
}