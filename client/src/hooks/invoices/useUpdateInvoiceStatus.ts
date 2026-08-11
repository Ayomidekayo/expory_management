import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateInvoiceStatus,
} from "../../api/invoice.api";

import type {
  InvoiceStatus,
} from "../../types/invoice";

export function useUpdateInvoiceStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: InvoiceStatus;
    }) =>
      updateInvoiceStatus({
        id,
        status,
      }),

    onSuccess: (
      _data,
      variables
    ) => {
      /*
       * Refresh invoice list
       */
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      /*
       * Refresh individual invoice
       */
      queryClient.invalidateQueries({
        queryKey: [
          "invoice",
          variables.id,
        ],
      });
    },
  });
}