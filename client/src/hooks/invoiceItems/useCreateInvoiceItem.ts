import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createInvoiceItem } from "../../api/auth/invoice-item.api";


export function useCreateInvoiceItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createInvoiceItem,

    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: [
          "invoice-items",
          variables.invoiceId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });
}