import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  updateContainer,
} from "../../api/container.api";

export function useUpdateContainer() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      updateContainer,

    onSuccess(_, variables) {

      queryClient.invalidateQueries({
        queryKey: [
          "containers",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "container",
          variables.id,
        ],
      });

      toast.success(
        "Container updated successfully."
      );

    },

    onError(error: any) {

      toast.error(

        error?.response?.data?.message ??

        "Unable to update container."

      );

    },

  });

}