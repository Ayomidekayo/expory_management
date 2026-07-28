import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateClientStatus } from "../../api/client.api";
import { queryKeys } from "../../lib/queryKeys";

interface UpdateClientStatusPayload {
  id: string;
  isActive: boolean;
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: UpdateClientStatusPayload) =>
      updateClientStatus(id, isActive),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.detail(
          variables.id
        ),
      });

      toast.success(
        variables.isActive
          ? "Client activated successfully."
          : "Client deactivated successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update client status."
      );
    },
  });
}