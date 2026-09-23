import { toast } from "sonner";
import { queryKeys } from "../../lib/queryKeys";
import { createClient } from "../../api/client.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useCreateClient() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,

    onSuccess: () => {
      toast.success("Client created successfully.");

      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.all,
      });

      navigate("/clients");
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to create client."
      );
    },
  });
}