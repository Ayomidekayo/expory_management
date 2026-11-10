import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createTransportPayment } from "../../api/transport.api";

export function useCreateTransportPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: Parameters<typeof createTransportPayment>[1];
    }) => createTransportPayment(itemId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transports"],
      });

      queryClient.invalidateQueries({
        queryKey: ["transport-payments", variables.itemId],
      });

      toast.success("Payment recorded successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to record payment.",
      );
    },
  });
}