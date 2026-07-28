import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteInvoice } from "../../api/invoice.api";

export function useDeleteInvoice() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      deleteInvoice,

    onSuccess() {

      queryClient.invalidateQueries({
        queryKey: [
          "invoices",
        ],
      });

      toast.success(
        "Invoice deleted successfully."
      );

    },

    onError(error: any) {

      toast.error(
        error?.response?.data?.message ??
          "Unable to delete invoice."
      );

    },

  });

}