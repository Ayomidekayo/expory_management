
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createTransport } from "../../api/transport.api";

export function useCreateTransport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransport,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["transports"],
      });

      toast.success(
        "Transport created successfully."
      );
    },

    onError(error: any) {
      toast.error(
        error?.response?.data?.message ??
        "Unable to create transport."
      );
    },
  });
}
