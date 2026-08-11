import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteInvoice,
} from "../../api/invoice.api";

export function useDeleteInvoice() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteInvoice(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });
}