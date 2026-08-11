import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateContainerTerminalCharge,
} from "../../api/container.api";

export function useUpdateContainerTerminalCharge() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateContainerTerminalCharge,

    onSuccess: (response) => {
      const container =
        response.data;

      // Refresh container list
      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });

      // Refresh this container's detail
      if (container?.id) {
        queryClient.invalidateQueries({
          queryKey: [
            "container",
            container.id,
          ],
        });
      }
    },
  });
}