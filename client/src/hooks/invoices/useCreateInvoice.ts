import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createInvoice } from "../../api/invoice.api";

export function useCreateInvoice() {
  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      createInvoice,

    onSuccess() {

      queryClient.invalidateQueries({
        queryKey: [
          "invoices",
        ],
      });

      toast.success(
        "Invoice created successfully."
      );

    },

    onError(error: any) {

      toast.error(
        error?.response?.data?.message ??
          "Unable to create invoice."
      );

    },

  });
}