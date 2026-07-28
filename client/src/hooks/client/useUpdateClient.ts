import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateClient } from "../../api/client.api";
import { queryKeys } from "../../lib/queryKeys";

import type { UpdateClientDto } from "../../types/client.types";

interface UpdateClientPayload {
  id: string;
  payload: UpdateClientDto;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateClientPayload) =>
      updateClient(variables),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.detail(variables.id),
      });

      toast.success("Client updated successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to update client."
      );
    },
  });
}