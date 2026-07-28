import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteInvoiceItem } from "../../api/auth/invoice-item.api";

export function useDeleteInvoiceItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteInvoiceItem,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["invoice-items"],
      });

      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });
}