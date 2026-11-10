
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteTransport } from "../../api/transport.api";

export function useDeleteTransport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransport,

    onSuccess: () => {
      // Refresh transport list
      queryClient.invalidateQueries({
        queryKey: ["transports"],
      });

      // Refresh transport details
      queryClient.invalidateQueries({
        queryKey: ["transports"],
      });

      toast.success("Transport deleted successfully.");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        "Unable to delete transport. Please try again.";

      toast.error(message);
    },
  });
}
