import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { Button } from "../../ui/button";
import DeleteInvoiceDialog from "./DeleteInvoiceDialog";
import type { Invoice } from "../../../types";

interface Props {
  invoice: Invoice;
}

export default function InvoiceActions({
  invoice,
}: Props) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger
        asChild
      >
        <Button
          size="sm"
          variant="ghost"
        >
          •••
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>

        <DropdownMenuItem
          asChild
        >
          <Link
            to={`/invoices/${invoice.id}`}
          >
            <Eye className="mr-2 h-4 w-4" />

            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
        >
          <Link
            to={`/invoices/${invoice.id}/edit`}
          >
            <Pencil className="mr-2 h-4 w-4" />

            Edit
          </Link>
        </DropdownMenuItem>

        <DeleteInvoiceDialog
          invoice={invoice}
        >
          <DropdownMenuItem
            onSelect={(e) =>
              e.preventDefault()
            }
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />

            Delete
          </DropdownMenuItem>
        </DeleteInvoiceDialog>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}