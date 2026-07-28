import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteClient } from "../../api/client.api";

import { queryKeys } from "../../lib/queryKeys";

export function useDeleteClient() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteClient,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.all,
      });

      toast.success(
        "Client deleted successfully."
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to delete client."
      );
    },
  });
}