import { useState } from "react";

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

import type { Invoice } from "../../../types/invoice";

import DeleteInvoiceDialog from "../DeleteInvoiceDialog";

interface Props {
  invoice: Invoice;

  onDelete?: (
    id: string
  ) => void;

  loading?: boolean;
}

export default function InvoiceActions({
  invoice,
  onDelete,
  loading = false,
}: Props) {
  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(invoice.id);
  };

  return (
    <>
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

        <DropdownMenuContent
          align="end"
        >
          {/* VIEW */}

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

          {/* EDIT */}

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

          {/* DELETE */}

          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              handleDeleteClick();
            }}
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />

            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* DELETE CONFIRMATION */}

      <DeleteInvoiceDialog
        open={deleteDialogOpen}
        onOpenChange={
          setDeleteDialogOpen
        }
        invoice={invoice}
        loading={loading}
        onConfirm={
          handleConfirmDelete
        }
      />
    </>
  );
}