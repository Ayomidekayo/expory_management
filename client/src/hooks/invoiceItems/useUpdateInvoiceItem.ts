import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateInvoiceItem } from "../../api/auth/invoice-item.api";


export function useUpdateInvoiceItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;

      data: any;
    }) =>
      updateInvoiceItem(id, data),

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