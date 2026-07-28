import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateInvoice } from "../../api/invoice.api";

export function useUpdateInvoice() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      updateInvoice,

    onSuccess(_, variables) {

      queryClient.invalidateQueries({
        queryKey: [
          "invoices",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "invoice",
          variables.id,
        ],
      });

      toast.success(
        "Invoice updated successfully."
      );

    },

    onError(error: any) {

      toast.error(
        error?.response?.data?.message ??
          "Unable to update invoice."
      );

    },

  });

}