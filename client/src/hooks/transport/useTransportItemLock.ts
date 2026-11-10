
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTransportItemLock } from "../../api/transport.api";

export function useTransportItemLock(transportId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      isLocked,
    }: {
      itemId: string;
      isLocked: boolean;
    }) => updateTransportItemLock(itemId, isLocked),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transports", transportId],
      });

      queryClient.invalidateQueries({
        queryKey: ["transports"],
      });

      toast.success(
        variables.isLocked
          ? "Transport item locked."
          : "Transport item unlocked.",
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Unable to update item lock.",
      );
    },
  });
}
