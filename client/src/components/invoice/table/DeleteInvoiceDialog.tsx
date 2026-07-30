import { useDeleteInvoice } from "../../../hooks/invoices/useDeleteInvoice";
import type { Invoice } from "../../../types/invoice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";



interface Props {
  invoice: Invoice;

  children: React.ReactNode;
}

export default function DeleteInvoiceDialog({
  invoice,
  children,
}: Props) {
  const deleteInvoice =
    useDeleteInvoice();

  return (
    <AlertDialog>

      <AlertDialogTrigger
        asChild
      >
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Invoice?
          </AlertDialogTitle>

          <AlertDialogDescription>

            This action cannot be
            undone.

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              deleteInvoice.mutate(
                invoice.id
              )
            }
          >
            Delete
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
}