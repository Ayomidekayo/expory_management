
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTransport } from "../../api/transport.api";
import type { UpdateTransportPayload } from "../../types/transport";

interface UpdateTransportVariables {
  id: string;
  data: UpdateTransportPayload;
}

export function useUpdateTransport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTransportVariables) => {
      if (!id) {
        throw new Error("Transport ID is required.");
      }

      if (!data) {
        throw new Error("Transport update data is required.");
      }

      return updateTransport(id, data);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["transports"],
      });

      queryClient.invalidateQueries({
        queryKey: ["transports", data.id],
      });

      toast.success("Transport updated successfully.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          error.message ??
          "Unable to update transport."
      );
    },
  });
}
