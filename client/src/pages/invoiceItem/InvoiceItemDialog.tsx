import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import InvoiceItemForm from "../../components/form/InvoiceItemForm";
import { useCreateInvoiceItem } from "../../hooks/invoiceItems/useCreateInvoiceItem";
import { useUpdateInvoiceItem } from "../../hooks/invoiceItems/useUpdateInvoiceItem";
import type { InvoiceItem } from "../../api/auth/invoice-item.api";


interface Props {
  invoiceId: string;

  item?: InvoiceItem;

  open: boolean;

  onOpenChange: (open: boolean) => void;
}

export default function InvoiceItemDialog({
  invoiceId,
  item,
  open,
  onOpenChange,
}: Props) {
  const createMutation =
    useCreateInvoiceItem();

  const updateMutation =
    useUpdateInvoiceItem();

  const editing = !!item;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? "Edit Invoice Item"
              : "Add Invoice Item"}
          </DialogTitle>
        </DialogHeader>

        <InvoiceItemForm
          invoiceId={invoiceId}
          defaultValues={item}
          loading={
            createMutation.isPending ||
            updateMutation.isPending
          }
          onSubmit={(values) => {
            if (editing) {
              updateMutation.mutate(
                {
                  id: item.id,
                  data: values,
                },
                {
                  onSuccess() {
                    toast.success(
                      "Invoice item updated successfully."
                    );

                    onOpenChange(false);
                  },
                }
              );

              return;
            }

            createMutation.mutate(values, {
              onSuccess() {
                toast.success(
                  "Invoice item added successfully."
                );

                onOpenChange(false);
              },
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}